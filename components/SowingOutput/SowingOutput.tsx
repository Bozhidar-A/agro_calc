import { DisplayOutputRow } from "@/app/calculators/sowing/page";
import { Card, CardContent } from "../ui/card";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { SowingRateSaveData } from "@/app/hooks/useSowingRateForm";
import { useTranslate } from "@/app/hooks/useTranslate";
import SowingMeasurementSwitcher from "../SowingMeasurementSwitcher/SowingMeasurementSwitcher";

export default function SowingOutput({ dataToBeSaved }: { dataToBeSaved: SowingRateSaveData }) {
    const translator = useTranslate();

    return (
        <div>
            <Card className="mt-6 sm:mt-8 bg-primary text-primary-foreground">
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                        <DisplayOutputRow
                            data={dataToBeSaved.sowingRateSafeSeedsPerMeterSquared}
                            text={translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE)}
                            unit={translator(
                                SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE_SEEDS_PER_M2
                            )}
                        />
                        <SowingMeasurementSwitcher dataToBeSaved={dataToBeSaved} />
                        <DisplayOutputRow
                            data={dataToBeSaved.internalRowHeightCm}
                            text={translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_ROW_SPACING)}
                            unit={translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_ROW_SPACING_CM)}
                        />
                        <p className="text-primary-foreground/80 text-center max-w-lg">
                            {translator(SELECTABLE_STRINGS.SOWING_RATE_THIS_IS_SUGGESTED)}:
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
