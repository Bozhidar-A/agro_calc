import { PieChart } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/hooks/useTranslate";

export default function LoadingDisplay() {
    const translator = useTranslate();

    return (
        <div className="container mx-auto py-4 sm:py-8 flex items-center justify-center min-h-[50vh]" role="progressbar">
            <Card className="w-full max-w-md">
                <CardContent className="pt-4 sm:pt-6 flex flex-col items-center">
                    <div className="animate-spin mb-3 sm:mb-4" data-testid="loading-spinner-container">
                        <PieChart className="h-8 w-8 sm:h-10 sm:w-10 text-primary" data-testid="loading-spinner-icon" />
                    </div>
                    <p className="text-lg sm:text-xl">{translator(SELECTABLE_STRINGS.LOADING)}</p>
                </CardContent>
            </Card>
        </div>
    )
}