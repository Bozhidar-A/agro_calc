'use client';

import useSeedingCombinedForm from '@/app/hooks/useSeedingCombinedForm';
import PlantCombinedCharts from '@/components/PlantCombinedCharts/PlantCombinedCharts';
import { SeedCombinedSection } from '@/components/SeedCombinedSection/SeedCombinedSection';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { APICaller } from '@/lib/api-util';
import { CalculateParticipation, FormatCombinedFormSavedToGraphDisplay, RoundToSecondStr } from '@/lib/seedingCombinedUtils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

interface PlantCombinedDBData {
    id: string;
    latinName: string;
    plantType: string;
    minSeedingRate: number;
    maxSeedingRate: number;
    priceFor1kgSeedsBGN: number;
}

export default function Combined() {
    const authObj = useSelector((state) => state.auth);

    //state for the fetched data from db
    const [dbData, setDbData] = useState<PlantCombinedDBData[]>([]);

    //fetch all the data from the db for this calculator and save it in the state
    useEffect(() => {
        const fetchData = async () => {
            const initData = await APICaller(['calc', 'combined', 'page', 'init'], '/api/calc/combined/input', "GET");
            if (!initData.success) {
                toast.error("Failed to fetch data", {
                    description: initData.message,
                });
                console.log(initData.message);
                return;
            }

            //convert to PlantDBData[] and save it in the state
            //ts is happy
            setDbData((initData.data));
        };
        fetchData();
    }, []);

    const { form, finalData, onSubmit, warnings } = useSeedingCombinedForm(authObj, dbData);

    if (!dbData || dbData.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
            <h1 className="text-2xl font-bold">Сеитбена норма на смеска</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-7xl">
                    <SeedCombinedSection name="legume" title="Многогодишни бобови фуражни култури" maxPercentage={60} form={form} dbData={dbData} />
                    <SeedCombinedSection name="cereal" title="Многогодишни житни фуражни култури" maxPercentage={40} form={form} dbData={dbData} />
                    <div className="border p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-2xl">Общо участие в смеската:</span>
                            <span className='text-2xl'>{CalculateParticipation(form.watch('legume')) + CalculateParticipation(form.watch('cereal'))}%</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-2xl">Крайна цена:</span>
                            <div>
                                <span className='text-2xl'>
                                    {RoundToSecondStr(
                                        form.watch('legume').reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0) +
                                        form.watch('cereal').reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0)
                                    )}
                                </span>
                                <span className='text-2xl'> BGN</span>
                            </div>
                        </div>
                        {form.formState.errors.root && (
                            <p className="text-red-500">{form.formState.errors.root.message}</p>
                        )}
                        {
                            Object.entries(warnings).map(([field, message]) => (
                                <p key={field} className="text-yellow-500">{message}</p>
                            ))
                        }
                    </div>
                    {
                        authObj.isAuthenticated && (<Button type="submit" className="w-full text-2xl" disabled={!form.formState.isValid}>
                            Запази тази сметка
                        </Button>)
                    }

                    {
                        form.formState.isValid && (<PlantCombinedCharts data={FormatCombinedFormSavedToGraphDisplay(finalData, dbData)} />)
                    }
                </form>
            </Form>
        </div>
    )
}
