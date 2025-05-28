'use client'

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/app/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { ExternalLink } from "lucide-react";

export default function WikiChemicalProtectionPage() {
    const translator = useTranslate();

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
                        <div className="w-full max-w-2xl space-y-4">
                            <p className="text-lg text-black dark:text-white text-center mb-6">
                                Start from here and go to the page of what you want to look up.
                            </p>
                            <Link
                                href="/wiki/chemical-protection/plant"
                                className="group block p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-lg text-black dark:text-white">
                                        Plants
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                </div>
                            </Link>
                            <Link
                                href="/wiki/chemical-protection/enemy"
                                className="group block p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-lg text-black dark:text-white">
                                        Enemies
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                </div>
                            </Link>
                            <Link
                                href="/wiki/chemical-protection/chemical"
                                className="group block p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-lg text-black dark:text-white">
                                        Chemicals
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                </div>
                            </Link>
                            <Link
                                href="/wiki/chemical-protection/active-ingredient"
                                className="group block p-4 bg-green-50 dark:bg-black rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-lg text-black dark:text-white">
                                        Active Ingredients
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}