'use client';

import { APICaller } from "@/lib/api-util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CmToMeters, MetersSquaredToAcre, MetersToCm, ToFixedNumber } from "@/lib/math-util";
import { IsValueOutOfBounds } from "@/lib/sowing-utils";
import { useTranslate } from '@/app/hooks/useTranslate';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { AuthState } from "@/store/slices/authSlice";
import { CalculatorValueTypes } from "@/lib/utils";
import { ActivePlantDbData, SowingRateSaveData } from "@/lib/interfaces";


export default function useSowingRateForm(authObj: AuthState, dbData: ActivePlantDbData[]) {
    const translator = useTranslate();
    const [activePlantDbData, setActivePlantDbData] = useState<ActivePlantDbData | null>(null);
    const [dataToBeSaved, setDataToBeSaved] = useState<SowingRateSaveData>({
        userId: '',
        plantId: '',
        plantLatinName: '',
        sowingRateSafeSeedsPerMeterSquared: 0,
        sowingRatePlantsPerAcre: 0,
        usedSeedsKgPerAcre: 0,
        internalRowHeightCm: 0,
        totalArea: 1,
        isDataValid: false
    });

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


    const formSchema = z.object({
        cultureLatinName: z.string(),
        coefficientSecurity: z.number()
            .min(0, 'Coefficient security must be at least 0')
            .max(100, 'Coefficient security cannot exceed 100'),
        wantedPlantsPerMeterSquared: z.number()
            .min(0, 'Wanted plants per meter squared must be at least 0'),
        massPer1000g: z.number()
            .min(0, 'Mass per 1000g must be at least 0'),
        purity: z.number()
            .min(0, 'Purity must be at least 0'),
        germination: z.number()
            .min(0, 'Germination must be at least 0'),
        rowSpacing: z.number()
            .min(0, 'Row spacing must be at least 0'),
        totalArea: z.number()
            .min(0, 'Total area must be at least 0')
            .transform(val => isNaN(val) ? 0 : val),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cultureLatinName: '',
            coefficientSecurity: 0,
            wantedPlantsPerMeterSquared: 0,
            massPer1000g: 0,
            purity: 0,
            germination: 0,
            rowSpacing: 0,
            totalArea: 1,
        },
        mode: 'onChange',
        reValidateMode: 'onBlur'
    })

    // Trigger validation on mount
    //EXTREMELY HACKY SOLUTION, but it works
    //this is to make the form validate on mount specifically for errors
    useEffect(() => {
        form.trigger();
    }, []);

    useEffect(() => {
        const subscription = form.watch((_, { name }) => {
            const plant = dbData.find(entry => entry.plant.plantLatinName === form.getValues('cultureLatinName'));

            if (name === 'cultureLatinName' && plant) {
                console.log(plant);
                setActivePlantDbData(plant);

                form.setValue('coefficientSecurity', plant.coefficientSecurity.type === CalculatorValueTypes.SLIDER ? plant.coefficientSecurity.minSliderVal : plant.coefficientSecurity.constValue);
                form.setValue('wantedPlantsPerMeterSquared', plant.wantedPlantsPerMeterSquared.type === CalculatorValueTypes.SLIDER ? plant.wantedPlantsPerMeterSquared.minSliderVal : plant.wantedPlantsPerMeterSquared.constValue);
                form.setValue('massPer1000g', plant.massPer1000g.type === CalculatorValueTypes.SLIDER ? plant.massPer1000g.minSliderVal : plant.massPer1000g.constValue);
                form.setValue('purity', plant.purity.type === CalculatorValueTypes.SLIDER ? plant.purity.minSliderVal : plant.purity.constValue);
                form.setValue('germination', plant.germination.type === CalculatorValueTypes.SLIDER ? plant.germination.minSliderVal : plant.germination.constValue);
                form.setValue('rowSpacing', plant.rowSpacing.type === CalculatorValueTypes.SLIDER ? plant.rowSpacing.minSliderVal : plant.rowSpacing.constValue);
                return;
            }

            if (!plant) {
                //dont do the checks if we dont have a plant
                return;
            }

            //this feels stupid, but it works
            if (IsValueOutOfBounds(
                form.getValues('coefficientSecurity'),
                plant.coefficientSecurity.type,
                plant.coefficientSecurity.minSliderVal,
                plant.coefficientSecurity.maxSliderVal,
                plant.coefficientSecurity.constValue)) {
                addWarning('coefficientSecurity', 'Value out of bounds!');
            } else {
                removeWarning('coefficientSecurity');
            }

            if (IsValueOutOfBounds(
                form.getValues('wantedPlantsPerMeterSquared'),
                plant.wantedPlantsPerMeterSquared.type,
                plant.wantedPlantsPerMeterSquared.minSliderVal,
                plant.wantedPlantsPerMeterSquared.maxSliderVal,
                plant.wantedPlantsPerMeterSquared.constValue)) {
                addWarning('wantedPlantsPerMeterSquared', 'Value out of bounds!');
            } else {
                removeWarning('wantedPlantsPerMeterSquared');
            }

            if (IsValueOutOfBounds(
                form.getValues('massPer1000g'),
                plant.massPer1000g.type,
                plant.massPer1000g.minSliderVal,
                plant.massPer1000g.maxSliderVal,
                plant.massPer1000g.constValue)) {
                addWarning('massPer1000g', 'Value out of bounds!');
            } else {
                removeWarning('massPer1000g');
            }

            if (IsValueOutOfBounds(
                form.getValues('purity'),
                plant.purity.type,
                plant.purity.minSliderVal,
                plant.purity.maxSliderVal,
                plant.purity.constValue)) {
                addWarning('purity', 'Value out of bounds!');
            } else {
                removeWarning('purity');
            }

            if (IsValueOutOfBounds(
                form.getValues('germination'),
                plant.germination.type,
                plant.germination.minSliderVal,
                plant.germination.maxSliderVal,
                plant.germination.constValue)) {
                addWarning('germination', 'Value out of bounds!');
            } else {
                removeWarning('germination');
            }

            if (IsValueOutOfBounds(
                form.getValues('rowSpacing'),
                plant.rowSpacing.type,
                plant.rowSpacing.minSliderVal,
                plant.rowSpacing.maxSliderVal,
                plant.rowSpacing.constValue)) {
                addWarning('rowSpacing', 'Value out of bounds!');
            } else {
                removeWarning('rowSpacing');
            }

            if (IsValueOutOfBounds(form.getValues('totalArea'), CalculatorValueTypes.ABOVE_ZERO)) {
                addWarning('totalArea', 'Value out of bounds!');
            } else {
                removeWarning('totalArea');
            }

        });

        return () => subscription.unsubscribe();
    }, [form, dbData]);

    useEffect(() => {
        const calculateSavingData = () => {
            // Only calculate if we have a selected plant
            if (!activePlantDbData) {
                return;
            }

            const formValues = form.getValues();

            // Get all the required values
            const wantedPlantsPerMeterSquared = (formValues.wantedPlantsPerMeterSquared * 100) /
                (formValues.germination * formValues.coefficientSecurity);

            const sowingRatePlantsPerAcre = MetersSquaredToAcre(wantedPlantsPerMeterSquared);

            const usedSeedsKgPerAcre = (wantedPlantsPerMeterSquared * formValues.massPer1000g * 10) /
                (formValues.purity * formValues.germination);

            const internalRowHeightCm = MetersToCm((1000 / CmToMeters(formValues.rowSpacing))) / sowingRatePlantsPerAcre;

            console.log("isValid:", form.formState.isValid && CountWarnings() === 0)

            // Create the saveable data
            const saveableData: SowingRateSaveData = {
                userId: authObj?.user?.id || '',
                plantId: activePlantDbData.plant.plantId,
                plantLatinName: activePlantDbData.plant.plantLatinName,
                sowingRateSafeSeedsPerMeterSquared: ToFixedNumber(wantedPlantsPerMeterSquared, 0),
                sowingRatePlantsPerAcre: ToFixedNumber(sowingRatePlantsPerAcre, 0),
                usedSeedsKgPerAcre: ToFixedNumber(usedSeedsKgPerAcre, 2),
                internalRowHeightCm: ToFixedNumber(internalRowHeightCm, 2),
                totalArea: formValues.totalArea,
                isDataValid: form.formState.isValid && CountWarnings() === 0
            };

            setDataToBeSaved(saveableData);
        };

        // Call immediately to update calculations on activePlantDbData change
        calculateSavingData();

        // Also subscribe to form changes
        const subscription = form.watch(() => {
            calculateSavingData();
        });

        return () => subscription.unsubscribe();
    }, [form, activePlantDbData, authObj, warnings]);


    async function onSubmit(data: any) {
        if (!authObj.isAuthenticated) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_NOT_LOGGED_IN));
            return;
        }

        if (!activePlantDbData) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_NO_PLANT_SELECTED));
            return;
        }

        const res = await APICaller(['calc', 'combined', 'page', 'save history'], '/api/calc/sowing/history', "POST", dataToBeSaved);

        if (!res.success) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
                description: res.message,
            });
            console.log(res.message);
            return;
        }

        toast.success(translator(SELECTABLE_STRINGS.TOAST_SAVE_SUCCESS));
    }

    return { form, onSubmit, warnings, activePlantDbData, dataToBeSaved, CountWarnings };
}