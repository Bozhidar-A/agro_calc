'use client'

import { APICaller } from "@/lib/api-util";
import { WikiPlantSowingRate } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import Errored from "@/components/Errored/Errored";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { useParams } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { CalculatorValueTypes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Log } from "@/lib/logger";

export default function WikiSowingPlantPage() {
    const params = useParams();
    const translator = useTranslate();
    const [plantData, setPlantData] = useState<WikiPlantSowingRate | null>(null);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        APICaller(["wiki", "sowing", "plant", "POST"], `/api/wiki/sowing/plant`, "POST", { id: params.plantId }).then((res) => {
            if (res.success) {
                setPlantData(res.data);
            } else {
                Log(["wiki", "sowing", "plant", "POST"], `POST failed with: ${res.message}`);
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
            }
            setLoading(false);
        }).catch((error) => {
            Log(["wiki", "sowing", "plant", "POST"], `POST failed with: ${error}`);
            setErrored(true);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
        });
    }, []);

    if (loading) {
        return <LoadingDisplay />
    }

    if (errored) {
        return <Errored />
    }

    const renderParameterValue = (param: any) => {
        if (!param) {
            return null;
        }

        switch (param.type) {
            case CalculatorValueTypes.CONST:
                return `${param.constValue} ${param.unit}`;
            case CalculatorValueTypes.ABOVE_ZERO:
                return `0 - ${param.maxSliderVal} ${param.unit}`;
            case CalculatorValueTypes.SLIDER:
            default:
                return `${param.minSliderVal} - ${param.maxSliderVal} ${param.unit}`;
        }
    };

    return (
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-green-700">
                    <CardTitle className="text-2xl sm:text-3xl text-white">
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
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_COEFFICIENT_SECURITY)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.coefficientSecurity && renderParameterValue(plantData.coefficientSecurity)}</span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_WANTED_PLANTS_PER_M2)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.wantedPlantsPerMeterSquared && renderParameterValue(plantData.wantedPlantsPerMeterSquared)}</span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_MASS_PER_1000g_SEEDS)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.massPer1000g && renderParameterValue(plantData.massPer1000g)}</span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_PURITY)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.purity && renderParameterValue(plantData.purity)}</span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_GERMINATION)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.germination && renderParameterValue(plantData.germination)}</span>
                                </div>
                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg text-center">
                                    <span className="font-semibold text-black dark:text-white">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_ROW_SPACING)}:</span>{" "}
                                    <span className="text-black dark:text-white">{plantData?.rowSpacing && renderParameterValue(plantData.rowSpacing)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
