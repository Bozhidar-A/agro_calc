'use client';

import 'driver.js/dist/driver.css';

import { useEffect, useState } from 'react';
import { Droplet, Leaf, Ruler, Scale, Sprout } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { BuildSowingRateRow } from '@/components/BuildSowingRateRow/BuildSowingRateRow';
import Errored from '@/components/Errored/Errored';
import LoadingDisplay from '@/components/LoadingDisplay/LoadingDisplay';
import SowingCharts from '@/components/SowingCharts/SowingCharts';
import SowingOutput from '@/components/SowingOutput/SowingOutput';
import SowingTotalArea from '@/components/SowingTotalArea/SowingTotalArea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useSowingRateForm from '@/hooks/useSowingRateForm';
import { useTranslate } from '@/hooks/useTranslate';
import { APICaller } from '@/lib/api-util';
import {
  getSowingStepsNoPlant,
  getSowingStepsPickedPlant,
  SpawnStartDriver,
} from '@/lib/driver-utils';
import { DisplayOutputRowProps, SowingRateDBData } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';

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
  const translator = useTranslate();
  const [dbData, setDbData] = useState<SowingRateDBData[]>([]);
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
        Log(['calc', 'sowing', 'page', 'init'], `GET failed with: ${errorMessage}`);
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
          description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
        });
        setErrored(true);
      }
    };
    fetchData();
  }, []);

  const { form, onSubmit, warnings, activePlantDbData, dataToBeSaved } = useSowingRateForm(dbData);

  //on plant change swap to other drive
  const culturePicked = useWatch({
    control: form.control,
    name: 'cultureLatinName',
  });

  if (errored) {
    return <Errored />;
  }

  if (!dbData || dbData.length === 0) {
    return <LoadingDisplay />;
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="text-center bg-green-700">
          <CardTitle className="text-2xl sm:text-3xl text-white dark:text-white">
            {translator(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE)}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-base sm:text-lg">
            <Button
              type="button"
              onClick={() => {
                const steps = culturePicked
                  ? getSowingStepsPickedPlant(translator)
                  : getSowingStepsNoPlant(translator);
                SpawnStartDriver(steps);
              }}
              className="bg-sky-500  dark:text-white hover:bg-sky-600 text-sm sm:text-base"
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
                      <SelectTrigger
                        id="cultureSelect"
                        className="text-lg sm:text-xl py-4 sm:py-6 w-full max-w-xs"
                      >
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
                    <h3 className="text-lg sm:text-xl font-medium mb-2 text-white">
                      {translator(SELECTABLE_STRINGS.SOWING_RATE_SELECTED_CULTURE)}
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-center text-white">
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

                  {form.formState.isValid && dataToBeSaved && (
                    <div className="flex flex-col gap-4 sm:gap-6">
                      <SowingOutput dataToBeSaved={dataToBeSaved} />

                      <SowingTotalArea form={form} dataToBeSaved={dataToBeSaved} />

                      <div className="flex justify-center mt-6 sm:mt-8">
                        <Button
                          id="saveCalculationButton"
                          type="submit"
                          size="lg"
                          className="px-6 sm:px-8 text-lg sm:text-xl w-full max-w-md dark:text-white"
                        >
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
