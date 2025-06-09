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
import { ActivePlantsFormData, AuthState, CombinedCalcDBData, CombinedFormValues, PlantCombinedDBData } from "@/lib/interfaces";
import { useWarnings } from "@/app/hooks/useWarnings";

export default function useSeedingCombinedForm(authObj: AuthState, dbData: PlantCombinedDBData[]) {
    const translator = useTranslate();
    //final data to save to db
    const [finalData, setFinalData] = useState<CombinedCalcDBData | null>(null);

    function UpdateFinalData(data: CombinedFormValues) {
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
            totalPrice: parseFloat(RoundToSecondStr(data.legume.reduce((acc: number, curr) => acc + curr.priceSeedsPerAcreBGN, 0) +
                data.cereal.reduce((acc: number, curr) => acc + curr.priceSeedsPerAcreBGN, 0))),
            userId: authObj?.user?.id || "",
            isDataValid: (form.formState.isValid && CountWarnings() === 0),
        };

        return combinedData;
    }

    //react-hook-form doesnt support warnings, so i have to hack my way around it
    const { warnings, AddWarning, RemoveWarning, CountWarnings } = useWarnings();

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

    const form = useForm<CombinedFormValues>({
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

    //watcher to handle form value change
    //calculated vals
    useEffect(() => {
        const subscription = form.watch((_value, { name }) => {
            if (!name) { return; }

            const [section, index] = name.split('.');
            if (!section || !index) { return; }

            const values = form.getValues();
            const rowData = values[section as keyof CombinedFormValues]?.[parseInt(index, 10)];
            if (!rowData) { return; }

            //handle dropdown plant change
            if (name.includes('dropdownPlant') && rowData.dropdownPlant) {
                const selectedPlant = dbData.find((plant) => plant.latinName === rowData.dropdownPlant);
                if (selectedPlant) {
                    //batch update the form values
                    type FormPath = keyof CombinedFormValues | `${keyof CombinedFormValues}.${number}.id` | `${keyof CombinedFormValues}.${number}.plantType`;
                    const batch: Record<FormPath, string> = {
                        [`${section}.${index}.id`]: selectedPlant.id,
                        [`${section}.${index}.plantType`]: selectedPlant.plantType
                    } as Record<FormPath, string>;

                    Object.entries(batch).forEach(([path, value]) => {
                        const formPath = path as FormPath;
                        const currentValue = form.getValues(formPath);
                        if (currentValue !== value) {
                            form.setValue(formPath, value, { shouldValidate: false });
                        }
                    });
                }
            }

            //handle active state change
            if (name.includes('active')) {
                type FormFieldPath = `${keyof CombinedFormValues}.${number}.${'seedingRate' | 'participation'}`;

                const seedingRatePath = `${section}.${index}.seedingRate` as FormFieldPath;
                const participationPath = `${section}.${index}.participation` as FormFieldPath;

                if (!rowData.active) {
                    //clear errors and warnings when deactivated
                    RemoveWarning(seedingRatePath);
                    form.clearErrors(seedingRatePath);
                    RemoveWarning(participationPath);
                    form.clearErrors(participationPath);
                } else {
                    //validate when activated
                    const selectedPlant = dbData.find((plant) => plant.id === rowData.id);
                    if (selectedPlant && rowData.seedingRate) {
                        if (rowData.seedingRate < selectedPlant.minSeedingRate || rowData.seedingRate > selectedPlant.maxSeedingRate) {
                            AddWarning(seedingRatePath, `Seeding rate out of bounds`);
                        } else {
                            RemoveWarning(seedingRatePath);
                            form.clearErrors(seedingRatePath);
                        }
                    }
                }
            }

            //handle seeding rate change
            if (name.includes('seedingRate') && rowData.active && rowData.dropdownPlant) {
                const selectedPlant = dbData.find((plant) => plant.id === rowData.id);
                if (selectedPlant) {
                    type FormFieldPath = `${keyof CombinedFormValues}.${number}.seedingRate`;
                    const warningPath = `${section}.${index}.seedingRate` as FormFieldPath;
                    if (rowData.seedingRate < selectedPlant.minSeedingRate || rowData.seedingRate > selectedPlant.maxSeedingRate) {
                        AddWarning(warningPath, `Seeding rate out of bounds`);
                    } else {
                        RemoveWarning(warningPath);
                    }
                }
            }

            //update calculations if relevant fields changed
            if (name.includes('participation') || name.includes('seedingRate') || name.includes('dropdownPlant')) {
                UpdateSeedingComboAndPriceDA(form, name, dbData);
            }

            //update final data
            setFinalData(UpdateFinalData(form.getValues()));
        });

        return () => subscription.unsubscribe();
    }, [form, dbData]);

    async function onSubmit() {
        const isAuthed = authObj?.isAuthenticated || false;

        if (!isAuthed) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_NOT_LOGGED_IN));
            return;
        }

        const res = await APICaller(['calc', 'combined', 'page', 'save history'], '/api/calc/combined/history', "POST", finalData);

        if (!res.success) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
                description: res.message,
            });
            return;
        }

        toast.success(translator(SELECTABLE_STRINGS.TOAST_SAVE_SUCCESS));
    }

    return { form, finalData, onSubmit, warnings, CountWarnings };
};


