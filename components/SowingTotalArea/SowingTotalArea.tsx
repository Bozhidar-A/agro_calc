"use client"

import { CalculatorIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SELECTABLE_STRINGS } from "@/lib/LangMap"
import { useTranslate } from "@/hooks/useTranslate"
import { FormField } from "../ui/form"
import { IsValueOutOfBounds } from "@/lib/sowing-utils"
import { CalculatorValueTypes, UNIT_OF_MEASUREMENT_LENGTH } from "@/lib/utils"
import type { SowingRateSaveData } from "@/hooks/useSowingRateForm"
import SowingOutput from "../SowingOutput/SowingOutput"
import { useSelector } from "react-redux"


//Heavy based on BuildSowingRateRow component
export default function SowingTotalArea({ form, dataToBeSaved }: { form: any; dataToBeSaved: SowingRateSaveData }) {
    const translator = useTranslate()
    const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength)

    let inputValidityClass = "border-green-500 focus-visible:ring-green-500"

    if (IsValueOutOfBounds(form.watch("totalArea"), CalculatorValueTypes.ABOVE_ZERO)) {
        inputValidityClass = "border-red-500 focus-visible:ring-red-500"
    }

    function SpoofToBeSavedDataWithTotalArea(totalArea: number) {
        const spoofedData = { ...dataToBeSaved }
        spoofedData.sowingRateSafeSeedsPerMeterSquared *= totalArea
        spoofedData.sowingRatePlantsPerAcre *= totalArea
        spoofedData.usedSeedsKgPerAcre *= totalArea
        spoofedData.totalArea = totalArea
        return spoofedData
    }

    return (
        <Card className="overflow-hidden" id="totalArea">
            <CardHeader className="bg-green-700 text-primary-foreground pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
                    <CalculatorIcon className="h-5 w-5" />
                    {translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_TOTAL_AREA)}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name="totalArea"
                        render={({ field }) => (
                            <Input
                                className={`text-center text-xl ${inputValidityClass}`}
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                    // Prevent negative values and handle empty input
                                    const rawValue = e.target.value;
                                    if (rawValue === '') {
                                        field.onChange(0);
                                        return;
                                    }
                                    const value = Math.max(0, parseFloat(rawValue));
                                    field.onChange(isNaN(value) ? 0 : value);
                                }}
                                onKeyDown={(e) => {
                                    // Prevent negative sign and decimal point if already present
                                    if (e.key === '-' || (e.key === '.' && field.value?.toString().includes('.'))) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        )}
                    />
                    <div className="flex flex-col items-center mt-1">
                        <div className="font-medium">
                            {/* display number and unit of measurement */}
                            {`${form.watch("totalArea") || 0} ${unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES
                                ? translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES)
                                : translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES)
                                }`}
                        </div>

                        {/* display the output with spoofed data */}
                        {!IsValueOutOfBounds(form.watch("totalArea"), CalculatorValueTypes.ABOVE_ZERO) && (
                            <div className="mt-4">
                                <SowingOutput dataToBeSaved={SpoofToBeSavedDataWithTotalArea(form.watch("totalArea"))} />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
