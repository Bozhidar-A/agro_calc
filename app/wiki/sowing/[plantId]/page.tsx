'use client'

import { APICaller } from "@/lib/api-util";
import { WikiPlantSowingRate } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import Errored from "@/components/Errored/Errored";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { useParams } from "next/navigation";
import { useTranslate } from "@/app/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { CalculatorValueTypes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WikiSowingPlantPage() {
    const params = useParams();
    const translator = useTranslate();
    const [plantData, setPlantData] = useState<WikiPlantSowingRate | null>(null);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        APICaller(["wiki", "plant", "get"], `/api/wiki/plant`, "POST", { id: params.plantId }).then((res) => {
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
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_COEFFICIENT_SECURITY)}:</span>{" "}
                                    {plantData?.coefficientSecurity && renderParameterValue(plantData.coefficientSecurity)}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_WANTED_PLANTS_PER_M2)}:</span>{" "}
                                    {plantData?.wantedPlantsPerMeterSquared && renderParameterValue(plantData.wantedPlantsPerMeterSquared)}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_MASS_PER_1000g_SEEDS)}:</span>{" "}
                                    {plantData?.massPer1000g && renderParameterValue(plantData.massPer1000g)}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_PURITY)}:</span>{" "}
                                    {plantData?.purity && renderParameterValue(plantData.purity)}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_GERMINATION)}:</span>{" "}
                                    {plantData?.germination && renderParameterValue(plantData.germination)}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <span className="font-semibold">{translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_ROW_SPACING)}:</span>{" "}
                                    {plantData?.rowSpacing && renderParameterValue(plantData.rowSpacing)}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
