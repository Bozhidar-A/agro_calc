'use client';

import { MUTATIONS, QUERIES } from '@/app/api/graphql/callable';
import { GraphQLCaller } from '@/app/api/graphql/graphql-utils';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { number, z } from 'zod';

interface PlantDBData {
    latinName: string;
    plantType: string;
    minSeedingRate: number;
    maxSeedingRate: number;
    priceFor1kgSeedsBGN: number;
}

interface ActivePlantsFormData {
    plantId: string;
    seedingRate: number;
    participation: number;
    combinedRate: number;
    pricePerDA: number;
}

interface CombinedCalcDBData {
    plants: ActivePlantsFormData[];
    totalPrice: number;
    userId: string;
    isDataValid: boolean;
}


const CreateZodSchemaForPlantRow = z.object({
    active: z.boolean(),
    dropdownPlant: z.string(),
    seedingRate: z.number().min(0, 'Seeding rate must be at least 0'),
    participation: z
        .number()
        .min(0, 'Participation must be at least 0%')
        .max(100, 'Participation cannot exceed 100%'),
    seedingRateInCombination: z.number().min(0, 'Seeding rate in combination must be at least 0'),
    priceSeedsPerDaBGN: z.number().min(0, 'Price must be at least 0'),
});

function CreateDefaultValues() {
    return {
        legume: Array(3).fill({
            active: false,
            dropdownPlant: '',
            seedingRate: 0,
            participation: 0,
            seedingRateInCombination: 0,
            priceSeedsPerDaBGN: 0,
        }),
        cereal: Array(3).fill({
            active: false,
            dropdownPlant: '',
            seedingRate: 0,
            participation: 0,
            seedingRateInCombination: 0,
            priceSeedsPerDaBGN: 0,
        }),
    };
}

function CalculateParticipation(items) {
    let totalParticipation = 0;
    for (const item of items) {
        if (item.active) {
            totalParticipation += Number(item.participation) || 0;
        }
    }
    return totalParticipation;
}

function ValidateMixBalance(data) {
    const totalLegumes = CalculateParticipation(data.legume);
    const totalCereals = CalculateParticipation(data.cereal);
    const total = totalLegumes + totalCereals;

    if (totalLegumes > 60 || totalCereals > 40 || total !== 100) {
        return false;
    }

    return true;
}

function UpdateSeedingComboAndPriceDA(form, name, dbData) {
    const [section, index, fieldName] = name.split('.');
    const basePath = `${section}.${index}`;
    const item = form.getValues(basePath);

    if (item.active && item.seedingRate && item.participation && item.dropdownPlant) {
        const seedingRateInCombinationTmp = (item.seedingRate * item.participation) / 100;

        const selectedPlant = dbData.find((plant) => plant.latinName === item.dropdownPlant);
        if (selectedPlant) {
            const newSeedingRateInCombination = (item.seedingRate * item.participation) / 100;
            const newPriceSeedsPerDaBGN = newSeedingRateInCombination * selectedPlant.priceFor1kgSeedsBGN;

            // Only update if values changed to avoid infinite loop
            const prevSeedingRateInCombination = form.getValues(`${basePath}.seedingRateInCombination`);
            const prevPriceSeedsPerDaBGN = form.getValues(`${basePath}.priceSeedsPerDaBGN`);

            if (prevSeedingRateInCombination !== newSeedingRateInCombination) {
                form.setValue(`${basePath}.seedingRateInCombination`, newSeedingRateInCombination, { shouldValidate: false });
            }

            if (prevPriceSeedsPerDaBGN !== newPriceSeedsPerDaBGN) {
                form.setValue(`${basePath}.priceSeedsPerDaBGN`, newPriceSeedsPerDaBGN, { shouldValidate: false });
            }
        }
    }
}



function SeedSection({ name, title, maxPercentage, form, dbData }) {
    const participation = CalculateParticipation(form.watch(name));

    return (
        <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="flex justify-between">
                <span>Total Participation: {participation.toFixed(1)}%</span>
                <span className={participation > maxPercentage ? "text-red-500 font-bold" : ""}>
                    Max: {maxPercentage}%
                </span>
            </div>
            {participation > maxPercentage && <p className="text-red-500 font-medium">Reduce participation.</p>}
            <div className="grid gap-4">
                <div className="grid grid-cols-6 gap-4 font-medium text-lg m-2">
                    <div>Active</div>
                    <div>Plant Type</div>
                    <div>Seeding Rate</div>
                    <div>Participation %</div>
                    <div>Combined Rate</div>
                    <div>Price/Da (BGN)</div>
                </div>
                {form.watch(name).map((_, index) => (
                    <SeedRow key={index} form={form} name={name} index={index} dbData={dbData} />
                ))}
            </div>
        </div>
    );
};

