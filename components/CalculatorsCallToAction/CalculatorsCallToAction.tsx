'use client';

import { useTranslate } from "@/app/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { motion } from "framer-motion";
import { Leaf, Calculator, FlaskRoundIcon as Flask, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CalculatorsCallToAction() {
    const translator = useTranslate();

    const calculators = [
        {
            id: "sowing",
            title: translator(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE),
            description: translator(SELECTABLE_STRINGS.SOWING_RATE_CALC_DESCRIPTION),
            icon: <Leaf className="h-8 w-8" />,
            path: "/calculators/sowing",
        },
        {
            id: "combined",
            title: translator(SELECTABLE_STRINGS.COMBINED_CALC_TITLE),
            description: translator(SELECTABLE_STRINGS.COMBINED_CALC_DESCRIPTION),
            icon: <Calculator className="h-8 w-8" />,
            path: "/calculators/combined",
        },
        {
            id: "chem-protection-working",
            title: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE),
            description: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_DESCRIPTION),
            icon: <Flask className="h-8 w-8" />,
            path: "/calculators/chemical-protection/working-solution",
        },
        {
            id: "chem-protection-percent",
            title: translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE),
            description: translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CALC_DESCRIPTION),
            icon: <Flask className="h-8 w-8" />,
            path: "/calculators/chemical-protection/percent-solution",
        },
    ]

    return (
        <div>
            <motion.div
                id="calculators-section"
                className="container mx-auto py-16 px-4 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
            >
                <Card className="w-full max-w-7xl mx-auto">
                    <CardHeader className="text-center bg-green-700">
                        <CardTitle className="text-2xl sm:text-3xl text-white dark:text-white">
                            {translator(SELECTABLE_STRINGS.AGRICULTURAL_CALCULATORS)}
                        </CardTitle>
                        <CardDescription className="sm:text-lg text-white dark:text-white">
                            {translator(SELECTABLE_STRINGS.SELECT_CALCULATOR)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10">
                            {calculators.map((calculator) => (
                                <Link href={calculator.path} key={calculator.id} className="block">
                                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2">
                                        <CardHeader className="bg-muted pb-2 h-32 px-6">
                                            <CardTitle className="flex items-start gap-3 text-lg">
                                                <div className="flex-shrink-0">{calculator.icon}</div>
                                                <div>{calculator.title}</div>
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 mt-2">{calculator.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 pb-6 flex justify-center items-center">
                                            <Button className="bg-green-700 hover:bg-green-600 rounded-xl text-white dark:text-white px-6">
                                                {translator(SELECTABLE_STRINGS.OPEN_CALCULATOR)}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}