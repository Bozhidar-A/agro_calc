import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GraphQLCaller } from "@/app/api/graphql/graphql-utils";
import { MUTATIONS } from "@/app/api/graphql/callable";
import { CreateDefaultValues, CreateZodSchemaForPlantRow, RoundToSecondStr, UpdateSeedingComboAndPriceDA, ValidateMixBalance } from "@/lib/seedingCombinedUtils";

interface ActivePlantsFormData {
    plantId: string;
    seedingRate: number;
    participation: number;
    combinedRate: number;
    pricePerDABGN: number;
}

interface CombinedCalcDBData {
    plants: ActivePlantsFormData[];
    totalPrice: number;
    userId: string;
    isDataValid: boolean;
}

export default function useSeedingCombinedForm(authObj, dbData) {
    //react-hook-form doesnt support warnings, so i have to hack my way around it
    const [warnings, setWarnings] = useState<Record<string, string>>({});
    function addWarning(field: string, message: string) {
        setWarnings((prev) => ({ ...prev, [field]: message }));
    }

    //object making react-hook-form and zod work together
    const formSchema = z
        .object({
            legume: z.array(CreateZodSchemaForPlantRow),
            cereal: z.array(CreateZodSchemaForPlantRow),
            // isDataValid: z.boolean(),
        })
        //all of this is blocking
        .superRefine((data, ctx) => {
            const isValid = ValidateMixBalance(data);

            if (!isValid) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Legumes max 60%, cereals max 40%, and total must be 100%',
                    path: ['root']
                });

            }
        });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: CreateDefaultValues(),
        mode: 'onBlur'
    });

    //watcher to handle form value change
    //calculated vals
    useEffect(() => {
        const subscription = form.watch((_, { name }) => {
            if (name && (name.includes('participation') || name.includes('seedingRate') || name.includes('dropdownPlant'))) {
                UpdateSeedingComboAndPriceDA(form, name, dbData);
            }

            if (name.includes('seedingRate')) {
                const [section, index] = name.split('.');
                const basePath = `${section}.${index}`;
                const item = form.getValues(basePath);

                if (item.active && item.dropdownPlant) {
                    const selectedPlant = dbData.find((plant) => plant.latinName === item.dropdownPlant);
                    if (selectedPlant) {
                        if (item.seedingRate < selectedPlant.minSeedingRate || item.seedingRate > selectedPlant.maxSeedingRate) {
                            addWarning(`${basePath}.seedingRate`, `Seeding rate out of bounds`);
                        }
                        else {
                            setWarnings((prev) => {
                                const newWarnings = { ...prev };
                                delete newWarnings[`${basePath}.seedingRate`];
                                return newWarnings;
                            });
                        }
                    }
                }
            }

            if (name && name.includes('participation')) {
                //devs know? about this, still not fixed, hacky workaround
                //https://github.com/orgs/react-hook-form/discussions/8516#discussioncomment-9138591
                //force all refined validations to run
                //will add the error for participation if one is applicable
                //VERY VERY hacky
                form.trigger(); // workaround trigger
            }
        });

        return () => subscription.unsubscribe();
    }, [form, dbData]);

    async function onSubmit(data) {
        if (!authObj.isAuthenticated) {
            toast.error("You need to be logged in to save this data");
            return;
        }

        const plants: ActivePlantsFormData[] = [];
        for (const plant of data.legume) {
            if (plant.active) {
                plants.push({
                    plantId: dbData.find((dbPlant) => dbPlant.latinName === plant.dropdownPlant).latinName,
                    seedingRate: plant.seedingRate,
                    participation: plant.participation,
                    combinedRate: plant.seedingRateInCombination,
                    pricePerDABGN: plant.priceSeedsPerDaBGN,
                });
            }
        }

        const combinedData: CombinedCalcDBData = {
            plants,
            totalPrice: parseFloat(RoundToSecondStr(data.legume.reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0) +
                data.cereal.reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0))),
            userId: authObj.user.id,
            isDataValid: (form.formState.isValid && Object.keys(warnings).length === 0),
        };

        const res = await GraphQLCaller(["Seeding Combined Calculator", "Page", "Graphql", "Insert INSERT_COMBINED_RESULT"], MUTATIONS.INSERT_COMBINED_RESULT, combinedData, false);

        if (!res.success) {
            toast.error("Failed to save data", {
                description: res.message,
            });
            console.log(res.message);
            return;
        }

        toast.success("Data saved successfully");
    }

    return { form, onSubmit, warnings };
};
