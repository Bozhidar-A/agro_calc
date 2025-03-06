'use client';
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormMessage } from "@/components/ui/form";

// Zod schema for a single plant row
const CreateSeedSchema = z.object({
    active: z.boolean(),
    dropdownPlant: z.string(),
    seedingRate: z.number().min(0, "Seeding rate must be at least 0"),
    participation: z.number().min(0, "Participation must be at least 0%").max(100, "Participation cannot exceed 100%"),
    seedingRateInCombination: z.number().min(0, "Seeding rate in combination must be at least 0"),
    priceSeedsPerDaBGN: z.number().min(0, "Price must be at least 0")
});

// Form schema validation
const formSchema = z.object({
    legumes: z.array(CreateSeedSchema),
    cereals: z.array(CreateSeedSchema)
}).refine(ValidateMixBalance, {
    message: "Legumes max 60%, cereals max 40%, and total must be 100%",
    path: ["mixBalance"]
});

// Function to validate mix balance
function ValidateMixBalance(data) {
    const totalLegumes = CalculateParticipation(data.legumes);
    const totalCereals = CalculateParticipation(data.cereals);
    return totalLegumes <= 60 && totalCereals <= 40 && Math.abs(totalLegumes + totalCereals - 100) < 0.01;
}

// Function to calculate total participation
function CalculateParticipation(items) {
    let totalParticipation = 0;
    for (const item of items) {
        if (item.active) {
            totalParticipation += Number(item.participation) || 0;
        }
    }
    return totalParticipation;
}

// Default form values
function CreateDefaultValues() {
    return {
        legumes: Array(3).fill({ active: false, dropdownPlant: '', seedingRate: 0, participation: 0, seedingRateInCombination: 0, priceSeedsPerDaBGN: 0 }),
        cereals: Array(3).fill({ active: false, dropdownPlant: '', seedingRate: 0, participation: 0, seedingRateInCombination: 0, priceSeedsPerDaBGN: 0 })
    };
}

export default function Combined() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: CreateDefaultValues()
    });

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name?.includes('participation') || name?.includes('seedingRate')) {
                UpdateSeedingRateInCombination(form, name);
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = (data) => console.log(data);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10vh)] text-center">
            <h1 className="text-2xl font-bold">Seed Mixture Planner</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-5xl">
                    <SeedSection name="legumes" title="Многогодишни бобови фуражни култури" maxPercentage={60} form={form} />
                    <SeedSection name="cereals" title="Многогодишни житни фуражни култури" maxPercentage={40} form={form} />
                    <ParticipationSummary form={form} />
                    <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                        Потвърди
                    </Button>
                </form>
            </Form>
        </div>
    );
}

const SeedSection = ({ name, title, maxPercentage, form }) => {
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
                    <SeedRow key={index} form={form} name={name} index={index} />
                ))}
            </div>
        </div>
    );
};

const SeedRow = ({ form, name, index }) => (
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
                    <SelectItem value="option1">Опция 1</SelectItem>
                    <SelectItem value="option2">Опция 2</SelectItem>
                </SelectContent>
            </Select>
        )} />
        {["seedingRate", "participation", "seedingRateInCombination", "priceSeedsPerDaBGN"].map((field) => (
            <FormField key={field} control={form.control} name={`${name}.${index}.${field}`} render={({ field, fieldState }) => (
                <div>
                    <Input
                        type="number"
                        min={0} {...field}
                        disabled={!form.watch(`${name}.${index}.active`)}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} //convert to number
                    />
                    {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
            )} />
        ))}
    </div>
);

const ParticipationSummary = ({ form }) => {
    const totalLegumes = CalculateParticipation(form.watch('legumes'));
    const totalCereals = CalculateParticipation(form.watch('cereals'));
    const total = totalLegumes + totalCereals;
    const isIncorrect = Math.abs(total - 100) > 0.01 && total > 0;
    const hasNegativeValues = totalLegumes < 0 || totalCereals < 0;

    return (
        <div className="border p-4 rounded-md">
            <div className="flex justify-between mb-2">
                <span className="font-semibold">Total Mix Participation:</span>
                <span className={isIncorrect ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
                    {total.toFixed(1)}%
                </span>
            </div>
            {hasNegativeValues && <p className="text-red-500 font-medium">Values cannot be negative.</p>}
            {isIncorrect && <p className="text-red-500 font-medium">Total must be 100%. Adjust values.</p>}
        </div>
    );
};

function UpdateSeedingRateInCombination(form, name) {
    const [section, index] = name.split('.');
    const item = form.getValues(`${section}.${index}`);
    if (item.active && item.seedingRate && item.participation) {
        form.setValue(`${section}.${index}.seedingRateInCombination`, (item.seedingRate * item.participation) / 100);
    }
}
