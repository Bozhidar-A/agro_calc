"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Clock, Award } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslate } from "@/app/hooks/useTranslate"
import { SELECTABLE_STRINGS } from "@/lib/LangMap"
import Image from "next/image"
import { Footer } from "@/components/Footer/Footer"
import CalculatorsCallToAction from "@/components/CalculatorsCallToAction/CalculatorsCallToAction"

export default function Home() {
    const translator = useTranslate()

    const benefits = [
        {
            title: translator(SELECTABLE_STRINGS.HOME_PAGE_PRECISION_FARMING),
            description: translator(SELECTABLE_STRINGS.HOME_PAGE_PRECISION_FARMING_DESCRIPTION),
            icon: <BarChart3 className="h-10 w-10 text-white" />,
        },
        {
            title: translator(SELECTABLE_STRINGS.HOME_PAGE_TIME_SAVING),
            description: translator(SELECTABLE_STRINGS.HOME_PAGE_TIME_SAVING_DESCRIPTION),
            icon: <Clock className="h-10 w-10 text-white" />,
        },
        {
            title: translator(SELECTABLE_STRINGS.HOME_PAGE_EXPERT_RECOMMENDATIONS),
            description: translator(SELECTABLE_STRINGS.HOME_PAGE_EXPERT_RECOMMENDATIONS_DESCRIPTION),
            icon: <Award className="h-10 w-10 text-white" />,
        },
    ]

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <motion.h1
                    className="text-6xl font-bold text-green-800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Agro-Calc
                </motion.h1>
                <motion.p
                    className="text-lg mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {translator(SELECTABLE_STRINGS.HOME_PAGE_YOUR_TRUSTED_AGRO_CALCS)}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-6"
                >
                    <Button
                        className="px-6 py-3 text-lg rounded-xl shadow-lg bg-green-700 hover:bg-green-600 text-white dark:text-white"
                        onClick={() => document.getElementById("calculators-section")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        {translator(SELECTABLE_STRINGS.GET_STARTED)}
                    </Button>
                </motion.div>
            </div>

            {/* Benefits Section with Images */}
            <motion.div
                className="w-full py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">{translator(SELECTABLE_STRINGS.HOME_PAGE_WHY_USE_AGRO_CALC)}</h2>

                    {/* Image Banner */}
                    <div className="relative w-full h-64 md:h-80 mb-16 rounded-xl overflow-hidden shadow-xl">
                        <Image
                            src="/images/harvesting-combine-field.jpg"
                            alt="Agricultural field with tractor"
                            fill
                            style={{ objectFit: "cover" }}
                            className="brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-transparent flex items-center">
                            <div className="p-8 max-w-md">
                                <h3 className="text-white text-2xl font-bold mb-2">{translator(SELECTABLE_STRINGS.HOME_PAGE_MODERN_FARMING_SOLUTIONS)}</h3>
                                <p className="text-white">{translator(SELECTABLE_STRINGS.HOME_PAGE_MODERN_FARMING_SOLUTIONS_DESCRIPTION)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                className="bg-green-700 rounded-xl shadow-md p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
                            >
                                <div className="flex justify-center mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-semibold text-center mb-3 text-white dark:text-white">{benefit.title}</h3>
                                <p className="text-center text-white dark:text-white">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                            <Image src="/images/aerial-drone-view-nature-moldova.jpg" alt="Crop field" fill style={{ objectFit: "cover" }} />
                        </div>
                        <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                            <Image
                                src="/images/medium-shot-man-holding-tablet.jpg"
                                alt="Farmer using tablet"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                            <Image
                                src="/images/close-up-seeder-attached-tractor-field.jpg"
                                alt="Agricultural machinery"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-lg max-w-3xl mx-auto mb-8">
                            {translator(SELECTABLE_STRINGS.HOME_PAGE_OUR_SUITE_OF_CALCULATORS)}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Calculators Section */}
            <CalculatorsCallToAction />

            {/* Footer */}
            <Footer />
        </div>
    )
}
