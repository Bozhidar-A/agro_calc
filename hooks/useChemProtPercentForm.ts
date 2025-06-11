import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { APICaller } from "@/lib/api-util";
import { toast } from "sonner";
import { Log } from "@/lib/logger";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { ChemProtPercentFormValues, AuthState } from "@/lib/interfaces";
import { useTranslate } from "@/hooks/useTranslate";
import { CalculateChemProtPercentSolution } from "@/lib/math-util";

export default function useChemProtPercentForm(authObject: AuthState) {
    const translator = useTranslate();
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

    const formSchema = z.object({
        desiredPercentage: z.number().min(0).max(100),
        sprayerVolume: z.number().min(0),
    });

    const form = useForm<ChemProtPercentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            desiredPercentage: 0,
            sprayerVolume: 0,
        },
        mode: 'onChange'
    });

    // Trigger initial validation and calculation
    useEffect(() => {
        form.trigger().then(() => {
            const desiredPercentage = form.getValues('desiredPercentage') || 0;
            const sprayerVolume = form.getValues('sprayerVolume') || 0;

            if (desiredPercentage && sprayerVolume) {
                const amount = CalculateChemProtPercentSolution(desiredPercentage, sprayerVolume);
                setCalculatedAmount(Number.parseFloat(amount.toFixed(2)));
            }
        });
    }, []);

    // Calculate amount when form values change
    useEffect(() => {
        const desiredPercentage = form.watch('desiredPercentage') || 0;
        const sprayerVolume = form.watch('sprayerVolume') || 0;

        if (desiredPercentage && sprayerVolume) {
            // Formula: desiredPercentage * 10 * sprayerVolume
            const amount = CalculateChemProtPercentSolution(desiredPercentage, sprayerVolume);
            setCalculatedAmount(Number.parseFloat(amount.toFixed(2)));
        }
    }, [form.watch()]);

    const onSubmit = async (data: ChemProtPercentFormValues) => {
        try {
            const response = await APICaller(
                ['calc', 'chem-protection', 'percent-solution', 'history'],
                '/api/calc/chem-protection/percent-solution/history',
                'POST',
                {
                    ...data,
                    userId: authObject?.user?.id,
                    calculatedAmount,
                }
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
            Log(["calc", "chem-protection", "percent-solution", "history"], `POST failed with: ${errorMessage}`);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
        }
    };

    return {
        form,
        onSubmit,
        calculatedAmount,
    };
}
