import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { SeedingDataCombinationHistory, SowingRateHistory, ChemProtPercentHistory } from '@/lib/interfaces';
import LoadingDisplay from '../LoadingDisplay/LoadingDisplay';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { toast } from 'sonner';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Log } from '@/lib/logger';
import { APICaller } from '@/lib/api-util';
import Errored from '@/components/Errored/Errored';
import CalculatorsCallToAction from '@/components/CalculatorsCallToAction/CalculatorsCallToAction';
import { Input } from "@/components/ui/input";
import { Search, Calendar, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ChemProtWorkingSolutionHistory } from '@prisma/client';
import SowingCharts from '../SowingCharts/SowingCharts';
import CombinedCharts from '../CombinedCharts/CombinedCharts';
import ChemWorkingSolutionCharts from '../ChemWorkingSolutionCharts/ChemWorkingSolutionCharts';

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
    const [sowingRateHistory, setSowingRateHistory] = useState<SowingRateHistory[]>([]);
    const [seedingDataHistory, setSeedingDataHistory] = useState<SeedingDataCombinationHistory[]>([]);
    const [chemProtPercentHistory, setChemProtPercentHistory] = useState<ChemProtPercentHistory[]>([]);
    const [chemProtWorkingSolutionHistory, setChemProtWorkingSolutionHistory] = useState<ChemProtWorkingSolutionHistoryWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const translator = useTranslate();

    // Filter functions
    const filterSowingRateHistory = (history: SowingRateHistory[]) => {
        let filtered = history;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => {
                const translatedName = translator(item.plant.latinName as SELECTABLE_STRINGS);
                return translatedName.toLowerCase().includes(query);
            });
        }

        // Filter by date
        if (selectedDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt);
                return isWithinInterval(itemDate, {
                    start: startOfDay(selectedDate),
                    end: endOfDay(selectedDate)
                });
            });
        }

        // Sort by date (newest first)
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return filtered;
    };

    const filterSeedingDataHistory = (history: SeedingDataCombinationHistory[]) => {
        let filtered = history;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.plants.some(plant => {
                    const translatedName = translator(plant.plant.latinName as SELECTABLE_STRINGS);
                    const translatedType = translator(plant.plantType as SELECTABLE_STRINGS);
                    return translatedName.toLowerCase().includes(query) ||
                        translatedType.toLowerCase().includes(query);
                })
            );
        }

        // Filter by date
        if (selectedDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt);
                return isWithinInterval(itemDate, {
                    start: startOfDay(selectedDate),
                    end: endOfDay(selectedDate)
                });
            });
        }

        // Sort by date (newest first)
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return filtered;
    };

    const filterChemProtPercentHistory = (history: ChemProtPercentHistory[]) => {
        let filtered = history;

        // Filter by date
        if (selectedDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt);
                return isWithinInterval(itemDate, {
                    start: startOfDay(selectedDate),
                    end: endOfDay(selectedDate)
                });
            });
        }

        // Sort by date (newest first)
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return filtered;
    };

    const filterChemProtWorkingSolutionHistory = (history: ChemProtWorkingSolutionHistoryWithRelations[]) => {
        let filtered = history;

        // Filter by date
        if (selectedDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt);
                return isWithinInterval(itemDate, {
                    start: startOfDay(selectedDate),
                    end: endOfDay(selectedDate)
                });
            });
        }

        // Sort by date (newest first)
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return filtered;
    };
    // Fetch history data
    useEffect(() => {
        Log(["history", "display"], "Fetching history data");
        const fetchHistory = async () => {
            const sowingRateHistoryFetch = await APICaller(["history", "display", "sowing"], "/api/calc/sowing/history", "GET");
            const seedingDataHistoryFetch = await APICaller(["history", "display", "seeding"], "/api/calc/combined/history", "GET");
            const chemProtPercentHistoryFetch = await APICaller(["history", "display", "chem-protection"], "/api/calc/chem-protection/percent-solution/history", "GET");
            const chemProtWorkingSolutionHistoryFetch = await APICaller(["history", "display", "chem-protection"], "/api/calc/chem-protection/working-solution/history", "GET");


            if (!sowingRateHistoryFetch.success ||
                !seedingDataHistoryFetch.success ||
                !chemProtPercentHistoryFetch.success ||
                !chemProtWorkingSolutionHistoryFetch.success) {
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
                return;
            }

            setSowingRateHistory(sowingRateHistoryFetch.data);
            setSeedingDataHistory(seedingDataHistoryFetch.data);
            setChemProtPercentHistory(chemProtPercentHistoryFetch.data);
            setChemProtWorkingSolutionHistory(chemProtWorkingSolutionHistoryFetch.data);

            setLoading(false);
        };
        fetchHistory();
    }, []);

    const WarningBanner = () => (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3 flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{translator(SELECTABLE_STRINGS.WARNING_OUTSIDE_SUGGESTED_PARAMS)}</span>
        </div>
    );

    if (errored) {
        return <Errored />
    }

    if (loading) {
        return <LoadingDisplay />
    }

    if (sowingRateHistory.length === 0 && seedingDataHistory.length === 0 && chemProtPercentHistory.length === 0 && chemProtWorkingSolutionHistory.length === 0) {
        return <div className="container mx-auto p-2 sm:p-4 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">{translator(SELECTABLE_STRINGS.NO_HISTORY)}</h2>
            <CalculatorsCallToAction />
        </div>
    }

    const filteredSowingRateHistory = filterSowingRateHistory(sowingRateHistory);
    const filteredSeedingDataHistory = filterSeedingDataHistory(seedingDataHistory);
    const filteredChemProtPercentHistory = filterChemProtPercentHistory(chemProtPercentHistory);
    const filteredChemProtWorkingSolutionHistory = filterChemProtWorkingSolutionHistory(chemProtWorkingSolutionHistory);

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
                        <Button variant="outline" className="w-full sm:w-[240px] justify-start text-left font-normal text-sm sm:text-base">
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : translator(SELECTABLE_STRINGS.SELECT_DATE)}
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
                        {filteredSowingRateHistory.length > 0 ? filteredSowingRateHistory.map((history) => (
                            <Card key={history.id}>
                                <CardHeader className="p-3 sm:p-6">
                                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                        <span className="text-base sm:text-lg">{translator(history.plant.latinName as SELECTABLE_STRINGS)}</span>
                                        <span className="text-xs sm:text-sm text-gray-500">
                                            {format(new Date(history.createdAt), 'PPp')}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6">
                                    {!history.isDataValid && <WarningBanner />}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE_SEEDS_PER_M2)}</p>
                                            <p className="text-base sm:text-lg">{history.sowingRateSafeSeedsPerMeterSquared.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE_PLANTS_PER_ACRE)}</p>
                                            <p className="text-base sm:text-lg">{history.sowingRatePlantsPerAcre.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_USED_SEEDS)}</p>
                                            <p className="text-base sm:text-lg">{history.usedSeedsKgPerAcre.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_ROW_SPACING_CM)}</p>
                                            <p className="text-base sm:text-lg">{history.internalRowHeightCm.toFixed(2)}</p>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_TOTAL_AREA)}</p>
                                            <p className="text-base sm:text-lg">{history.totalArea.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <SowingCharts data={history} />
                                </CardContent>
                            </Card>
                        )) : <div className="text-center text-gray-500 text-sm sm:text-base">{translator(SELECTABLE_STRINGS.NO_HISTORY_SOWING_RATE)}</div>}
                    </div>
                </TabsContent>

                <TabsContent value="seeding-data">
                    <div className="grid gap-3 sm:gap-4">
                        {filteredSeedingDataHistory.length > 0 ? filteredSeedingDataHistory.map((history) => (
                            <Card key={history.id}>
                                <CardHeader className="p-3 sm:p-6">
                                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                        <span className="text-base sm:text-lg">{translator(SELECTABLE_STRINGS.COMBINED_CALC_TITLE)}</span>
                                        <span className="text-xs sm:text-sm text-gray-500">
                                            {format(new Date(history.createdAt), 'PPp')}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6">
                                    {!history.isDataValid && <WarningBanner />}
                                    <div className="space-y-3 sm:space-y-4">
                                        {history.plants.map((plantData, index) => (
                                            <div key={index} className="border-b pb-2 last:border-0">
                                                <h4 className="font-medium text-sm sm:text-base">{translator(plantData.plant.latinName as SELECTABLE_STRINGS)}</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500">{translator(SELECTABLE_STRINGS.COMBINED_PLANT)}</p>
                                                        <p className="text-sm sm:text-base">{translator(plantData.plantType as SELECTABLE_STRINGS)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500">{translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE)}</p>
                                                        <p className="text-sm sm:text-base">{plantData.seedingRate.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500">{translator(SELECTABLE_STRINGS.COMBINED_PARTICIPATION_PERCENT)}</p>
                                                        <p className="text-sm sm:text-base">{plantData.participation.toFixed(2)}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500">{translator(SELECTABLE_STRINGS.COMBINED_SEED_PRICE_PER_ACRE)}</p>
                                                        <p className="text-sm sm:text-base">{plantData.pricePerAcreBGN.toFixed(2)} BGN</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                                            <p className="text-base sm:text-lg font-medium">
                                                {translator(SELECTABLE_STRINGS.COMBINED_FINAL_PRICE)}: {history.totalPrice.toFixed(2)} BGN
                                            </p>
                                        </div>
                                    </div>
                                    <CombinedCharts data={history} />
                                </CardContent>
                            </Card>
                        )) : <div className="text-center text-gray-500 text-sm sm:text-base">{translator(SELECTABLE_STRINGS.NO_HISTORY_SEEDING_DATA)}</div>}
                    </div>
                </TabsContent>

                <TabsContent value="chem-protection-percent-solution">
                    <div className="grid gap-3 sm:gap-4">
                        {filteredChemProtPercentHistory.length > 0 ? filteredChemProtPercentHistory.map((history) => (
                            <Card key={history.id}>
                                <CardHeader className="p-3 sm:p-6">
                                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                        <span className="text-base sm:text-lg">{translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE)}</span>
                                        <span className="text-xs sm:text-sm text-gray-500">
                                            {format(new Date(history.createdAt), 'PPp')}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_DESIRED_PERCENTAGE)}</p>
                                            <p className="text-base sm:text-lg">{history.desiredPercentage.toFixed(2)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_SPRAYER_VOLUME)}</p>
                                            <p className="text-base sm:text-lg">{history.sprayerVolume.toFixed(2)} L</p>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_RESULT)}</p>
                                            <p className="text-base sm:text-lg">{history.calculatedAmount.toFixed(2)} ml/g</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : <div className="text-center text-gray-500 text-sm sm:text-base">{translator(SELECTABLE_STRINGS.NO_HISTORY_CHEM_PROTECTION)}</div>}
                    </div>
                </TabsContent>

                <TabsContent value="chem-protection-working-solution">
                    <div className="grid gap-3 sm:gap-4">
                        {filteredChemProtWorkingSolutionHistory.length > 0 ? filteredChemProtWorkingSolutionHistory.map((history) => (
                            <Card key={history.id}>
                                <CardHeader className="p-3 sm:p-6">
                                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                        <span className="text-base sm:text-lg">{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE)}</span>
                                        <span className="text-xs sm:text-sm text-gray-500">
                                            {format(new Date(history.createdAt), 'PPp')}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_PLANT)}</p>
                                            <p className="text-base sm:text-lg">
                                                {history.plant?.latinName ? translator(history.plant.latinName as SELECTABLE_STRINGS) : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL)}</p>
                                            <p className="text-base sm:text-lg">
                                                {history.chemical?.nameKey ? translator(history.chemical.nameKey as SELECTABLE_STRINGS) : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_CHEMICAL)}</p>
                                            <p className="text-base sm:text-lg">{history.totalChemicalForAreaLiters.toFixed(2)} L</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_SOLUTION)}</p>
                                            <p className="text-base sm:text-lg">{history.totalWorkingSolutionForAreaLiters.toFixed(2)} L</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SPRAYER_COUNT)}</p>
                                            <p className="text-base sm:text-lg">{history.roughSprayerCount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER)}</p>
                                            <p className="text-base sm:text-lg">{history.chemicalPerSprayerML.toFixed(2)} L</p>
                                        </div>
                                    </div>
                                    <ChemWorkingSolutionCharts data={history} />
                                </CardContent>
                            </Card>
                        )) : <div className="text-center text-gray-500 text-sm sm:text-base">{translator(SELECTABLE_STRINGS.NO_HISTORY_CHEM_PROTECTION)}</div>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}