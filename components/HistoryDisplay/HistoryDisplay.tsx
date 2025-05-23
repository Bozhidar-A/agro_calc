import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { SeedingDataCombinationHistory, SowingRateHistory } from '@/lib/interfaces';
import LoadingDisplay from '../LoadingDisplay/LoadingDisplay';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { toast } from 'sonner';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Log } from '@/lib/logger';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { APICaller } from '@/lib/api-util';
import Errored from '@/components/Errored/Errored';
import CalculatorsCallToAction from '@/components/CalculatorsCallToAction/CalculatorsCallToAction';

export default function HistoryDisplay() {
    const [sowingRateHistory, setSowingRateHistory] = useState<SowingRateHistory[]>([]);
    const [seedingDataHistory, setSeedingDataHistory] = useState<SeedingDataCombinationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const authObj = useSelector((state: RootState) => state.auth);
    const translator = useTranslate();

    // Fetch history data
    useEffect(() => {
        Log(["history", "display"], "Fetching history data");
        const fetchHistory = async () => {
            const sowingRateHistoryFetch = await APICaller(["history", "display", "sowing"], "/api/calc/sowing/history", "GET");
            const seedingDataHistoryFetch = await APICaller(["history", "display", "seeding"], "/api/calc/combined/history", "GET");

            if (!sowingRateHistoryFetch.success || !seedingDataHistoryFetch.success) {
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
                return;
            }

            setSowingRateHistory(sowingRateHistoryFetch.data);
            setSeedingDataHistory(seedingDataHistoryFetch.data);

            setLoading(false);
        };
        fetchHistory();
    }, []);

    if (errored) {
        return <Errored />
    }

    if (loading) {
        return <LoadingDisplay />
    }

    if (sowingRateHistory.length === 0 && seedingDataHistory.length === 0) {
        return <div className="container mx-auto p-4 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold mb-8">{translator(SELECTABLE_STRINGS.NO_HISTORY)}</h2>
            <CalculatorsCallToAction />
        </div>
    }

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <Tabs defaultValue="sowing-rate" className="w-full max-w-4xl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sowing-rate">Sowing Rate History</TabsTrigger>
                    <TabsTrigger value="seeding-data">Seeding Data History</TabsTrigger>
                </TabsList>

                <TabsContent value="sowing-rate">
                    <div className="grid gap-4">
                        {sowingRateHistory.length > 0 ? sowingRateHistory.map((history) => (
                            <Card key={history.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between">
                                        <span>{history.plant.latinName}</span>
                                        <span className="text-sm text-gray-500">
                                            {format(new Date(history.createdAt), 'PPp')}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium">Safe Seeds/m²</p>
                                            <p className="text-lg">{history.sowingRateSafeSeedsPerMeterSquared.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Plants/Acre</p>
                                            <p className="text-lg">{history.sowingRatePlantsPerAcre.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Seeds kg/Acre</p>
                                            <p className="text-lg">{history.usedSeedsKgPerAcre.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Row Height (cm)</p>
                                            <p className="text-lg">{history.internalRowHeightCm.toFixed(2)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm font-medium">Total Area</p>
                                            <p className="text-lg">{history.totalArea.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : <div className="text-center text-gray-500">{translator(SELECTABLE_STRINGS.NO_HISTORY_SOWING_RATE)}</div>}
                    </div>
                </TabsContent>

                <TabsContent value="seeding-data">
                    <div className="grid gap-4">
                        {seedingDataHistory.length > 0 ? seedingDataHistory.map((history) => (
                            <Card key={history.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between">
                                        <span>Combined Seeding Data</span>
                                        <span className="text-sm text-gray-500">
                                            {format(new Date(history.createdAt), 'PPp')}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {history.plants.map((plantData, index) => (
                                            <div key={index} className="border-b pb-2 last:border-0">
                                                <h4 className="font-medium">{plantData.plant.latinName}</h4>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Type</p>
                                                        <p>{plantData.plantType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Seeding Rate</p>
                                                        <p>{plantData.seedingRate.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Participation</p>
                                                        <p>{plantData.participation.toFixed(2)}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Price/Acre</p>
                                                        <p>{plantData.pricePerAcreBGN.toFixed(2)} BGN</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-lg font-medium">
                                                Total Price: {history.totalPrice.toFixed(2)} BGN
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : <div className="text-center text-gray-500">{translator(SELECTABLE_STRINGS.NO_HISTORY_SEEDING_DATA)}</div>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}