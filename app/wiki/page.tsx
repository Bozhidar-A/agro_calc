'use client'

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { ExternalLink } from "lucide-react";

export default function WikiPage() {
    const translator = useTranslate();

    return (
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-green-700">
                    <CardTitle className="text-2xl sm:text-3xl text-black dark:text-white">
                        {translator(SELECTABLE_STRINGS.WIKI)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl space-y-6">
                            <p className="text-center text-lg text-black dark:text-white mb-6">
                                {translator(SELECTABLE_STRINGS.WIKI_DESCRIPTION)}
                            </p>

                            <div className="space-y-4">
                                <Link href="/wiki/sowing" className="block">
                                    <div className="group bg-green-50 dark:bg-black p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                                {translator(SELECTABLE_STRINGS.WIKI_SOWING)}
                                            </h3>
                                            <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/wiki/combined" className="block">
                                    <div className="group bg-green-50 dark:bg-black p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                                {translator(SELECTABLE_STRINGS.WIKI_COMBINED)}
                                            </h3>
                                            <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/wiki/chemical-protection" className="block">
                                    <div className="group bg-green-50 dark:bg-black p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                                {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION)}
                                            </h3>
                                            <ExternalLink className="w-5 h-5 text-black dark:text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
