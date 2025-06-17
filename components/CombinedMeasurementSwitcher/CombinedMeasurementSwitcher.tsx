import { useTranslate } from "@/hooks/useTranslate";
import { UNIT_OF_MEASUREMENT_LENGTH } from "@/lib/utils";
import { useSelector } from "react-redux";
import { FormField } from "../ui/form";
import { Input } from "../ui/input";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { KgPerAcreToKgPerHectare, ToFixedNumber } from "@/lib/math-util";

export default function CombinedMeasurementSwitcher({ form, name, index }: { form: any, name: string, index: number }) {
    const translator = useTranslate();
    const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength);

    switch (unitOfMeasurement) {
        case UNIT_OF_MEASUREMENT_LENGTH.ACRES:
            return (
                <>
                    <span className="text-sm md:hidden font-medium">{translator(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON_LABEL)}</span>
                    <FormField
                        control={form.control}
                        name={`${name}.${index}.priceSeedsPerAcreBGN`}
                        render={({ field }) => (
                            <Input
                                className="text-sm md:text-base bg-muted"
                                disabled
                                value={field.value || 0}
                            />
                        )}
                    />
                </>
            )
        case UNIT_OF_MEASUREMENT_LENGTH.HECTARES:
            return (
                <>
                    <span className="text-sm md:hidden font-medium">{translator(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON_LABEL)}</span>
                    <FormField
                        control={form.control}
                        name={`${name}.${index}.priceSeedsPerAcreBGN`}
                        render={({ field }) => (
                            <Input
                                className="text-sm md:text-base bg-muted"
                                disabled
                                value={ToFixedNumber(KgPerAcreToKgPerHectare(field.value || 0), 2)}
                            />
                        )}
                    />
                </>
            )
        default:
            return null
    }
}