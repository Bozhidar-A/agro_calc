import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { SELECTABLE_STRINGS } from "@/lib/LangMap"
import { SowingRateSaveData } from "@/lib/interfaces"
import { useTranslate } from "@/hooks/useTranslate"
import SowingMeasurementSwitcher from "../SowingMeasurementSwitcher/SowingMeasurementSwitcher"
import { Leaf } from "lucide-react"

export default function SowingOutput({ dataToBeSaved }: { dataToBeSaved: SowingRateSaveData }) {
    const translator = useTranslate()

    return (
        <div>
            <Card className="overflow-hidden" id="visualizationSection" data-testid="visualizationSection">
                <CardHeader className="pb-3 sm:pb-4 bg-green-700 text-primary-foreground">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-black dark:text-white">
                        <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                        {translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 sm:pt-4">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
                            <span className="font-semibold text-lg sm:text-xl">
                                {translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE)}
                            </span>
                            <div>
                                <span className="text-lg sm:text-xl font-bold">{dataToBeSaved.sowingRateSafeSeedsPerMeterSquared}</span>
                                <span className="text-lg sm:text-xl font-bold">
                                    {" "}
                                    {translator(SELECTABLE_STRINGS.SEEDS_PER_M2)}
                                </span>
                            </div>
                        </div>

                        <div className="border-b pb-2 sm:pb-3">
                            <SowingMeasurementSwitcher dataToBeSaved={dataToBeSaved} />
                        </div>

                        <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
                            <span className="font-semibold text-lg sm:text-xl">
                                {translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_ROW_SPACING)}
                            </span>
                            <div>
                                <span className="text-lg sm:text-xl font-bold">{dataToBeSaved.internalRowHeightCm}</span>
                                <span className="text-lg sm:text-xl font-bold">
                                    {" "}
                                    {translator(SELECTABLE_STRINGS.CM)}
                                </span>
                            </div>
                        </div>

                        <div className="text-center text-muted-foreground">
                            <p className="text-sm sm:text-base">{translator(SELECTABLE_STRINGS.SOWING_RATE_THIS_IS_SUGGESTED)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
