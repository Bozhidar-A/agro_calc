import { BuildSowingRateRowProps, SowingRateDBData } from "@/lib/interfaces";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { IsValueOutOfBounds } from "@/lib/sowing-utils";
import { CalculatorValueTypes, FetchUnitIfExist } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type SowingRateField = {
    type: string;
    unit: string;
    step?: number;
    minSliderVal?: number;
    maxSliderVal?: number;
    constValue?: number;
};

export function BuildSowingRateRow<T extends Exclude<keyof SowingRateDBData, 'plant'>>({
    varName,
    displayName,
    activePlantDbData,
    form,
    icon,
    translator,
    tourId
}: BuildSowingRateRowProps<T> & { tourId: string }) {
    const neededData = activePlantDbData[varName] as SowingRateField;

    let inputValidityClass = 'border-green-700 focus-visible:ring-green-700';
    let inputValidityClassSlider = 'within-safe-range';

    if (IsValueOutOfBounds(form.watch(varName), neededData.type, neededData.minSliderVal, neededData.maxSliderVal, neededData.constValue)) {
        inputValidityClass = 'border-red-500 focus-visible:ring-red-500';
        inputValidityClassSlider = 'outside-safe-range';
    }

    return (
        <Card className="overflow-hidden" id={tourId}>
            <CardHeader className="bg-green-700 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
                    {icon}
                    {displayName}
                </CardTitle>
                <CardDescription className="text-black/90 dark:text-white/90">
                    {neededData.type === CalculatorValueTypes.SLIDER
                        ? `${translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_SUGGESTED_RANGE)}: ${neededData.minSliderVal} - ${neededData.maxSliderVal}`
                        : `${translator(SELECTABLE_STRINGS.SOWING_RATE_INPUT_SUGGESTED_VALUE)}: ${neededData.constValue}`}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                    {neededData.type === CalculatorValueTypes.SLIDER ? (
                        <>
                            <FormField
                                control={form.control}
                                name={varName}
                                render={({ field }) => (
                                    <Input
                                        className={`text-center text-xl ${inputValidityClass}`}
                                        type="number"
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            const value = e.target.valueAsNumber;
                                            field.onChange(isNaN(value) ? '' : value);
                                        }}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={varName}
                                render={({ field }) => (
                                    <Input
                                        className={`w-full ${inputValidityClassSlider}`}
                                        type="range"
                                        min={neededData.minSliderVal}
                                        max={neededData.maxSliderVal}
                                        step={neededData.step || 0.01}
                                        {...field}
                                        value={field.value || neededData.minSliderVal}
                                        onChange={(e) => {
                                            const value = e.target.valueAsNumber;
                                            field.onChange(isNaN(value) ? neededData.minSliderVal : value);
                                        }}
                                    />
                                )}
                            />
                        </>
                    ) : (
                        <FormField
                            control={form.control}
                            name={varName}
                            render={({ field }) => (
                                <Input
                                    className={`text-center text-xl ${inputValidityClass}`}
                                    type="number"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const value = e.target.valueAsNumber;
                                        field.onChange(isNaN(value) ? '' : value);
                                    }}
                                />
                            )}
                        />
                    )}
                    <div className="text-center font-medium mt-1">
                        {`${form.watch(varName) || 0} ${FetchUnitIfExist(neededData)}`}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}