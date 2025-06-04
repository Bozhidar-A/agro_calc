'use client';

import { Droplet, Scale } from 'lucide-react';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import useChemProtPercentForm from '@/app/hooks/useChemProtPercentForm';
import { ChemProtPercentFormValues } from '@/lib/interfaces';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

function BuildInputRow({
    varName,
    displayName,
    form,
    icon,
    unit,
}: {
    varName: keyof ChemProtPercentFormValues;
    displayName: string;
    form: any;
    icon: React.ReactNode;
    unit: string;
}) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-green-700 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
                    {icon}
                    {displayName}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name={varName}
                        render={({ field }) => (
                            <Input
                                className="text-center text-xl"
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // If empty or not a number, set to 0
                                    if (value === '' || isNaN(Number(value))) {
                                        field.onChange(0);
                                        return;
                                    }
                                    field.onChange(Number(value));
                                }}
                            />
                        )}
                    />
                    <div className="text-center font-medium mt-1">
                        {`${form.watch(varName) || 0} ${unit}`}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PercentSolution() {
    const translator = useTranslate();
    const authObject = useSelector((state: RootState) => state.auth);
    const { form, onSubmit, calculatedAmount } = useChemProtPercentForm(authObject);

    return (
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-green-700">
                    <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
                        {translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <BuildInputRow
                                    varName="desiredPercentage"
                                    displayName={translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_DESIRED_PERCENTAGE)}
                                    form={form}
                                    icon={<Droplet className="h-5 w-5" />}
                                    unit="%"
                                />
                                <BuildInputRow
                                    varName="sprayerVolume"
                                    displayName={translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_SPRAYER_VOLUME)}
                                    form={form}
                                    icon={<Scale className="h-5 w-5" />}
                                    unit="L"
                                />
                            </div>

                            {calculatedAmount !== null && (
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <Card className="bg-green-50 dark:bg-green-900">
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <h3 className="text-xl font-semibold mb-2">
                                                    {translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_RESULT)}
                                                </h3>
                                                <p className="text-2xl font-bold">
                                                    {calculatedAmount} ml/g
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <p>{JSON.stringify(form.formState.isValid)}</p>
                                    <p>{JSON.stringify(authObject.isAuthenticated)}</p>

                                    {form.formState.isValid && authObject.isAuthenticated && (
                                        <div className="flex justify-center mt-6 sm:mt-8">
                                            <Button type="submit" size="lg" className="px-6 sm:px-8 text-lg sm:text-xl w-full max-w-md text-black dark:text-white">
                                                {translator(SELECTABLE_STRINGS.SAVE_CALCULATION)}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
