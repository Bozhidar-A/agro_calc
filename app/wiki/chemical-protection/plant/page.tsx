'use client'

import { useTranslate } from "@/app/hooks/useTranslate";
import Errored from "@/components/Errored/Errored";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { APICaller } from "@/lib/api-util";
import { WikiPlantChemical } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Log } from "@/lib/logger";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import Link from "next/link";


export default function WikiChemicalProtectionPlantListPage() {
    const [plants, setPlants] = useState<WikiPlantChemical[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const translator = useTranslate();

    useEffect(() => {
        APICaller(["wiki", "chem protection", "plant", "GET"], "/api/wiki/chemical-protection/all-plants", "GET").then((res) => {
            if (res.success) {
                //filter on unique plantid
                const uniquePlants = res.data.filter((plant: WikiPlantChemical, index: number, self: WikiPlantChemical[]) =>
                    index === self.findIndex((t) => t.plant.id === plant.plant.id)
                );
                setPlants(uniquePlants);
            } else {
                Log(["wiki", "chem protection", "plant", "GET"], `GET failed with: ${res.message}`);
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
            }
            setLoading(false);
        }).catch((error) => {
            Log(["wiki", "chem protection", "plant", "GET"], `POST failed with: ${error}`);
            setErrored(true);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
        });
    }, [])

    if (loading) {
        return <LoadingDisplay />
    }

    if (errored) {
        return <Errored />
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Chemical Protection - Plants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {plants.map((entry) => (
                            <Link href={`/wiki/chemical-protection/plant/${entry.plant.id}`} key={entry.plant.id}>
                                {translator(entry.plant.latinName)} ({entry.plant.latinName})
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
