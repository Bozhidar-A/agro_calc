import { useEffect, useState } from 'react';
import { ChemProtWorkingSolutionHistory } from '@prisma/client';
import { endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import { AlertTriangle, Calendar, Search } from 'lucide-react';
import { toast } from 'sonner';
import CalculatorsCallToAction from '@/components/CalculatorsCallToAction/CalculatorsCallToAction';
import Errored from '@/components/Errored/Errored';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslate } from '@/hooks/useTranslate';
import { APICaller } from '@/lib/api-util';
import {
  ChemProtPercentHistory,
  SeedingDataCombinationHistory,
  SowingRateHistory,
} from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';
import ChemWorkingSolutionCharts from '../ChemWorkingSolutionCharts/ChemWorkingSolutionCharts';
import CombinedCharts from '../CombinedCharts/CombinedCharts';
import LoadingDisplay from '../LoadingDisplay/LoadingDisplay';
import SowingCharts from '../SowingCharts/SowingCharts';

type ChemProtWorkingSolutionHistoryWithRelations = ChemProtWorkingSolutionHistory & {
  plant?: {
    id: string;
    latinName: string;
  } | null;
  chemical?: {
    id: string;
    nameKey: string;
  } | null;
};

export default function HistoryDisplay() {
  const [calcHistory, setCalcHistory] = useState<{
    sowingRateHistory: SowingRateHistory[];
    combinedHistory: SeedingDataCombinationHistory[];
    chemProtPercentHistory: ChemProtPercentHistory[];
    chemProtWorkingSolutionHistory: ChemProtWorkingSolutionHistoryWithRelations[];
  }>({
    sowingRateHistory: [],
    combinedHistory: [],
    chemProtPercentHistory: [],
    chemProtWorkingSolutionHistory: [],
  });
  const [filteredCalcHistory, setFilteredCalcHistory] = useState(calcHistory);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const translator = useTranslate();

  // Fetch history data
  useEffect(() => {
    Log(['history', 'display'], 'Fetching history data');
    const fetchHistory = async () => {
      const userCalcHistoryFetch = await APICaller(
        ['user', 'calc-history'],
        '/api/user/calc-history',
        'GET'
      );

      if (!userCalcHistoryFetch.success) {
        setErrored(true);
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
          description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
        });
        return;
      }

      const data = userCalcHistoryFetch.data || {};
      const deepData = {
        sowingRateHistory: data.sowingRateHistory || [],
        combinedHistory: data.combinedHistory || [],
        chemProtPercentHistory: data.chemProtPercentHistory || [],
        chemProtWorkingSolutionHistory: data.chemProtWorkingSolutionHistory || [],
      };
      setCalcHistory(deepData);
      setFilteredCalcHistory(deepData);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  //Update filtered history whenever calcHistory, searchQuery, or selectedDate changes
  useEffect(() => {
    const filteredHistory = {
      sowingRateHistory: [...calcHistory.sowingRateHistory],
      combinedHistory: [...calcHistory.combinedHistory],
      chemProtPercentHistory: [...calcHistory.chemProtPercentHistory],
      chemProtWorkingSolutionHistory: [...calcHistory.chemProtWorkingSolutionHistory],
    };

    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      filteredHistory.sowingRateHistory = filteredHistory.sowingRateHistory.filter((item) => {
        const translatedName = translator(item.plant.latinName as SELECTABLE_STRINGS);
        return translatedName.toLowerCase().includes(query);
      });

      filteredHistory.combinedHistory = filteredHistory.combinedHistory.filter((item) =>
        item.plants.some((plant: any) => {
          const translatedName = translator(plant.plant.latinName as SELECTABLE_STRINGS);
          const translatedType = translator(plant.plantType as SELECTABLE_STRINGS);
          return (
            translatedName.toLowerCase().includes(query) ||
            translatedType.toLowerCase().includes(query)
          );
        })
      );

      filteredHistory.chemProtWorkingSolutionHistory =
        filteredHistory.chemProtWorkingSolutionHistory.filter((item) => {
          const plantName = item.plant?.latinName
            ? translator(item.plant.latinName as SELECTABLE_STRINGS)
            : '';
          const chemicalName = item.chemical?.nameKey
            ? translator(item.chemical.nameKey as SELECTABLE_STRINGS)
            : '';
          return (
            plantName.toLowerCase().includes(query) || chemicalName.toLowerCase().includes(query)
          );
        });
    }

    if (selectedDate) {
      filteredHistory.sowingRateHistory = filteredHistory.sowingRateHistory.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return isWithinInterval(itemDate, {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate),
        });
      });

      filteredHistory.combinedHistory = filteredHistory.combinedHistory.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return isWithinInterval(itemDate, {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate),
        });
      });

      filteredHistory.chemProtPercentHistory = filteredHistory.chemProtPercentHistory.filter(
        (item) => {
          const itemDate = new Date(item.createdAt);
          return isWithinInterval(itemDate, {
            start: startOfDay(selectedDate),
            end: endOfDay(selectedDate),
          });
        }
      );

      filteredHistory.chemProtWorkingSolutionHistory =
        filteredHistory.chemProtWorkingSolutionHistory.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return isWithinInterval(itemDate, {
            start: startOfDay(selectedDate),
            end: endOfDay(selectedDate),
          });
        });
    }

    //sort by date (newest first)
    filteredHistory.sowingRateHistory = [...filteredHistory.sowingRateHistory].sort(
      sortByNewestFirst
    );
    filteredHistory.combinedHistory = [...filteredHistory.combinedHistory].sort(sortByNewestFirst);
    filteredHistory.chemProtPercentHistory = [...filteredHistory.chemProtPercentHistory].sort(
      sortByNewestFirst
    );
    filteredHistory.chemProtWorkingSolutionHistory = [
      ...filteredHistory.chemProtWorkingSolutionHistory,
    ].sort(sortByNewestFirst);

    setFilteredCalcHistory(filteredHistory);
  }, [calcHistory, searchQuery, selectedDate]);

  function sortByNewestFirst<T extends { createdAt: Date | string }>(a: T, b: T): number {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  }

  if (errored) {
    return <Errored />;
  }

  if (loading) {
    return <LoadingDisplay />;
  }

  if (
    calcHistory.sowingRateHistory.length === 0 &&
    calcHistory.combinedHistory.length === 0 &&
    calcHistory.chemProtPercentHistory.length === 0 &&
    calcHistory.chemProtWorkingSolutionHistory.length === 0
  ) {
    return (
      <div className="container mx-auto p-2 sm:p-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
          {translator(SELECTABLE_STRINGS.NO_HISTORY)}
        </h2>
        <CalculatorsCallToAction />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={translator(SELECTABLE_STRINGS.SEARCH_PLACEHOLDER)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-sm sm:text-base"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[240px] justify-start text-left font-normal text-sm sm:text-base"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate
                ? format(selectedDate, 'PPP')
                : translator(SELECTABLE_STRINGS.SELECT_DATE)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Tabs defaultValue="sowing-rate" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full h-auto p-1">
          <TabsTrigger
            value="sowing-rate"
            className="flex items-center justify-center text-xs sm:text-base px-2 sm:px-4 py-3 h-full whitespace-normal break-words text-center rounded-md bg-muted data-[state=active]:bg-background"
          >
            {translator(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE)}
          </TabsTrigger>
          <TabsTrigger
            value="seeding-data"
            className="flex items-center justify-center text-xs sm:text-base px-2 sm:px-4 py-3 h-full whitespace-normal break-words text-center rounded-md bg-muted data-[state=active]:bg-background"
          >
            {translator(SELECTABLE_STRINGS.COMBINED_CALC_TITLE)}
          </TabsTrigger>
          <TabsTrigger
            value="chem-protection-percent-solution"
            className="flex items-center justify-center text-xs sm:text-base px-2 sm:px-4 py-3 h-full whitespace-normal break-words text-center rounded-md bg-muted data-[state=active]:bg-background"
          >
            {translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE)}
          </TabsTrigger>
          <TabsTrigger
            value="chem-protection-working-solution"
            className="flex items-center justify-center text-xs sm:text-base px-2 sm:px-4 py-3 h-full whitespace-normal break-words text-center rounded-md bg-muted data-[state=active]:bg-background"
          >
            {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sowing-rate">
          <div className="grid gap-3 sm:gap-4">
            {filteredCalcHistory.sowingRateHistory.length > 0 ? (
              filteredCalcHistory.sowingRateHistory.map((history) => {
                // Map SowingRateHistory to SowingRateSaveData
                const sowingRateSaveData = {
                  userId: '', // Not available in history, set as empty string
                  plantId: history.plant?.id || '',
                  plantLatinName: history.plant?.latinName || '',
                  sowingRateSafeSeedsPerMeterSquared: history.sowingRateSafeSeedsPerMeterSquared,
                  sowingRatePlantsPerAcre: history.sowingRatePlantsPerAcre,
                  usedSeedsKgPerAcre: history.usedSeedsKgPerAcre,
                  internalRowHeightCm: history.internalRowHeightCm,
                  totalArea: history.totalArea,
                  isDataValid: history.isDataValid,
                };
                return (
                  <Card key={history.id}>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-base sm:text-lg">
                          {translator(history.plant.latinName as SELECTABLE_STRINGS)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {format(new Date(history.createdAt), 'PPp')}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      {!history.isDataValid && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3 flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">
                            {translator(SELECTABLE_STRINGS.WARNING_OUTSIDE_SUGGESTED_PARAMS)}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm font-medium">
                            {translator(SELECTABLE_STRINGS.SEEDS_PER_M2)}
                          </p>
                          <p className="text-base sm:text-lg">
                            {history.sowingRateSafeSeedsPerMeterSquared.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium">
                            {translator(SELECTABLE_STRINGS.PLANTS_PER_ACRE)}
                          </p>
                          <p className="text-base sm:text-lg">
                            {history.sowingRatePlantsPerAcre.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium">
                            {translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_USED_SEEDS)}
                          </p>
                          <p className="text-base sm:text-lg">
                            {history.usedSeedsKgPerAcre.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium">
                            {translator(SELECTABLE_STRINGS.CM)}
                          </p>
                          <p className="text-base sm:text-lg">
                            {history.internalRowHeightCm.toFixed(2)}
                          </p>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <p className="text-xs sm:text-sm font-medium">
                            {translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_TOTAL_AREA)}
                          </p>
                          <p className="text-base sm:text-lg">{history.totalArea.toFixed(2)}</p>
                        </div>
                      </div>
                      <SowingCharts data-testId="sowing-charts" data={sowingRateSaveData} />
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center text-gray-500 text-sm sm:text-base">
                {translator(SELECTABLE_STRINGS.NO_HISTORY_SOWING_RATE)}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seeding-data">
          <div className="grid gap-3 sm:gap-4">
            {filteredCalcHistory.combinedHistory.length > 0 ? (
              filteredCalcHistory.combinedHistory.map((history: any) => {
                // Map SeedingDataCombinationHistory to CombinedHistoryData
                const combinedHistoryData = {
                  plants: history.plants.map((plantData: any) => ({
                    plantLatinName: plantData.plant.latinName,
                    plantType: plantData.plantType,
                    seedingRate: plantData.seedingRate,
                    participation: plantData.participation,
                    combinedRate: plantData.combinedRate,
                    pricePerAcreBGN: plantData.pricePerAcreBGN,
                  })),
                  totalPrice: history.totalPrice,
                  userId: history.userId || '',
                  isDataValid: history.isDataValid,
                };
                return (
                  <Card key={history.id}>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-base sm:text-lg">
                          {translator(SELECTABLE_STRINGS.COMBINED_CALC_TITLE)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {format(new Date(history.createdAt), 'PPp')}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      {!history.isDataValid && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3 flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">
                            {translator(SELECTABLE_STRINGS.WARNING_OUTSIDE_SUGGESTED_PARAMS)}
                          </span>
                        </div>
                      )}
                      <div className="space-y-3 sm:space-y-4">
                        {history.plants.map((plantData: any, index: any) => (
                          <div key={index} className="border-b pb-2 last:border-0">
                            <h4 className="font-medium text-sm sm:text-base">
                              {translator(plantData.plant.latinName as SELECTABLE_STRINGS)}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              <div>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {translator(SELECTABLE_STRINGS.COMBINED_PLANT)}
                                </p>
                                <p className="text-sm sm:text-base">
                                  {translator(plantData.plantType as SELECTABLE_STRINGS)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE)}
                                </p>
                                <p className="text-sm sm:text-base">
                                  {plantData.seedingRate.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {translator(SELECTABLE_STRINGS.COMBINED_PARTICIPATION_PERCENT)}
                                </p>
                                <p className="text-sm sm:text-base">
                                  {plantData.participation.toFixed(2)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {translator(SELECTABLE_STRINGS.COMBINED_SEED_PRICE_PER_ACRE)}
                                </p>
                                <p className="text-sm sm:text-base">
                                  {plantData.pricePerAcreBGN.toFixed(2)}{' '}
                                  {translator(SELECTABLE_STRINGS.BGN)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                          <p className="text-base sm:text-lg font-medium">
                            {translator(SELECTABLE_STRINGS.COMBINED_FINAL_PRICE)}:{' '}
                            {history.totalPrice.toFixed(2)} {translator(SELECTABLE_STRINGS.BGN)}
                          </p>
                        </div>
                      </div>
                      <CombinedCharts data={combinedHistoryData} />
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center text-gray-500 text-sm sm:text-base">
                {translator(SELECTABLE_STRINGS.NO_HISTORY_SEEDING_DATA)}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chem-protection-percent-solution">
          <div className="grid gap-3 sm:gap-4">
            {filteredCalcHistory.chemProtPercentHistory.length > 0 ? (
              filteredCalcHistory.chemProtPercentHistory.map((history) => (
                <Card key={history.id}>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-base sm:text-lg">
                        {translator(
                          SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE
                        )}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {format(new Date(history.createdAt), 'PPp')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(
                            SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_DESIRED_PERCENTAGE
                          )}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.desiredPercentage.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(
                            SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_SPRAYER_VOLUME
                          )}
                        </p>
                        <p className="text-base sm:text-lg">{history.sprayerVolume.toFixed(2)} L</p>
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(
                            SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_RESULT
                          )}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.calculatedAmount.toFixed(2)} ml/g
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm sm:text-base">
                {translator(SELECTABLE_STRINGS.NO_HISTORY_CHEM_PROTECTION)}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chem-protection-working-solution">
          <div className="grid gap-3 sm:gap-4">
            {filteredCalcHistory.chemProtWorkingSolutionHistory.length > 0 ? (
              filteredCalcHistory.chemProtWorkingSolutionHistory.map((history) => (
                <Card key={history.id}>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-base sm:text-lg">
                        {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {format(new Date(history.createdAt), 'PPp')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_PLANT)}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.plant?.latinName
                            ? translator(history.plant.latinName as SELECTABLE_STRINGS)
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL)}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.chemical?.nameKey
                            ? translator(history.chemical.nameKey as SELECTABLE_STRINGS)
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_CHEMICAL)}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.totalChemicalForAreaLiters.toFixed(2)} L
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_SOLUTION)}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.totalWorkingSolutionForAreaLiters.toFixed(2)} L
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SPRAYER_COUNT)}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.roughSprayerCount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {translator(
                            SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER
                          )}
                        </p>
                        <p className="text-base sm:text-lg">
                          {history.chemicalPerSprayerML.toFixed(2)} ml
                        </p>
                      </div>
                    </div>
                    <ChemWorkingSolutionCharts
                      data-testId="chem-working-solution-charts"
                      data={history}
                    />
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm sm:text-base">
                {translator(SELECTABLE_STRINGS.NO_HISTORY_CHEM_PROTECTION)}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
