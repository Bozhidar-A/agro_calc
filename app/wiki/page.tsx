'use client'

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/app/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";

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
                            <p className="text-center text-lg">
                                {translator(SELECTABLE_STRINGS.WIKI_DESCRIPTION)}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link href="/wiki/sowing" className="block h-full">
                                    <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 h-full flex flex-col justify-center border border-green-100 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-center text-green-900 dark:text-white">
                                            {translator(SELECTABLE_STRINGS.WIKI_SOWING)}
                                        </h3>
                                    </div>
                                </Link>

                                <Link href="/wiki/combined" className="block h-full">
                                    <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 h-full flex flex-col justify-center border border-green-100 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-center text-green-900 dark:text-white">
                                            {translator(SELECTABLE_STRINGS.WIKI_COMBINED)}
                                        </h3>
                                    </div>
                                </Link>

                                <Link href="/wiki/chemical-protection/plant" className="block h-full">
                                    <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 h-full flex flex-col justify-center border border-green-100 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-center text-green-900 dark:text-white">
                                            {translator(SELECTABLE_STRINGS.WIKI_CHEMICAL_PROTECTION)}
                                        </h3>
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
