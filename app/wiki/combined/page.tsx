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
import { ExternalLink } from "lucide-react";

export default function WikiCombinedPage() {
    const [plants, setPlants] = useState<WikiPlant[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const translator = useTranslate();

    useEffect(() => {
        APICaller(["wiki", "all-plants", "get"], "/api/wiki/combined/all-plants", "GET").then((res) => {
            if (res.success) {
                //combined data input backend func gets plantData instead of plant
                //get that data from the include and return it
                setPlants(res.data.map((combinedData: any) => {
                    return {
                        ...combinedData.plant
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
                        {translator(SELECTABLE_STRINGS.COMBINED_CALC_TITLE)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl space-y-6">
                            <p className="text-center text-lg text-black dark:text-white mb-6">
                                {translator(SELECTABLE_STRINGS.SOWING_RATE_PICK_CULTURE)}
                            </p>

                            <div className="space-y-4">
                                {plants.map((plant) => (
                                    <Link
                                        key={plant.id}
                                        href={`/wiki/combined/plant/${plant.id}`}
                                        className="block"
                                    >
                                        <div className="group bg-green-50 dark:bg-black p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-black dark:text-white">
                                                        {translator(plant.latinName)}
                                                    </h3>
                                                    <p className="text-sm text-black dark:text-white mt-1">
                                                        <i>({plant.latinName})</i>
                                                    </p>
                                                </div>
                                                <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                            </div>
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
