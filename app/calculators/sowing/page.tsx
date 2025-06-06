'use client';

import "driver.js/dist/driver.css";
import { useEffect, useState } from 'react';
import { Droplet, Leaf, Ruler, Scale, Sprout } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import useSowingRateForm from '@/app/hooks/useSowingRateForm';
import { useTranslate } from '@/app/hooks/useTranslate';
import SowingCharts from '@/components/SowingCharts/SowingCharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { RootState } from '@/store/store';
import SowingOutput from '@/components/SowingOutput/SowingOutput';
import SowingTotalArea from '@/components/SowingTotalArea/SowingTotalArea';
import { IsValueOutOfBounds } from '@/lib/sowing-utils';
import { getSowingStepsNoPlant, getSowingStepsPickedPlant, SpawnStartDriver } from '@/lib/driver-utils';
import { useWatch } from 'react-hook-form';
import { CalculatorValueTypes } from "@/lib/utils";
import { BuildSowingRateRowProps, DisplayOutputRowProps, SowingRateDBData } from "@/lib/interfaces";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { Log } from "@/lib/logger";
import Errored from "@/components/Errored/Errored";

function FetchUnitIfExist(data) {
  return data.unit ? `${data.unit}` : '';
}


function BuildSowingRateRow<T extends Exclude<keyof SowingRateDBData, 'plant'>>({
  varName,
  displayName,
  activePlantDbData,
  form,
  icon,
  translator,
  tourId
}: BuildSowingRateRowProps<T> & { tourId: string }) {
  const neededData = activePlantDbData[varName];

  let inputValidityClass = 'border-green-700 focus-visible:ring-green-700';
  let inputValidityClassSlider = 'within-safe-range';

  if (IsValueOutOfBounds(form.watch(varName), neededData.type, neededData?.minSliderVal, neededData?.maxSliderVal, neededData?.constValue)) {
    inputValidityClass = 'border-red-500 focus-visible:ring-red-500';
    inputValidityClassSlider = 'outside-safe-range';
  }

  return (
    <Card className="overflow-hidden" id={tourId}>
      <CardHeader className="bg-green-700 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
          {icon}
          {displayName}
        </CardTitle>
        <CardDescription className="text-black/90 dark:text-white/90">
          {neededData.type === CalculatorValueTypes.SLIDER
            ? `${translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_SUGGESTED_RANGE)}: ${neededData.minSliderVal} - ${neededData.maxSliderVal} ${FetchUnitIfExist(neededData)}`
            : `${translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_SUGGESTED_VALUE)}: ${neededData.constValue || ''} ${FetchUnitIfExist(neededData)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-2">
          {neededData.type === CalculatorValueTypes.SLIDER ? (
            <>
              <FormField
                control={form.control}
                name={varName}
                render={({ field }) => (
                  <Input
                    className={`text-center text-xl ${inputValidityClass}`}
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
              <FormField
                control={form.control}
                name={varName}
                render={({ field }) => (
                  <Input
                    className={`w-full ${inputValidityClassSlider}`}
                    type="range"
                    min={neededData.minSliderVal}
                    max={neededData.maxSliderVal}
                    step={0.01}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
            </>
          ) : (
            <FormField
              control={form.control}
              name={varName}
              render={({ field }) => (
                <Input
                  className={`text-center text-xl ${inputValidityClass}`}
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              )}
            />
          )}
          <div className="text-center font-medium mt-1">
            {`${form.watch(varName) || 0} ${FetchUnitIfExist(neededData)}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DisplayOutputRow({ data, text, unit }: DisplayOutputRowProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="text-lg  font-bold">{text}:</div>
      <div className="text-lg font-bold ">
        {data}, {unit}
      </div>
    </div>
  );
}

export default function SowingRate() {
  const authObj = useSelector((state: RootState) => state.auth);
  const translator = useTranslate();
  const [dbData, setDbData] = useState<SowingRateDBData[]>([]);
  const [calculatedRate, setCalculatedRate] = useState<number | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await APICaller(
          ['calc', 'sowingRate', 'page', 'init'],
          '/api/calc/sowing/input',
          'GET'
        );

        if (!res.success) {
          toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
            description: res.message,
          });
          setErrored(true);
          return;
        }

        setDbData(res.data);
      } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["calc", "sowing", "page", "init"], `GET failed with: ${errorMessage}`);
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
          description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
        });
        setErrored(true);
      }
    };
    fetchData();
  }, []);

  const { form, onSubmit, warnings, activePlantDbData, dataToBeSaved } = useSowingRateForm(
    authObj,
    dbData
  );

  //on plant change swap to other drive
  const culturePicked = useWatch({
    control: form.control,
    name: 'cultureLatinName',
  });

  // Calculate sowing rate when form values change
  useEffect(() => {
    if (activePlantDbData && form.watch('cultureLatinName')) {
      const coefficientSecurity = form.watch('coefficientSecurity') || 0;
      const wantedPlants = form.watch('wantedPlantsPerMeterSquared') || 0;
      const massPer1000g = form.watch('massPer1000g') || 0;
      const purity = form.watch('purity') || 0;
      const germination = form.watch('germination') || 0;
      const rowSpacing = form.watch('rowSpacing') || 0;

      if (
        coefficientSecurity &&
        wantedPlants &&
        massPer1000g &&
        purity &&
        germination &&
        rowSpacing
      ) {
        // Formula: (wantedPlants * massPer1000g * 100 * 100 * coefficientSecurity) / (purity * germination * 1000)
        const rate =
          (wantedPlants * massPer1000g * 100 * 100 * coefficientSecurity) /
          (purity * germination * 1000);
        setCalculatedRate(Number.parseFloat(rate.toFixed(2)));
      }
    }
  }, [form.watch(), activePlantDbData]);

  if (errored) {
    return <Errored />
  }

  if (!dbData || dbData.length === 0) {
    return <LoadingDisplay />
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="text-center bg-green-700">
          <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
            {translator(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE)}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-base sm:text-lg">
            <Button
              type="button"
              onClick={() => {
                const steps = culturePicked ? getSowingStepsPickedPlant(translator) : getSowingStepsNoPlant(translator);
                SpawnStartDriver(steps);
              }}
              className="bg-sky-500 text-black dark:text-white hover:bg-sky-600 text-sm sm:text-base"
            >
              {translator(SELECTABLE_STRINGS.NEED_HELP_Q)}
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {translator(SELECTABLE_STRINGS.SOWING_RATE_PICK_CULTURE)}
                </h2>
                <FormField
                  control={form.control}
                  name="cultureLatinName"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="cultureSelect" className="text-lg sm:text-xl py-4 sm:py-6 w-full max-w-xs">
                        <SelectValue
                          placeholder={translator(SELECTABLE_STRINGS.SOWING_RATE_PICK_CULTURE)}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {dbData.map((plant) => (
                          <SelectItem
                            key={plant.plant.plantId}
                            value={plant.plant.plantLatinName}
                            className="text-base sm:text-lg py-2 sm:py-3"
                          >
                            {translator(plant.plant.plantLatinName)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {form.watch('cultureLatinName') && activePlantDbData && (
                <>
                  <div className="bg-green-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 flex flex-col items-center">
                    <h3 className="text-lg sm:text-xl font-medium mb-2">
                      {translator(SELECTABLE_STRINGS.SOWING_RATE_SELECTED_CULTURE)}
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-center">
                      {translator(form.watch('cultureLatinName'))}
                      <span className="ml-2">
                        <i>({form.watch('cultureLatinName')})</i>
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <BuildSowingRateRow
                      varName="coefficientSecurity"
                      displayName={translator(
                        SELECTABLE_STRINGS.SOWING_RATE_INPUT_COEFFICIENT_SECURITY
                      )}
                      activePlantDbData={activePlantDbData}
                      form={form}
                      icon={<Scale className="h-5 w-5" />}
                      translator={translator}
                      tourId="safetyCoefficient"
                    />
                    <BuildSowingRateRow
                      varName="wantedPlantsPerMeterSquared"
                      displayName={translator(
                        SELECTABLE_STRINGS.SOWING_RATE_INPUT_WANTED_PLANTS_PER_M2
                      )}
                      activePlantDbData={activePlantDbData}
                      form={form}
                      icon={<Sprout className="h-5 w-5" />}
                      translator={translator}
                      tourId="wantedPlantsPerMeterSquared"
                    />
                    <BuildSowingRateRow
                      varName="massPer1000g"
                      displayName={translator(
                        SELECTABLE_STRINGS.SOWING_RATE_INPUT_MASS_PER_1000g_SEEDS
                      )}
                      activePlantDbData={activePlantDbData}
                      form={form}
                      icon={<Scale className="h-5 w-5" />}
                      translator={translator}
                      tourId="massPer1000g"
                    />
                    <BuildSowingRateRow
                      varName="purity"
                      displayName={translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_PURITY)}
                      activePlantDbData={activePlantDbData}
                      form={form}
                      icon={<Droplet className="h-5 w-5" />}
                      translator={translator}
                      tourId="purity"
                    />
                    <BuildSowingRateRow
                      varName="germination"
                      displayName={translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_GERMINATION)}
                      activePlantDbData={activePlantDbData}
                      form={form}
                      icon={<Leaf className="h-5 w-5" />}
                      translator={translator}
                      tourId="germination"
                    />
                    <BuildSowingRateRow
                      varName="rowSpacing"
                      displayName={translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_ROW_SPACING)}
                      activePlantDbData={activePlantDbData}
                      form={form}
                      icon={<Ruler className="h-5 w-5" />}
                      translator={translator}
                      tourId="rowSpacing"
                    />
                  </div>

                  {Object.keys(warnings).length > 0 && (
                    <div className="flex flex-col items-center space-y-4 mt-8">
                      <h2 className="text-yellow-500 text-xl">
                        {translator(SELECTABLE_STRINGS.HAS_VALUE_OUTSIDE_SUGGESTED_RANGE)}
                      </h2>
                    </div>
                  )}

                  {form.formState.isValid && calculatedRate !== null && (
                    <div className="flex flex-col gap-4 sm:gap-6">
                      <SowingOutput dataToBeSaved={dataToBeSaved} />

                      <SowingTotalArea form={form} dataToBeSaved={dataToBeSaved} />

                      <div className="flex justify-center mt-6 sm:mt-8">
                        <Button id="saveCalculationButton" type="submit" size="lg" className="px-6 sm:px-8 text-lg sm:text-xl w-full max-w-md text-black dark:text-white">
                          {translator(SELECTABLE_STRINGS.SAVE_CALCULATION)}
                        </Button>
                      </div>
                    </div>
                  )}

                  {form.formState.isValid && <SowingCharts data={dataToBeSaved} />}
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