function SeedRow({ form, name, index, dbData }) {
    // Get the selected plant
    const selectedPlant = dbData.find((plant) => plant.latinName === form.watch(`${name}.${index}.dropdownPlant`));

    return (
        <div className="grid grid-cols-6 gap-4 items-center">
            <FormField control={form.control} name={`${name}.${index}.active`} render={({ field }) => (
                <div className="flex justify-center items-center">
                    <Input type="checkbox" checked={field.value} onChange={field.onChange} className="w-5 h-5" />
                </div>
            )} />

            <FormField control={form.control} name={`${name}.${index}.dropdownPlant`} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch(`${name}.${index}.active`)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                        {dbData.map((plant) => (
                            plant.plantType === name && (
                                <SelectItem key={plant.latinName} value={plant.latinName}>
                                    {plant.latinName}
                                </SelectItem>
                            )
                        ))}
                    </SelectContent>
                </Select>
            )} />

            {/* Seeding Rate */}
            <FormField control={form.control} name={`${name}.${index}.seedingRate`} render={({ field, fieldState }) => (
                <div>
                    <Input
                        type="number"
                        step="0.1"
                        {...field}
                        disabled={!form.watch(`${name}.${index}.active`) || form.watch(`${name}.${index}.dropdownPlant`) === ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} // Convert to number
                    />
                    {/* Show min/max dynamically */}
                    {selectedPlant && (
                        <p className="text-yellow-500 text-sm">
                            Min: {selectedPlant.minSeedingRate} | Max: {selectedPlant.maxSeedingRate}
                        </p>
                    )}
                    {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
            )} />

            {/* Participation */}
            <FormField control={form.control} name={`${name}.${index}.participation`} render={({ field, fieldState }) => (
                <div>
                    <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={100}
                        {...field}
                        disabled={!form.watch(`${name}.${index}.active`) || form.watch(`${name}.${index}.dropdownPlant`) === ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                    {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
            )} />

            {/* seedingRateInCombination */}
            <FormField control={form.control} name={`${name}.${index}.seedingRateInCombination`} render={({ field }) => (
                <Input disabled value={form.watch(`${name}.${index}.seedingRateInCombination`) || 0} />
            )} />

            {/* priceSeedsPerDaBGN */}
            <FormField control={form.control} name={`${name}.${index}.priceSeedsPerDaBGN`} render={({ field }) => (
                <Input disabled value={form.watch(`${name}.${index}.priceSeedsPerDaBGN`) || 0} />
            )} />
        </div>
    );
}

function RoundToSecondFloat(num: number) {
    return num.toFixed(2);
}

export default function Combined() {
    const authObj = useSelector((state) => state.auth);

    //state for the fetched data from db
    const [dbData, setDbData] = useState<PlantDBData[]>([]);

    //react-hook-form doesnt support warnings, so i have to hack my way around it
    const [warnings, setWarnings] = useState<Record<string, string>>({});
    function addWarning(field: string, message: string) {
        setWarnings((prev) => ({ ...prev, [field]: message }));
    }

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
                    pricePerDA: plant.priceSeedsPerDaBGN,
                });
            }
        }

        const combinedData: CombinedCalcDBData = {
            plants,
            totalPrice: parseFloat(RoundToSecondFloat(data.legume.reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0) +
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

    if (dbData.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10vh)] text-center">
            <h1 className="text-2xl font-bold">Seed Mixture Planner</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-5xl">
                    <SeedSection name="legume" title="Многогодишни бобови фуражни култури" maxPercentage={60} form={form} dbData={dbData} />
                    <SeedSection name="cereal" title="Многогодишни житни фуражни култури" maxPercentage={40} form={form} dbData={dbData} />
                    <div className="border p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">Total Mix Participation:</span>
                            <span>{CalculateParticipation(form.watch('legume')) + CalculateParticipation(form.watch('cereal'))}%</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">Total Price:</span>
                            <div>
                                <span>
                                    {RoundToSecondFloat(
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
