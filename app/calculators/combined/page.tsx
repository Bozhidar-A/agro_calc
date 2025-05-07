'use client';

import { useEffect, useState } from 'react';
import { Leaf, PieChart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import useSeedingCombinedForm from '@/app/hooks/useSeedingCombinedForm';
import { useTranslate } from '@/app/hooks/useTranslate';
import PlantCombinedCharts from '@/components/PlantCombinedCharts/PlantCombinedCharts';
import { SeedCombinedSection } from '@/components/SeedCombinedSection/SeedCombinedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { RoundToSecondStr } from '@/lib/math-util';
import {
  CalculateParticipation,
  FormatCombinedFormSavedToGraphDisplay,
} from '@/lib/seedingCombined-utils';
import { RootState } from '@/store/store';

interface PlantCombinedDBData {
  id: string;
  latinName: string;
  plantType: string;
  minSeedingRate: number;
  maxSeedingRate: number;
  priceFor1kgSeedsBGN: number;
}

export default function Combined() {
  const authObj = useSelector((state: RootState) => state.auth);
  const [dbData, setDbData] = useState<PlantCombinedDBData[]>([]);
  const translator = useTranslate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initData = await APICaller(
          ['calc', 'combined', 'page', 'init'],
          '/api/calc/combined/input',
          'GET'
        );
        if (!initData.success) {
          toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
            description: initData.message,
          });
          console.log(initData.message);
          return;
        }

        setDbData(initData.data);
      } catch (error) {
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
          description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
        });
      }
    };
    fetchData();
  }, []);

  const { form, finalData, onSubmit, warnings } = useSeedingCombinedForm(authObj, dbData);

  if (!dbData || dbData.length === 0) {
    return (
      <div className="container mx-auto py-4 sm:py-8 flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-4 sm:pt-6 flex flex-col items-center">
            <div className="animate-spin mb-3 sm:mb-4">
              <PieChart className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <p className="text-lg sm:text-xl">{translator(SELECTABLE_STRINGS.LOADING)}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalParticipation =
    CalculateParticipation(form.watch('legume')) + CalculateParticipation(form.watch('cereal'));
  const totalPrice = RoundToSecondStr(
    form.watch('legume').reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0) +
    form.watch('cereal').reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0)
  );

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="text-center bg-primary text-primary-foreground">
          <CardTitle className="text-2xl sm:text-3xl">{translator(SELECTABLE_STRINGS.COMBINED_CALC_TITLE)}</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-base sm:text-lg">
            {translator(SELECTABLE_STRINGS.COMBINED_CALC_DESCRIPTION)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <SeedCombinedSection
                  name="legume"
                  title={translator(SELECTABLE_STRINGS.COMBINED_LEGUME_TITLE)}
                  maxPercentage={60}
                  form={form}
                  dbData={dbData}
                />

                <SeedCombinedSection
                  name="cereal"
                  title={translator(SELECTABLE_STRINGS.COMBINED_CEREAL_TITLE)}
                  maxPercentage={40}
                  form={form}
                  dbData={dbData}
                />
              </div>

              <Card className="overflow-hidden">
                <CardHeader className="bg-muted pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                    {translator(SELECTABLE_STRINGS.COMBINED_SUMMARY_TITLE)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 sm:pt-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
                      <span className="font-semibold text-lg sm:text-xl">{translator(SELECTABLE_STRINGS.COMBINED_TOTAL_PARTICIPATION)}</span>
                      <span
                        className={`text-lg sm:text-xl font-bold ${totalParticipation !== 100 ? 'text-yellow-500' : 'text-green-500'}`}
                      >
                        {totalParticipation}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
                      <span className="font-semibold text-lg sm:text-xl">{translator(SELECTABLE_STRINGS.COMBINED_FINAL_PRICE)}</span>
                      <div>
                        <span className="text-lg sm:text-xl font-bold">{totalPrice}</span>
                        <span className="text-lg sm:text-xl"> BGN</span>
                      </div>
                    </div>

                    {form.formState.errors.root && (
                      <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm sm:text-base">
                        {form.formState.errors.root.message}
                      </div>
                    )}

                    {/* {Object.entries(warnings).length > 0 && (
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                                                {Object.entries(warnings).map(([field, message]) => (
                                                    <p key={field}>{message}</p>
                                                ))}
                                            </div>
                                        )} */}

                    {Object.keys(warnings).length > 0 && (
                      <div className="flex flex-col items-center space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                        <h2 className="text-yellow-500 text-lg sm:text-xl text-center">
                          {translator(SELECTABLE_STRINGS.COMBINED_VALUES_OUTSIDE_LIMIT)}
                        </h2>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {authObj.isAuthenticated && (
                <Button
                  type="submit"
                  className="w-full max-w-md mx-auto"
                  size="lg"
                  disabled={!form.formState.isValid}
                >
                  {translator(SELECTABLE_STRINGS.COMBINED_SAVE_CALCULATION)}
                </Button>
              )}

              {form.formState.isValid && (
                <div className="mt-6 sm:mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl">{translator(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_TITLE)}</CardTitle>
                      <CardDescription className="text-base sm:text-lg">
                        {translator(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_DESCRIPTION)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PlantCombinedCharts
                        data={FormatCombinedFormSavedToGraphDisplay(finalData, dbData)}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
