'use client';

import { QUERIES } from '@/app/api/graphql/callable';
import { GraphQLCaller } from '@/app/api/graphql/graphql-utils';
import useSeedingCombinedForm from '@/app/hooks/useSeedingCombinedForm';
import { SeedCombinedSection } from '@/components/SeedCombinedSection/SeedCombinedSection';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CalculateParticipation, RoundToSecondStr } from '@/lib/seedingCombinedUtils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

interface PlantDBData {
    latinName: string;
    plantType: string;
    minSeedingRate: number;
    maxSeedingRate: number;
    priceFor1kgSeedsBGN: number;
}

export default function Combined() {
    const authObj = useSelector((state) => state.auth);

    //state for the fetched data from db
    const [dbData, setDbData] = useState<PlantDBData[]>([]);

    //fetch all the data from the db for this calculator and save it in the state
    useEffect(() => {
        const fetchData = async () => {
            const initData = await GraphQLCaller(["Seeding Combined Calculator", "Page", "Graphql", "Fetch SEEDING_COMBINED_ALL"], QUERIES.SEEDING_COMBINED_ALL, {});

            if (!initData.success) {
                toast.error("Failed to fetch data", {
                    description: initData.message,
                });
                console.log(initData.message);
                return;
            }

            console.log(initData.data);
            //convert to PlantDBData[] and save it in the state
            //ts is happy
            setDbData((initData.data as { SeedingCombinedAll: PlantDBData[] }).SeedingCombinedAll);
        };
        fetchData();
    }, []);

    const { form, onSubmit, warnings } = useSeedingCombinedForm(authObj, dbData);

    if (dbData.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10vh)] text-center">
            <h1 className="text-2xl font-bold">Seed Mixture Planner</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-5xl">
                    <SeedCombinedSection name="legume" title="Многогодишни бобови фуражни култури" maxPercentage={60} form={form} dbData={dbData} />
                    <SeedCombinedSection name="cereal" title="Многогодишни житни фуражни култури" maxPercentage={40} form={form} dbData={dbData} />
                    <div className="border p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">Total Mix Participation:</span>
                            <span>{CalculateParticipation(form.watch('legume')) + CalculateParticipation(form.watch('cereal'))}%</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">Total Price:</span>
                            <div>
                                <span>
                                    {RoundToSecondStr(
                                        form.watch('legume').reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0) +
                                        form.watch('cereal').reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0)
                                    )}
                                </span>
                                <span> BGN</span>
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
                        authObj.isAuthenticated && (<Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                            Запази тази сметка
                        </Button>)
                    }
                </form>
            </Form>
        </div>
    )
}
