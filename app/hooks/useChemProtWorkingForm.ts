import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { ChemProtWorkingToSave, ChemProtWorkingFormValues } from "@/lib/interfaces";
import { CalculateChemProtRoughSprayerCount, CalculateChemProtTotalChemicalLiters, CalculateChemProtTotalWorkingSolutionLiters, CalculateChemProtWorkingSolutionPerSprayerLiters, AcresToHectares } from "@/lib/math-util";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { APICaller } from "@/lib/api-util";
import { toast } from "sonner";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/app/hooks/useTranslate";
import { Log } from "@/lib/logger";

export default function useChemProtWorkingForm() {
    const translator = useTranslate();
    const authObject = useSelector((state: RootState) => state.auth);
    const unitOfMeasurement = useSelector((state: RootState) => state.local.unitOfMeasurementLength);
    const [dataToBeSaved, setDataToBeSaved] = useState<ChemProtWorkingToSave>({
        userId: authObject?.user?.id ?? '',
        totalChemicalForAreaLiters: 0,
        totalWorkingSolutionForAreaLiters: 0,
        roughSprayerCount: 0,
        chemicalPerSprayerLiters: 0,
        isDataValid: false,
    });

    const formSchema = z.object({
        chemicalPerAcreML: z.number().min(0),
        workingSolutionPerAcreLiters: z.number().min(0),
        sprayerVolumePerAcreLiters: z.number().min(0),
        areaToBeSprayedAcres: z.number().min(0),
    });

    const form = useForm<ChemProtWorkingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            chemicalPerAcreML: 0,
            workingSolutionPerAcreLiters: 0,
            sprayerVolumePerAcreLiters: 0,
            areaToBeSprayedAcres: 0,
        },
        mode: 'onChange',
        reValidateMode: 'onBlur'
    });

    // Trigger validation on mount
    useEffect(() => {
        form.trigger();
    }, []);

    //on change, recalc the data
    useEffect(() => {
        const subscription = form.watch((_) => {
            let { chemicalPerAcreML, workingSolutionPerAcreLiters, sprayerVolumePerAcreLiters, areaToBeSprayedAcres } = form.getValues();
            let isMathWorking = true;

            if (isNaN(chemicalPerAcreML) || chemicalPerAcreML < 0) {
                chemicalPerAcreML = 0;
            }

            if (isNaN(workingSolutionPerAcreLiters) || workingSolutionPerAcreLiters < 0) {
                workingSolutionPerAcreLiters = 0;
            }

            if (isNaN(sprayerVolumePerAcreLiters) || sprayerVolumePerAcreLiters < 0) {
                sprayerVolumePerAcreLiters = 0;
            }

            if (isNaN(areaToBeSprayedAcres) || areaToBeSprayedAcres < 0) {
                areaToBeSprayedAcres = 0;
            }

            const totalChemicalLiters = CalculateChemProtTotalChemicalLiters(chemicalPerAcreML, areaToBeSprayedAcres);
            const totalWorkingSolutionLiters = CalculateChemProtTotalWorkingSolutionLiters(workingSolutionPerAcreLiters, areaToBeSprayedAcres);
            const roughSprayerCount = CalculateChemProtRoughSprayerCount(totalWorkingSolutionLiters, areaToBeSprayedAcres, sprayerVolumePerAcreLiters);
            const workingSolutionPerSprayerLiters = CalculateChemProtWorkingSolutionPerSprayerLiters(chemicalPerAcreML, workingSolutionPerAcreLiters, areaToBeSprayedAcres, sprayerVolumePerAcreLiters);

            if (isNaN(totalChemicalLiters) || totalChemicalLiters < 0 || !isFinite(totalChemicalLiters)) {
                isMathWorking = false;
            }

            if (isNaN(totalWorkingSolutionLiters) || totalWorkingSolutionLiters < 0 || !isFinite(totalWorkingSolutionLiters)) {
                isMathWorking = false;
            }

            if (isNaN(roughSprayerCount) || roughSprayerCount < 0 || !isFinite(roughSprayerCount)) {
                isMathWorking = false;
            }

            if (isNaN(workingSolutionPerSprayerLiters) || workingSolutionPerSprayerLiters < 0 || !isFinite(workingSolutionPerSprayerLiters)) {
                isMathWorking = false;
            }

            setDataToBeSaved({
                userId: authObject?.user?.id,
                totalChemicalForAreaLiters: totalChemicalLiters,
                totalWorkingSolutionForAreaLiters: totalWorkingSolutionLiters,
                roughSprayerCount,
                chemicalPerSprayerLiters: workingSolutionPerSprayerLiters,
                isDataValid: form.formState.isValid && isMathWorking
            });
        });

        return () => subscription.unsubscribe();
    }, [form.watch()]);

    async function onSubmit() {
        try {
            const response = await APICaller(
                ['calc', 'chem-protection', 'working-solution', 'history'],
                '/api/calc/chem-protection/working-solution/history',
                'POST',
                dataToBeSaved
            );

            if (!response.success) {
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: response.message,
                });
                return;
            }

            toast.success(translator(SELECTABLE_STRINGS.TOAST_SAVE_SUCCESS));
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
            Log(["calc", "chem-protection", "working-solution", "history"], `POST failed with: ${errorMessage}`);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
        }
    }

    return {
        form,
        onSubmit,
        dataToBeSaved,
        unitOfMeasurement
    }
}
