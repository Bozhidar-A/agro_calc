'use client';

import { Droplet, Ruler, Scale, Beaker } from 'lucide-react';
import useChemProtWorkingForm from '@/app/hooks/useChemProtWorkingForm';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import ChemWorkingSolutionCharts from '@/components/ChemWorkingSolutionCharts/ChemWorkingSolutionCharts';

function BuildInputRow({
    varName,
    displayName,
    form,
    icon,
    translator,
    unit
}: {
    varName: string;
    displayName: string;
    form: any;
    icon: React.ReactNode;
    translator: (key: string) => string;
    unit: string;
}) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-green-700 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
                    {icon}
                    {displayName}
                </CardTitle>
                <CardDescription className="text-black/90 dark:text-white/90">
                    {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_DESCRIPTION)}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name={varName}
                        render={({ field }) => (
                            <Input
                                min={0}
                                className="text-center text-xl"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val === '' ? '' : Number(val));
                                }}
                            />
                        )}
                    />
                    <div className="text-center font-medium mt-1">
                        {`${isNaN(form.watch(varName)) ? 0 : form.watch(varName) || 0} ${unit}`}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DisplayOutputRow({ data, text, unit, decimals = 2 }: { data: number; text: string; unit: string; decimals?: number }) {
    const safeValue = isNaN(data) ? 0 : data;
    return (
        <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
            <span className="font-semibold text-lg sm:text-xl">{text}</span>
            <div>
                <span className="text-lg sm:text-xl font-bold">{safeValue.toFixed(decimals)}</span>
                <span className="text-lg sm:text-xl font-bold"> {unit}</span>
            </div>
        </div>
    );
}

export default function ChemicalProtectionWorkingSolution() {
    const translator = useTranslate();
    const authObject = useSelector((state: RootState) => state.auth);
    const unitOfMeasurementLength = useSelector((state: RootState) => state.local.unitOfMeasurementLength);
    const { form, onSubmit, dataToBeSaved } = useChemProtWorkingForm();

    // Helper to get the correct unit label
    let areaUnit = 'acres';
    let perAreaUnit = '/acre';
    if (unitOfMeasurementLength === UNIT_OF_MEASUREMENT_LENGTH.HECTARES) {
        areaUnit = 'hectares';
        perAreaUnit = '/hectare';
    }

    return (
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-green-700">
                    <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
                        {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE)}
                    </CardTitle>
                    <CardDescription className="text-black dark:text-white sm:text-lg">
                        {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_DESCRIPTION)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(() => onSubmit(dataToBeSaved))} className="space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                                <BuildInputRow
                                    varName="chemicalPerAcreML"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_CHEMICAL_PER_ACRE)}
                                    form={form}
                                    icon={<Droplet className="h-5 w-5" />}
                                    translator={translator}
                                    unit={`ml${perAreaUnit}`}
                                />
                                <BuildInputRow
                                    varName="workingSolutionPerAcreLiters"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_WORKING_SOLUTION)}
                                    form={form}
                                    icon={<Scale className="h-5 w-5" />}
                                    translator={translator}
                                    unit={`L${perAreaUnit}`}
                                />
                                <BuildInputRow
                                    varName="sprayerVolumePerAcreLiters"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_SPRAYER_VOLUME)}
                                    form={form}
                                    icon={<Beaker className="h-5 w-5" />}
                                    translator={translator}
                                    unit={`L${perAreaUnit}`}
                                />
                                <BuildInputRow
                                    varName="areaToBeSprayedAcres"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_AREA)}
                                    form={form}
                                    icon={<Ruler className="h-5 w-5" />}
                                    translator={translator}
                                    unit={areaUnit}
                                />
                            </div>

                            {form.formState.isValid && (
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <Card className="overflow-hidden">
                                        <CardHeader className="pb-3 sm:pb-4 bg-green-700 text-primary-foreground">
                                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-black dark:text-white">
                                                <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />
                                                {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_RESULTS_TITLE)}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-3 sm:pt-4">
                                            <div className="space-y-3 sm:space-y-4">
                                                <DisplayOutputRow
                                                    data={dataToBeSaved.totalChemicalForAreaLiters}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_CHEMICAL)}
                                                    unit="L"
                                                />
                                                <DisplayOutputRow
                                                    data={dataToBeSaved.totalWorkingSolutionForAreaLiters}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_SOLUTION)}
                                                    unit="L"
                                                />
                                                <DisplayOutputRow
                                                    data={dataToBeSaved.roughSprayerCount}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SPRAYER_COUNT)}
                                                    unit=""
                                                />
                                                <DisplayOutputRow
                                                    data={dataToBeSaved.chemicalPerSprayerLiters}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER)}
                                                    unit="L"
                                                    decimals={4}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {
                                        dataToBeSaved.isDataValid && authObject?.user?.id && (
                                            <div>
                                                <div className="flex justify-center mt-6 sm:mt-8">
                                                    <Button
                                                        type="submit"
                                                        size="lg"
                                                        disabled={!form.formState.isValid}
                                                        className="px-6 sm:px-8 text-lg sm:text-xl w-full max-w-md text-black dark:text-white"
                                                    >
                                                        {translator(SELECTABLE_STRINGS.SAVE_CALCULATION)}
                                                    </Button>
                                                </div>
                                                <ChemWorkingSolutionCharts data={dataToBeSaved} />
                                            </div>

                                        )
                                    }
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
