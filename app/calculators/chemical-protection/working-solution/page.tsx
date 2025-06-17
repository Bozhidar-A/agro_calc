'use client';

import "driver.js/dist/driver.css";
import { Beaker, History } from 'lucide-react';
import useChemProtWorkingForm from '@/hooks/useChemProtWorkingForm';
import { useTranslate } from '@/hooks/useTranslate';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getChemProtWorkingSolutionSteps, SpawnStartDriver } from '@/lib/driver-utils';
import { useEffect, useState } from "react";
import { WikiPlant } from "@/lib/interfaces";

export default function ChemicalProtectionWorkingSolution() {
    const { form, onSubmit, dataToBeSaved, CountWarnings, plantsChems, loading, lastUsedPlantId } = useChemProtWorkingForm();
    const unitOfMeasurement = useSelector((state: RootState) => state.local.unitOfMeasurementLength);
    const translator = useTranslate();
    const authObject = useSelector((state: RootState) => state.auth);
    const [lastUsedPlant, setLastUsedPlant] = useState<WikiPlant | null>(null);

    useEffect(() => {
        if (lastUsedPlantId) {
            //find the plant name for the suggestion box
            setLastUsedPlant(plantsChems.find(pc => pc.plant.id === lastUsedPlantId)?.plant ?? null);
        }
    }, [lastUsedPlantId, plantsChems]);

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
                    <CardDescription className="text-black dark:text-white sm:text-lg flex flex-col gap-2 items-center">
                        {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_DESCRIPTION)}
                        <Button
                            type="button"
                            onClick={() => {
                                SpawnStartDriver(getChemProtWorkingSolutionSteps(translator));
                            }}
                            className="bg-sky-500 text-black dark:text-white hover:bg-sky-600 text-sm sm:text-base"
                        >
                            {translator(SELECTABLE_STRINGS.NEED_HELP_Q)}
                        </Button>
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

                                {lastUsedPlant && !form.watch('selectedPlantId') && (
                                    <Alert className="mb-4 border-blue-200">
                                        <History className="h-4 w-4" />
                                        <AlertDescription className="flex items-center justify-between w-full gap-2">
                                            <span>{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_LAST_USED_PLANT)} - {translator(lastUsedPlant.latinName)}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                                                onClick={() => {
                                                    if (lastUsedPlantId) {
                                                        form.setValue('selectedPlantId', lastUsedPlantId, {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                            shouldTouch: true
                                                        });
                                                    }
                                                }}
                                            >
                                                {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_USE_THIS_PLANT)}
                                            </Button>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <FormField
                                    control={form.control}
                                    name="selectedPlantId"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id="plantSelection" className="text-lg sm:text-xl py-4 sm:py-6 w-full max-w-xs">
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

                            {form.watch('selectedPlantId') && (
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
                                                <SelectTrigger id="chemicalSelection" className="text-lg sm:text-xl py-4 sm:py-6 w-full max-w-xs">
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
                            )}

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
                                    id="chemicalPerAcreML"
                                />
                                <ChemProtWorkingSolutionBuildInputRow
                                    varName="workingSolutionPerAcreLiters"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_WORKING_SOLUTION)}
                                    form={form}
                                    icon={<Beaker className="h-5 w-5" />}
                                    translator={translator}
                                    unit={translator(SELECTABLE_STRINGS.LITER)}
                                    displayValue={form.watch('workingSolutionPerAcreLiters').toString()}
                                    id="workingSolutionPerAcreLiters"
                                />
                                <ChemProtWorkingSolutionBuildInputRow
                                    varName="sprayerVolumePerAcreLiters"
                                    displayName={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_INPUT_SPRAYER_VOLUME)}
                                    form={form}
                                    icon={<Beaker className="h-5 w-5" />}
                                    translator={translator}
                                    unit={translator(SELECTABLE_STRINGS.LITER)}
                                    displayValue={form.watch('sprayerVolumePerAcreLiters').toString()}
                                    id="sprayerVolumePerAcreLiters"
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
                                    id="areaToBeSprayedAcres"
                                />
                            </div>

                            {CountWarnings() > 0 && (
                                <div className="flex flex-row gap-2 justify-center">
                                    <p className="text-yellow-500">{translator(SELECTABLE_STRINGS.HAS_VALUE_OUTSIDE_SUGGESTED_RANGE)}</p>
                                </div>
                            )}

                            {form.formState.isValid && (
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <Card id="results" className="overflow-hidden">
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
                                                    id="saveCalculationButton"
                                                >
                                                    {translator(SELECTABLE_STRINGS.SAVE_CALCULATION)}
                                                </Button>
                                            </div>
                                            <div id="charts">
                                                <ChemWorkingSolutionCharts data={dataToBeSaved} />
                                            </div>
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
