'use client'

import { useTranslate } from "@/app/hooks/useTranslate";
import Errored from "@/components/Errored/Errored";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { APICaller } from "@/lib/api-util";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Log } from "@/lib/logger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ChemicalData } from "@/lib/interfaces";
import { Separator } from "@/components/ui/separator";

export default function WikiChemicalProtectionPlantPage() {
    const params = useParams();
    const translator = useTranslate();
    const [chemicals, setChemicals] = useState<ChemicalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        APICaller(["wiki", "chem protection", "plant", "POST"], `/api/wiki/chemical-protection/plant`, "POST", { id: params.plantId }).then((res) => {
            if (res.success) {
                setChemicals(res.data);
            } else {
                Log(["wiki", "chem protection", "plant", "POST"], `POST failed with: ${res.message}`);
                setErrored(true);
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                    description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
                });
            }
            setLoading(false);
        }).catch((error) => {
            Log(["wiki", "chem protection", "plant", "POST"], `POST failed with: ${error}`);
            setErrored(true);
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_LOADING_DATA), {
                description: translator(SELECTABLE_STRINGS.TOAST_TRY_AGAIN_LATER),
            });
        });
    }, []);

    const formatInterval = (min: number, max: number) => {
        if (min === 0 && max === 0) {
            return "N/A";
        }
        if (min === max) {
            return `${min} days`;
        }
        return `${min} - ${max} days`;
    };

    const formatQuarantine = (days: number) => {
        return days === 0 ? "N/A" : `${days} days`;
    };

    if (loading) {
        return <LoadingDisplay />
    }

    if (errored) {
        return <Errored />
    }

    if (!chemicals || chemicals.length === 0) {
        return (
            <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
                <Card className="w-full max-w-7xl mx-auto">
                    <CardHeader className="text-center bg-green-700">
                        <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
                            {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-2xl space-y-6">
                                <div className="bg-green-700/10 p-4 rounded-lg text-center">
                                    <p className="text-lg text-black dark:text-white">
                                        No Chemical Protection Data Available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-green-700">
                    <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
                        {chemicals[0].plant.latinName}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl space-y-6">
                            {chemicals.map((chemData) => (
                                <Card key={chemData.chemical.id} className="overflow-hidden border-2 border-green-700">
                                    <CardHeader className="bg-green-700 pb-2">
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href={`/wiki/chemical-protection/chemical/${chemData.chemical.id}`}
                                                className="group flex items-center gap-2"
                                            >
                                                <CardTitle className="text-lg text-black dark:text-white">
                                                    {translator(chemData.chemical.nameKey)}
                                                </CardTitle>
                                                <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                            </Link>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-white/20 text-black dark:text-white rounded-md text-sm font-medium">
                                                    {translator(chemData.chemical.type)}
                                                </span>
                                                <span className="px-2 py-1 bg-white/20 text-black dark:text-white rounded-md text-sm font-medium">
                                                    {translator(chemData.chemical.applicationStage)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="space-y-4">
                                            {/* Dosage Information */}
                                            <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                                                <h4 className="font-semibold mb-2 text-black dark:text-white">Dosage Information</h4>
                                                <div className="space-y-2 text-black dark:text-white">
                                                    <p>Dosage: {chemData.chemical.dosage} {translator(chemData.chemical.dosageUnit)}</p>
                                                    <p>Max Applications: {chemData.chemical.maxApplications}</p>
                                                    <p>Interval Between Applications: {formatInterval(chemData.chemical.minIntervalBetweenApplicationsDays, chemData.chemical.maxIntervalBetweenApplicationsDays)}</p>
                                                    <p>Quarantine Period: {formatQuarantine(chemData.chemical.quarantinePeriodDays)}</p>
                                                </div>
                                            </div>

                                            <Separator className="border-[0.5px] border-black dark:border-white" />

                                            {/* Pricing Information */}
                                            <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                                                <h4 className="font-semibold mb-2 text-black dark:text-white">Pricing</h4>
                                                <div className="space-y-2 text-black dark:text-white">
                                                    <p>Price per 1L: {chemData.chemical.pricePer1LiterBGN} BGN</p>
                                                    <p>Price per Acre: {chemData.chemical.pricePerAcreBGN} BGN</p>
                                                </div>
                                            </div>

                                            <Separator className="border-[0.5px] border-black dark:border-white" />

                                            {/* Active Ingredients */}
                                            <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                                                <h4 className="font-semibold mb-2 text-black dark:text-white">Active Ingredients</h4>
                                                <div className="space-y-2">
                                                    {chemData.chemical.activeIngredients.map((ingredient) => (
                                                        <div key={ingredient.id} className="flex justify-between items-center text-black dark:text-white">
                                                            <Link
                                                                href={`/wiki/chemical-protection/active-ingredient/${ingredient.activeIngredient.id}`}
                                                                className="group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-green-100 dark:hover:bg-black/50 transition-colors"
                                                            >
                                                                {translator(ingredient.activeIngredient.nameKey)}
                                                                <ExternalLink className="w-4 h-4 text-black dark:text-white" />
                                                            </Link>
                                                            <span>{ingredient.quantity} {translator(ingredient.activeIngredient.unit)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator className="border-[0.5px] border-black dark:border-white" />

                                            {/* Target Enemies */}
                                            <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                                                <h4 className="font-semibold mb-2 text-black dark:text-white">Target Pests/Diseases</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {chemData.chemical.chemicalTargetEnemies.map((enemy) => (
                                                        <Link
                                                            key={enemy.id}
                                                            href={`/wiki/chemical-protection/enemy/${enemy.id}`}
                                                            className="group inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-black/50 text-black dark:text-white rounded-md text-sm hover:bg-green-200 dark:hover:bg-black transition-colors"
                                                        >
                                                            {enemy.latinName}
                                                            <ExternalLink className="w-3 h-3 text-black dark:text-white" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator className="border-[0.5px] border-black dark:border-white" />

                                            {/* Additional Information */}
                                            {(chemData.chemical.additionalInfo || chemData.chemical.additionalInfoNotes) && (
                                                <div className="bg-green-50 dark:bg-black p-4 rounded-lg">
                                                    <h4 className="font-semibold mb-2 text-black dark:text-white">Additional Information</h4>
                                                    <div className="space-y-2 text-black dark:text-white">
                                                        {chemData.chemical.additionalInfo && (
                                                            <p>{translator(chemData.chemical.additionalInfo)}</p>
                                                        )}
                                                        {chemData.chemical.additionalInfoNotes && (
                                                            <p className="text-sm text-black dark:text-white">{translator(chemData.chemical.additionalInfoNotes)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}