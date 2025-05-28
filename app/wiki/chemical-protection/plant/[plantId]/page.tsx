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
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ChemicalData } from "@/lib/interfaces";


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
            <div className="container mx-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>No Chemical Protection Data Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This plant has no chemical protection data available.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            {/* Plant Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Plant Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-lg font-semibold">{chemicals[0].plant.latinName}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Chemical Protection Information */}
            <div className="space-y-6">
                {chemicals.map((chemData) => (
                    <Card key={chemData.chemical.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <Link
                                    href={`/wiki/chemical-protection/chemical/${chemData.chemical.id}`}
                                    className="group flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <CardTitle>{translator(chemData.chemical.nameKey)}</CardTitle>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <div className="space-x-2">
                                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                                        {translator(chemData.chemical.type)}
                                    </span>
                                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                                        {translator(chemData.chemical.applicationStage)}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Dosage Information */}
                                <div>
                                    <h3 className="font-semibold mb-2">Dosage Information</h3>
                                    <p>Dosage: {chemData.chemical.dosage} {translator(chemData.chemical.dosageUnit)}</p>
                                    <p>Max Applications: {chemData.chemical.maxApplications}</p>
                                    <p>Interval Between Applications: {formatInterval(chemData.chemical.minIntervalBetweenApplicationsDays, chemData.chemical.maxIntervalBetweenApplicationsDays)}</p>
                                    <p>Quarantine Period: {formatQuarantine(chemData.chemical.quarantinePeriodDays)}</p>
                                </div>

                                <Separator />

                                {/* Pricing Information */}
                                <div>
                                    <h3 className="font-semibold mb-2">Pricing</h3>
                                    <p>Price per 1L: {chemData.chemical.pricePer1LiterBGN} BGN</p>
                                    <p>Price per Acre: {chemData.chemical.pricePerAcreBGN} BGN</p>
                                </div>

                                <Separator />

                                {/* Active Ingredients */}
                                <div>
                                    <h3 className="font-semibold mb-2">Active Ingredients</h3>
                                    <div className="space-y-2">
                                        {chemData.chemical.activeIngredients.map((ingredient) => (
                                            <div key={ingredient.id} className="flex justify-between items-center">
                                                <Link
                                                    href={`/wiki/chemical-protection/active-ingredient/${ingredient.activeIngredient.id}`}
                                                    className="group flex items-center gap-2 hover:text-primary transition-colors"
                                                >
                                                    {translator(ingredient.activeIngredient.nameKey)}
                                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                                <span>{ingredient.quantity} {translator(ingredient.activeIngredient.unit)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Target Enemies */}
                                <div>
                                    <h3 className="font-semibold mb-2">Target Pests/Diseases</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {chemData.chemical.chemicalTargetEnemies.map((enemy) => (
                                            <Link
                                                key={enemy.id}
                                                href={`/wiki/chemical-protection/enemy/${enemy.id}`}
                                                className="group inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                {enemy.latinName}
                                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Information */}
                                {(chemData.chemical.additionalInfo || chemData.chemical.additionalInfoNotes) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-semibold mb-2">Additional Information</h3>
                                            {chemData.chemical.additionalInfo && (
                                                <p className="mb-2">{translator(chemData.chemical.additionalInfo)}</p>
                                            )}
                                            {chemData.chemical.additionalInfoNotes && (
                                                <p className="text-sm text-muted-foreground">{translator(chemData.chemical.additionalInfoNotes)}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}