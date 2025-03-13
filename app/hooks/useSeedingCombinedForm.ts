import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateDefaultValues, CreateZodSchemaForPlantRow, RoundToSecondStr, UpdateSeedingComboAndPriceDA, ValidateMixBalance } from "@/lib/seedingCombinedUtils";
import { APICaller } from "@/lib/api-util";

interface ActivePlantsFormData {
    plantId: string;
    plantType: string;
    seedingRate: number;
    participation: number;
    combinedRate: number;
    pricePerDABGN: number;
}

export interface CombinedCalcDBData {
    plants: ActivePlantsFormData[];
    totalPrice: number;
    userId: string;
    isDataValid: boolean;
}

export default function useSeedingCombinedForm(authObj, dbData) {
    //final data to save to db
    const [finalData, setFinalData] = useState<CombinedCalcDBData | null>(null);

    function UpdateFinalData(data) {
        const plants: ActivePlantsFormData[] = [];
        for (const plant of data.legume) {
            if (plant.active) {
                plants.push({
                    plantId: plant.id,
                    plantType: plant.plantType,
                    seedingRate: plant.seedingRate,
                    participation: plant.participation,
                    combinedRate: plant.seedingRateInCombination,
                    pricePerDABGN: plant.priceSeedsPerDaBGN,
                });
            }
        }

        for (const plant of data.cereal) {
            if (plant.active) {
                plants.push({
                    plantId: plant.id,
                    plantType: plant.plantType,
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

        return combinedData;
    }

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
            if (name?.includes('dropdownPlant')) {
                const [section, index] = name.split('.');
                const basePath = `${section}.${index}`;

                //on active dropdown plant change update the hidden id state var
                form.setValue(`${basePath}.id`, dbData.find((plant) => plant.latinName === form.getValues(basePath).dropdownPlant).id);
                form.setValue(`${basePath}.plantType`, dbData.find((plant) => plant.latinName === form.getValues(basePath).dropdownPlant).plantType);
            }

            if (name && (name.includes('participation') || name.includes('seedingRate') || name.includes('dropdownPlant'))) {
                UpdateSeedingComboAndPriceDA(form, name, dbData);
            }

            if (name.includes('seedingRate')) {
                const [section, index] = name.split('.');
                const basePath = `${section}.${index}`;
                const item = form.getValues(basePath);

                if (item.active && item.dropdownPlant) {
                    const selectedPlant = dbData.find((plant) => plant.id === item.id);
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

            //update the final data to save to db
            setFinalData(UpdateFinalData(form.getValues()));
        });

        return () => subscription.unsubscribe();
    }, [form, dbData]);

    async function onSubmit(data) {
        if (!authObj.isAuthenticated) {
            toast.error("You need to be logged in to save this data");
            return;
        }
        const res = await APICaller(['calc', 'combined', 'page', 'save history'], '/api/calc/combined/history', "POST", finalData);

        if (!res.success) {
            toast.error("Failed to save data", {
                description: res.message,
            });
            console.log(res.message);
            return;
        }

        toast.success("Data saved successfully");
    }

    return { form, finalData, onSubmit, warnings };
};
