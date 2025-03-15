'use client';

import { APICaller } from "@/lib/api-util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SowingRateDBData } from "../calculators/sowing/page";

export default function useSowingRateForm(authObj, dbData) {
    const [activePlantDbData, setActivePlantDbData] = useState<SowingRateDBData | null>(null);

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
            .min(0, 'Row spacing must be at least 0')
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
            rowSpacing: 0
        },
        mode: 'onBlur'
    })

    useEffect(() => {
        const subscription = form.watch((_, { name }) => {
            console.log(name);
            console.log(form.getValues('cultureLatinName'));
            if (name === 'cultureLatinName') {
                console.log("setting")
                const plant = dbData.find(entry => entry.plant.plantLatinName === form.getValues('cultureLatinName'));
                setActivePlantDbData(plant);

                form.setValue('coefficientSecurity', plant.coefficientSecurity.type === 'slider' ? plant.coefficientSecurity.minSliderVal : plant.coefficientSecurity.constValue);
                form.setValue('wantedPlantsPerMeterSquared', plant.wantedPlantsPerMeterSquared.type === 'slider' ? plant.wantedPlantsPerMeterSquared.minSliderVal : plant.wantedPlantsPerMeterSquared.constValue);
                form.setValue('massPer1000g', plant.massPer1000g.type === 'slider' ? plant.massPer1000g.minSliderVal : plant.massPer1000g.constValue);
                form.setValue('purity', plant.purity.type === 'slider' ? plant.purity.minSliderVal : plant.purity.constValue);
                form.setValue('germination', plant.germination.type === 'slider' ? plant.germination.minSliderVal : plant.germination.constValue);
                form.setValue('rowSpacing', plant.rowSpacing.type === 'slider' ? plant.rowSpacing.minSliderVal : plant.rowSpacing.constValue);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, dbData])


    async function onSubmit(data) {
        if (!authObj.isAuthenticated) {
            toast.error("You need to be logged in to save this data");
            return;
        }
        // const res = await APICaller(['calc', 'combined', 'page', 'save history'], '/api/calc/combined/history', "POST", finalData);

        // if (!res.success) {
        //     toast.error("Failed to save data", {
        //         description: res.message,
        //     });
        //     console.log(res.message);
        //     return;
        // }

        toast.success("Data saved successfully");
    }

    return { form, onSubmit, activePlantDbData };
}