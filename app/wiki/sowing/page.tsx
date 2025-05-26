'use client'

import Link from "next/link";
import { WikiPlant } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { APICaller } from "@/lib/api-util";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import Errored from "@/components/Errored/Errored";
import { useTranslate } from "@/app/hooks/useTranslate";

export default function WikiSowingPage() {
    const [plants, setPlants] = useState<WikiPlant[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const translate = useTranslate();

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
                setErrored(true);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LoadingDisplay />
    }

    if (errored) {
        return <Errored />
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🌱 Sowing Rate Wiki</h1>
            <p>Select a plant to view its sowing configuration:</p>
            <ul className="mt-4 space-y-2">
                {plants.map((plant) => (
                    <li key={plant.id}>
                        <Link href={`/wiki/sowing/${plant.id}`} className="text-blue-600 hover:underline">
                            {translate(plant.latinName)} ({plant.latinName})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
