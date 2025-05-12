"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalculateParticipation } from "@/lib/seedingCombined-utils"
import { SeedCombinedRow } from "@/components/SeedCombinedRow/SeedCombinedRow"
import { TreesIcon as Plant, Percent } from "lucide-react"
import { useTranslate } from "@/app/hooks/useTranslate"
import { SELECTABLE_STRINGS } from "@/lib/LangMap"
import { useSelector } from "react-redux"
import { UNIT_OF_MEASUREMENT_LENGTH } from "@/lib/utils"

interface SeedCombinedSectionProps {
    name: string
    title: string
    maxPercentage: number
    form: any
    dbData: any[]
}

export function SeedCombinedSection({ name, title, maxPercentage, form, dbData }: SeedCombinedSectionProps) {
    const translator = useTranslate();
    const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength);
    const participation = CalculateParticipation(form.watch(name))
    const isOverLimit = participation > maxPercentage

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Plant className="h-4 w-4 sm:h-5 sm:w-5" />
                    {title}
                </CardTitle>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mt-2">
                    <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base sm:text-lg">{translator(SELECTABLE_STRINGS.COMBINED_TOTAL_PARTICIPATION_LABEL)}: {participation.toFixed(1)}%</span>
                    </div>
                    <span className={`text-base sm:text-lg font-medium ${isOverLimit ? "text-red-500" : "text-green-500"}`}>
                        {translator(SELECTABLE_STRINGS.COMBINED_MAX_PARTICIPATION)}: {maxPercentage}%
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
                {isOverLimit && (
                    <Alert variant="destructive" className="mb-3 sm:mb-4">
                        <AlertDescription className="text-sm sm:text-base">
                            {translator(SELECTABLE_STRINGS.COMBINED_VALUES_OUTSIDE_LIMIT)}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-3 sm:gap-4">
                    <div className="hidden md:grid grid-cols-6 gap-4 font-medium text-sm md:text-base border-b pb-2">
                        <div className="text-center">{translator(SELECTABLE_STRINGS.COMBINED_ACTIVE)}</div>
                        <div>{translator(SELECTABLE_STRINGS.COMBINED_PLANT)}</div>
                        <div>{translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_SINGLE)}</div>
                        <div>{translator(SELECTABLE_STRINGS.COMBINED_PARTICIPATION_PERCENT)}</div>
                        <div>{translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_MIX)}</div>
                        <div>
                            {
                                unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ?
                                    translator(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON_LABEL) :
                                    translator(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON_LABEL)
                            }
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:hidden gap-2 font-medium text-sm border-b pb-2">
                        <div className="text-center">{translator(SELECTABLE_STRINGS.COMBINED_PLANT)}</div>
                    </div>

                    {form.watch(name).map((_, index) => (
                        <SeedCombinedRow key={index} form={form} name={name} index={index} dbData={dbData} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

