'use client';

import 'driver.js/dist/driver.css';

import { Droplet, Scale } from 'lucide-react';
import { ChemProtPSBuildInputRow } from '@/components/ChemProtPSBuildInputRow/ChemProtPSBuildInputRow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import useChemProtPercentForm from '@/hooks/useChemProtPercentForm';
import { useTranslate } from '@/hooks/useTranslate';
import { getChemProtPercentSteps, SpawnStartDriver } from '@/lib/driver-utils';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

export default function PercentSolution() {
  const translator = useTranslate();
  const { userId } = useAuth();
  const { form, onSubmit, calculatedAmount } = useChemProtPercentForm();

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="text-center bg-green-700">
          <CardTitle className="text-2xl sm:text-3xl text-white">
            {translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE)}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-base sm:text-lg">
            <Button
              type="button"
              onClick={() => {
                SpawnStartDriver(getChemProtPercentSteps(translator));
              }}
              className="bg-sky-500 text-white hover:bg-sky-600 text-sm sm:text-base"
            >
              {translator(SELECTABLE_STRINGS.NEED_HELP_Q)}
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <ChemProtPSBuildInputRow
                  varName="desiredPercentage"
                  displayName={translator(
                    SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_DESIRED_PERCENTAGE
                  )}
                  form={form}
                  icon={<Droplet className="h-5 w-5" />}
                  unit="%"
                  tourId="desiredPercentage"
                />
                <ChemProtPSBuildInputRow
                  varName="sprayerVolume"
                  displayName={translator(
                    SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_SPRAYER_VOLUME
                  )}
                  form={form}
                  icon={<Scale className="h-5 w-5" />}
                  unit="L"
                  tourId="sprayerVolume"
                />
              </div>

              {calculatedAmount !== null && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <Card className="overflow-hidden" id="result">
                    <CardHeader className="pb-3 sm:pb-4 bg-green-700 text-primary-foreground">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                        <Droplet className="h-4 w-4 sm:h-5 sm:w-5" />
                        {translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_RESULT)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 sm:pt-4">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
                          <span className="font-semibold text-lg sm:text-xl">
                            {translator(
                              SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_RESULT
                            )}
                          </span>
                          <div>
                            <span className="text-lg sm:text-xl font-bold">{calculatedAmount}</span>
                            <span className="text-lg sm:text-xl font-bold"> ml/g</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {form.formState.isValid && userId && (
                    <div className="flex justify-center mt-6 sm:mt-8">
                      <Button
                        id="saveCalculationButton"
                        type="submit"
                        size="lg"
                        disabled={!form.formState.isValid}
                        className="px-6 sm:px-8 text-lg sm:text-xl w-full max-w-md text-white"
                      >
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
