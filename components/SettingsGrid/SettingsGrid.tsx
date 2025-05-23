import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/app/hooks/useTranslate";
import { Label } from "@radix-ui/react-label";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import { LangSwitcher } from "../LangSwitcher/LangSwitcher";
import MeasurementSwitcher from "../MeasurementSwitcher/MeasurementSwitcher";

export default function SettingsGrid() {
    const translator = useTranslate();

    return (
        <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="theme" className="text-right col-span-1 font-medium">
                    {translator(SELECTABLE_STRINGS.SETTINGS_THEME)}:
                </Label>
                <div className="col-span-3">
                    <ThemeSwitcher />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right col-span-1 font-medium">
                    {translator(SELECTABLE_STRINGS.SETTINGS_LANGUAGE)}:
                </Label>
                <div className="col-span-3">
                    <LangSwitcher />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right col-span-1 font-medium">
                    {translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT)}:
                </Label>
                <div className="col-span-3">
                    <MeasurementSwitcher />
                </div>
            </div>
        </div>
    )
}