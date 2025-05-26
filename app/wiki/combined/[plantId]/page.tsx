'use client'

import { APICaller } from "@/lib/api-util";
import { WikiPlantCombined } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import Errored from "@/components/Errored/Errored";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { useParams } from "next/navigation";
import { useTranslate } from "@/app/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { KgPerAcreToKgPerHectare } from "@/lib/math-util";

export default function WikiCombinedPlantPage() {
    const params = useParams();
    const translator = useTranslate();
    const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength);
    const [plantData, setPlantData] = useState<WikiPlantCombined | null>(null);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        APICaller(["wiki", "plant", "get"], `/api/wiki/combined/plant`, "POST", { id: params.plantId }).then((res) => {
            if (res.success) {
                setPlantData(res.data);
            } else {
                setErrored(true);
            }
            setLoading(false);
        })
    }, []);

    if (loading) {
        return <LoadingDisplay />
    }

    if (errored) {
        return <Errored />
    }

    const getUnitSymbol = () => {
        return unitOfMeasurement === 'acres' ? 'acre' : 'ha';
    }

    const convertSeedingRate = (rate: number) => {
        if (!rate) {
            return 0;
        }
        return unitOfMeasurement === 'acres' ? rate : KgPerAcreToKgPerHectare(rate);
    }

    return (
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-green-700">
                    <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
                        {translator(plantData?.plant.latinName || '')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl space-y-6">
                            <div className="bg-green-700/10 p-4 rounded-lg text-center">
                                <h3 className="text-lg font-medium mb-2">
                                    {translator(SELECTABLE_STRINGS.SOWING_RATE_SELECTED_CULTURE)}
                                </h3>
                                <p className="text-xl font-bold">
                                    {translator(plantData?.plant.latinName || '')}
                                    <span className="ml-2 text-base font-normal">
                                        <i>({plantData?.plant.latinName})</i>
                                    </span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.COMBINED_PLANT_TYPE)}:</span>{" "}
                                    {plantData?.plantType}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.COMBINED_MIN_SEEDING_RATE)}:</span>{" "}
                                    {convertSeedingRate(plantData?.minSeedingRate || 0)} kg/{getUnitSymbol()}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.COMBINED_MAX_SEEDING_RATE)}:</span>{" "}
                                    {convertSeedingRate(plantData?.maxSeedingRate || 0)} kg/{getUnitSymbol()}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.COMBINED_PRICE_FOR_1KG_SEEDS)}:</span>{" "}
                                    {plantData?.priceFor1kgSeedsBGN} BGN
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
