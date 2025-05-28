'use client'

import Link from "next/link";
import { WikiPlant } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { APICaller } from "@/lib/api-util";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import Errored from "@/components/Errored/Errored";
import { useTranslate } from "@/app/hooks/useTranslate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { toast } from "sonner";
import { Log } from "@/lib/logger";

export default function WikiSowingPage() {
    const [plants, setPlants] = useState<WikiPlant[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const translator = useTranslate();

    useEffect(() => {
        APICaller(["wiki", "all-plants", "get"], "/api/wiki/sowing/all-plants", "GET").then((res) => {
            if (res.success) {
                //sowing data input backend func gets plantData instead of plant
                //get that data from the include and return it
                setPlants(res.data.map((sowingData: any) => {
                    return {
                        ...sowingData.plant
                    }
                }));
            } else {
                Log(["wiki", "all-plants", "get"], `GET failed with: ${res.message}`);
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
            }
            setLoading(false);
        }).catch((error) => {
            Log(["wiki", "all-plants", "get"], `GET failed with: ${error}`);
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

    return (
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-green-700">
                    <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
                        {translator(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl space-y-6">
                            <p className="text-center text-lg">
                                {translator(SELECTABLE_STRINGS.SOWING_RATE_PICK_CULTURE)}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {plants.map((plant) => (
                                    <Link
                                        key={plant.id}
                                        href={`/wiki/sowing/plant/${plant.id}`}
                                        className="block h-full"
                                    >
                                        <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 h-full flex flex-col justify-center border border-green-100 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-center text-green-900 dark:text-white">
                                                {translator(plant.latinName)}
                                            </h3>
                                            <p className="text-sm text-center text-green-700 dark:text-gray-400 mt-1">
                                                <i>({plant.latinName})</i>
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
