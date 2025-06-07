'use client';

import { Beaker } from 'lucide-react';
import useChemProtWorkingForm from '@/app/hooks/useChemProtWorkingForm';
import { useTranslate } from '@/app/hooks/useTranslate';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChemWorkingSolutionCharts from '@/components/ChemWorkingSolutionCharts/ChemWorkingSolutionCharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ChemProtWorkingSolutionDisplayOutputRow } from '@/components/ChemProtWorkingSolutionDisplayOutputRow/ChemProtWorkingSolutionDisplayOutputRow';
import { ChemProtWorkingSolutionBuildInputRow } from '@/components/ChemProtWorkingSolutionBuildInputRow/ChemProtWorkingSolutionBuildInputRow';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingDisplay from '@/components/LoadingDisplay/LoadingDisplay';

export default function ChemicalProtectionWorkingSolution() {
    const { form, onSubmit, dataToBeSaved, CountWarnings, plantsChems, loading } = useChemProtWorkingForm();
    const unitOfMeasurement = useSelector((state: RootState) => state.local.unitOfMeasurementLength);
    const translator = useTranslate();
    const authObject = useSelector((state: RootState) => state.auth);

    if (loading) {
        return <LoadingDisplay />
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
                        <form onSubmit={form.handleSubmit(() => onSubmit())} className="space-y-6 sm:space-y-8">
                            <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
                                <h2 className="text-xl sm:text-2xl font-semibold">
                                    {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SELECT_PLANT)}
                                </h2>
                                <p className="text-sm text-black dark:text-white">
                                    {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SELECT_PLANT_DESCRIPTION)}
                                </p>
                                <FormField
                                    control={form.control}
                                    name="selectedPlantId"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="text-lg sm:text-xl py-4 sm:py-6 w-full max-w-xs">
                                                <SelectValue
                                                    placeholder={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SELECT_PLANT)}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {plantsChems
                                                    .filter((entry, index, self) =>
                                                        index === self.findIndex(e => e.plant.id === entry.plant.id)
                                                    )
                                                    .map((entry) => (
                                                        <SelectItem
                                                            key={entry.plant.id}
                                                            value={entry.plant.id}
                                                            className="text-black dark:text-white sm:text-lg py-2 sm:py-3"
                                                        >
                                                            {translator(entry.plant.latinName)}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {
                                form.watch('selectedPlantId') && (
                                    <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
                                        <h2 className="text-xl sm:text-2xl font-semibold">
                                            {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SELECT_CHEMICAL)}
                                        </h2>
                                        <p className="text-sm text-black dark:text-white">
                                            {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SELECT_CHEMICAL_DESCRIPTION)}
                                        </p>
                                        <FormField
                                            control={form.control}
                                            name="selectedChemicalId"
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value || ""}
                                                    defaultValue=""
                                                >
                                                    <SelectTrigger className="text-lg sm:text-xl py-4 sm:py-6 w-full max-w-xs">
                                                        <SelectValue
                                                            placeholder={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SELECT_CHEMICAL)}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {plantsChems
                                                            .filter(entry => entry.plant.id === form.watch('selectedPlantId'))
                                                            .map((entry) => (
                                                                <SelectItem
                                                                    key={entry.chemical.id}
                                                                    value={entry.chemical.id}
                                                                    className="text-black dark:text-white sm:text-lg py-2 sm:py-3"
                                                                >
                                                                    {translator(entry.chemical.nameKey)}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                )
                            }

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                                <ChemProtWorkingSolutionBuildInputRow
                                    varName="chemicalPerAcreML"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_CHEMICAL_PER_ACRE)}
                                    form={form}
                                    icon={<Beaker className="h-5 w-5" />}
                                    translator={translator}
                                    unit={unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ?
                                        translator(SELECTABLE_STRINGS.ML_ACRE) :
                                        translator(SELECTABLE_STRINGS.ML_HECTARE)}
                                    displayValue={form.watch('chemicalPerAcreML').toString()}
                                />
                                <ChemProtWorkingSolutionBuildInputRow
                                    varName="workingSolutionPerAcreLiters"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_WORKING_SOLUTION)}
                                    form={form}
                                    icon={<Beaker className="h-5 w-5" />}
                                    translator={translator}
                                    unit={translator(SELECTABLE_STRINGS.LITER)}
                                    displayValue={form.watch('workingSolutionPerAcreLiters').toString()}
                                />
                                <ChemProtWorkingSolutionBuildInputRow
                                    varName="sprayerVolumePerAcreLiters"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_SPRAYER_VOLUME)}
                                    form={form}
                                    icon={<Beaker className="h-5 w-5" />}
                                    translator={translator}
                                    unit={translator(SELECTABLE_STRINGS.LITER)}
                                    displayValue={form.watch('sprayerVolumePerAcreLiters').toString()}
                                />
                                <ChemProtWorkingSolutionBuildInputRow
                                    varName="areaToBeSprayedAcres"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_AREA)}
                                    form={form}
                                    icon={<Beaker className="h-5 w-5" />}
                                    translator={translator}
                                    unit={unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ?
                                        translator(SELECTABLE_STRINGS.ACRE) :
                                        translator(SELECTABLE_STRINGS.HECTARE)}
                                    displayValue={form.watch('areaToBeSprayedAcres').toString()}
                                />
                            </div>

                            {CountWarnings() > 0 && (
                                <div className="flex flex-row gap-2 justify-center">
                                    <p className="text-yellow-500">{translator(SELECTABLE_STRINGS.HAS_VALUE_OUTSIDE_SUGGESTED_RANGE)}</p>
                                </div>
                            )}

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
                                                <ChemProtWorkingSolutionDisplayOutputRow
                                                    data={dataToBeSaved.totalChemicalForAreaLiters}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_CHEMICAL)}
                                                    unit={translator(SELECTABLE_STRINGS.LITER)}
                                                />
                                                <ChemProtWorkingSolutionDisplayOutputRow
                                                    data={dataToBeSaved.totalWorkingSolutionForAreaLiters}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_SOLUTION)}
                                                    unit={translator(SELECTABLE_STRINGS.LITER)}
                                                />
                                                <ChemProtWorkingSolutionDisplayOutputRow
                                                    data={dataToBeSaved.roughSprayerCount}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SPRAYER_COUNT)}
                                                    unit=""
                                                    decimals={2}
                                                />
                                                <ChemProtWorkingSolutionDisplayOutputRow
                                                    data={dataToBeSaved.chemicalPerSprayerML}
                                                    text={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER)}
                                                    unit={translator(SELECTABLE_STRINGS.ML)}
                                                    decimals={0}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {form.formState.isValid && authObject?.user?.id && (
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
