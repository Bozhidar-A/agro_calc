"use client"

import { CalculatorIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SELECTABLE_STRINGS } from "@/lib/LangMap"
import { useTranslate } from "@/app/hooks/useTranslate"
import { FormField } from "../ui/form"
import { IsValueOutOfBounds } from "@/lib/sowing-utils"
import { CalculatorValueTypes } from "@/lib/utils"
import { SowingRateSaveData } from "@/app/hooks/useSowingRateForm"
import SowingOutput from "../SowingOutput/SowingOutput"
import { useSelector } from "react-redux"
import { UNIT_OF_MEASUREMENT_LENGTH } from "@/lib/LocalSettingsMaps"

//Heavy based on BuildSowingRateRow component
export default function SowingTotalArea({ form, dataToBeSaved }: { form: any, dataToBeSaved: SowingRateSaveData }) {
    const translator = useTranslate();
    const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength);

    let inputValidityClass = 'border-green-500 focus-visible:ring-green-500';

    if (IsValueOutOfBounds(form.watch('totalArea'), CalculatorValueTypes.ABOVE_ZERO)) {
        inputValidityClass = 'border-red-500 focus-visible:ring-red-500';
    }

    function SpoofToBeSavedDataWithTotalArea(totalArea: number) {
        const spoofedData = { ...dataToBeSaved };
        spoofedData.sowingRateSafeSeedsPerMeterSquared *= totalArea;
        spoofedData.sowingRatePlantsPerAcre *= totalArea;
        spoofedData.usedSeedsKgPerAcre *= totalArea;
        spoofedData.totalArea = totalArea;
        return spoofedData;
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
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
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                        )}
                    />
                    <div className="text-center font-medium mt-1">
                        {`${form.watch('totalArea') || 0} ${unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ?
                            translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES) :
                            translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES)}`}
                        {
                            !IsValueOutOfBounds(form.watch('totalArea'), CalculatorValueTypes.ABOVE_ZERO) && (
                                <SowingOutput dataToBeSaved={SpoofToBeSavedDataWithTotalArea(form.watch('totalArea'))} />
                            )
                        }

                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
