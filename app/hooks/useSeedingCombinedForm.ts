import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateDefaultValues, CreateZodSchemaForPlantRow, UpdateSeedingComboAndPriceDA, ValidateMixBalance } from "@/lib/seedingCombined-utils";
import { APICaller } from "@/lib/api-util";
import { RoundToSecondStr } from "@/lib/math-util";
import { useTranslate } from '@/app/hooks/useTranslate';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { ActivePlantsFormData, AuthState, CombinedCalcDBData, PlantCombinedDBData } from "@/lib/interfaces";

export default function useSeedingCombinedForm(authObj: AuthState, dbData: PlantCombinedDBData[]) {
    const translator = useTranslate();
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
                    pricePerAcreBGN: plant.priceSeedsPerAcreBGN,
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
                    pricePerAcreBGN: plant.priceSeedsPerAcreBGN,
                });
            }
        }

        const combinedData: CombinedCalcDBData = {
            plants,
            totalPrice: parseFloat(RoundToSecondStr(data.legume.reduce((acc, curr) => acc + curr.priceSeedsPerAcreBGN, 0) +
                data.cereal.reduce((acc, curr) => acc + curr.priceSeedsPerAcreBGN, 0))),
            userId: authObj?.user?.id || "",
            isDataValid: (form.formState.isValid && CountWarnings() === 0),
        };

        return combinedData;
    }

    //react-hook-form doesnt support warnings, so i have to hack my way around it
    const [warnings, setWarnings] = useState<Record<string, string>>({});
    function addWarning(field: string, message: string) {
        setWarnings((prev) => ({ ...prev, [field]: message }));
    }
    function removeWarning(field: string) {
        setWarnings((prev) => {
            const newWarnings = { ...prev };
            delete newWarnings[field];
            return newWarnings;
        });
    }
    function CountWarnings() {
        return Object.keys(warnings).length;
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

    // Update finalData when validation state changes
    useEffect(() => {
        if (finalData) {
            setFinalData(prev => ({
                ...prev!,
                isDataValid: (form.formState.isValid && CountWarnings() === 0)
            }));
        }
    }, [form.formState.isValid, warnings]);

    // Debug form state changes
    useEffect(() => {
        console.log('Form state changed:', {
            isValid: form.formState.isValid,
            isDirty: form.formState.isDirty,
            isSubmitting: form.formState.isSubmitting,
            errors: form.formState.errors,
            warnings
        });
    }, [form.formState.isValid, form.formState.isDirty, form.formState.isSubmitting, form.formState.errors, warnings]);

    //watcher to handle form value change
    //calculated vals
    useEffect(() => {
        const subscription = form.watch((_, { name }) => {
            if (name && name.includes('dropdownPlant')) {
                const [section, index] = name.split('.');
                const basePath = `${section}.${index}`;

                //on active dropdown plant change update the hidden id state var
                form.setValue(`${basePath}.id`, dbData.find((plant) => plant.latinName === form.getValues(basePath).dropdownPlant).id);
                form.setValue(`${basePath}.plantType`, dbData.find((plant) => plant.latinName === form.getValues(basePath).dropdownPlant).plantType);
            }

            if (name && (name.includes('participation') || name.includes('seedingRate') || name.includes('dropdownPlant'))) {
                UpdateSeedingComboAndPriceDA(form, name, dbData);
            }

            if (name && name.includes('seedingRate')) {
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
                            removeWarning(`${basePath}.seedingRate`);
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

            if (name && name.includes("active")) {
                const [section, index] = name.split('.');
                const basePath = `${section}.${index}`;
                const item = form.getValues(basePath);

                if (!item.active) {
                    //again hacky when active is false, clear all errors and warnings
                    removeWarning(`${basePath}.seedingRate`);
                    form.clearErrors(`${basePath}.seedingRate`);
                    removeWarning(`${basePath}.participation`);
                    form.clearErrors(`${basePath}.participation`);
                } else {
                    const selectedPlant = dbData.find((plant) => plant.id === item.id);
                    if (selectedPlant) {
                        if (item.seedingRate < selectedPlant.minSeedingRate || item.seedingRate > selectedPlant.maxSeedingRate) {
                            addWarning(`${basePath}.seedingRate`, `Seeding rate out of bounds`);
                        } else {
                            removeWarning(`${basePath}.seedingRate`);
                            form.clearErrors(`${basePath}.seedingRate`);
                        }
                    }

                    // // Revalidate participation if needed
                    // form.trigger();
                }
            }

            //update the final data to save to db
            setFinalData(UpdateFinalData(form.getValues()));
        });

        return () => subscription.unsubscribe();
    }, [form, dbData]);

    async function onSubmit(data: any) {
        let isAuthed = authObj?.isAuthenticated || false;

        if (!isAuthed) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_NOT_LOGGED_IN));
            return;
        }

        const res = await APICaller(['calc', 'combined', 'page', 'save history'], '/api/calc/combined/history', "POST", finalData);

        if (!res.success) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
                description: res.message,
            });
            console.log(res.message);
            return;
        }

        toast.success(translator(SELECTABLE_STRINGS.TOAST_SAVE_SUCCESS));
    }

    return { form, finalData, onSubmit, warnings, CountWarnings };
};
