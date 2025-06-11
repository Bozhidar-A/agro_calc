import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/hooks/useTranslate";
import { Label } from "@radix-ui/react-label";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import { LangSwitcher } from "../LangSwitcher/LangSwitcher";
import MeasurementSwitcher from "../MeasurementSwitcher/MeasurementSwitcher";

export default function SettingsGrid() {
    const translator = useTranslate();

    return (
        <div className="max-w-2xl mx-auto">
            <div className="space-y-6 p-4 sm:p-6 bg-card rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <Label htmlFor="theme" className="w-full sm:w-48 font-medium text-sm sm:text-base">
                        {translator(SELECTABLE_STRINGS.SETTINGS_THEME)}:
                    </Label>
                    <div className="flex-1">
                        <ThemeSwitcher />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <Label htmlFor="language" className="w-full sm:w-48 font-medium text-sm sm:text-base">
                        {translator(SELECTABLE_STRINGS.SETTINGS_LANGUAGE)}:
                    </Label>
                    <div className="flex-1">
                        <LangSwitcher />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <Label htmlFor="unit" className="w-full sm:w-48 font-medium text-sm sm:text-base">
                        {translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT)}:
                    </Label>
                    <div className="flex-1">
                        <MeasurementSwitcher />
                    </div>
                </div>
            </div>
        </div>
    )
}