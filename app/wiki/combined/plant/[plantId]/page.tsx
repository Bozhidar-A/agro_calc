'use client'

import { APICaller } from "@/lib/api-util";
import { WikiPlantCombined } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import Errored from "@/components/Errored/Errored";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { useParams } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { KgPerAcreToKgPerHectare } from "@/lib/math-util";
import { toast } from "sonner";
import { Log } from "@/lib/logger";
import { UNIT_OF_MEASUREMENT_LENGTH } from "@/lib/utils";

export default function WikiCombinedPlantPage() {
    const params = useParams();
    const translator = useTranslate();
    const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength);
    const [plantData, setPlantData] = useState<WikiPlantCombined | null>(null);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        APICaller(["wiki", "combined", "plant", "POST"], `/api/wiki/combined/plant`, "POST", { id: params.plantId }).then((res) => {
            if (res.success) {
                setPlantData(res.data);
            } else {
                Log(["wiki", "combined", "plant", "POST"], `POST failed with: ${res.message}`);
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
            }
            setLoading(false);
        }).catch((error) => {
            Log(["wiki", "combined", "plant", "POST"], `POST failed with: ${error}`);
            setErrored(true);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
        })
    }, []);

    if (loading) {
        return <LoadingDisplay />
    }

    if (errored) {
        return <Errored />
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
                            <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                                    {translator(SELECTABLE_STRINGS.SOWING_RATE_SELECTED_CULTURE)}
                                </h3>
                                <p className="text-xl font-bold text-black dark:text-white">
                                    {translator(plantData?.plant.latinName || '')}
                                    <span className="ml-2 text-base font-normal">
                                        <i>({plantData?.plant.latinName})</i>
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.WIKI_COMBINED_PLANT_TYPE)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.plantType}</span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.WIKI_COMBINED_MIN_SEEDING_RATE)}:</span>{" "}
                                    <span className="text-black dark:text-white">{convertSeedingRate(plantData?.minSeedingRate || 0)} {
                                        unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ? translator(SELECTABLE_STRINGS.KG_ACRE) : translator(SELECTABLE_STRINGS.KG_HECTARE)
                                    }</span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.WIKI_COMBINED_MAX_SEEDING_RATE)}:</span>{" "}
                                    <span className="text-black dark:text-white">{convertSeedingRate(plantData?.maxSeedingRate || 0)} {
                                        unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ? translator(SELECTABLE_STRINGS.KG_ACRE) : translator(SELECTABLE_STRINGS.KG_HECTARE)
                                    }
                                    </span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.WIKI_COMBINED_PRICE_FOR_1KG_SEEDS)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.priceFor1kgSeedsBGN} {translator(SELECTABLE_STRINGS.BGN)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
