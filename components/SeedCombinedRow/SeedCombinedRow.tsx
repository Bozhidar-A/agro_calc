"use client"

import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslate } from "@/app/hooks/useTranslate"
import { cn } from "@/lib/utils"
import { SELECTABLE_STRINGS } from "@/lib/LangMap"

interface SeedCombinedRowProps {
    form: any
    name: string
    index: number
    dbData: any[]
}

export function SeedCombinedRow({ form, name, index, dbData }: SeedCombinedRowProps) {
    const translator = useTranslate();

    // Get the selected plant
    const selectedPlant = dbData.find((plant) => plant.id === form.watch(`${name}.${index}.id`))

    // Get all selected plant names in the form
    const selectedPlantNames = form
        .watch(name)
        .map((row) => row.dropdownPlant)
        .filter(Boolean)

    // Check if this row is active
    const isActive = form.watch(`${name}.${index}.active`)

    // Check if plant is selected
    const isPlantSelected = form.watch(`${name}.${index}.id`) !== ""

    return (
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 items-start md:items-center py-2",
            !isActive && "opacity-50"
        )}>
            <div className="flex items-center gap-2 md:justify-center">
                <FormField
                    control={form.control}
                    name={`${name}.${index}.active`}
                    render={({ field }) => (
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                />
                <span className="text-sm md:hidden">{translator(SELECTABLE_STRINGS.COMBINED_ACTIVE)}</span>
            </div>

            <div className="space-y-1">
                <span className="text-sm md:hidden font-medium">{translator(SELECTABLE_STRINGS.COMBINED_PLANT)}</span>
                <FormField
                    control={form.control}
                    name={`${name}.${index}.dropdownPlant`}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isActive}>
                            <SelectTrigger className="text-sm md:text-base">
                                <SelectValue placeholder={translator(SELECTABLE_STRINGS.COMBINED_PLEASE_SELECT_PLANT)} />
                            </SelectTrigger>
                            <SelectContent>
                                {dbData.map(
                                    (plant) =>
                                        plant.plantType === name && (
                                            <SelectItem
                                                key={plant.latinName}
                                                value={plant.latinName}
                                                disabled={selectedPlantNames.includes(plant.latinName) && field.value !== plant.latinName}
                                            >
                                                {translator(plant.latinName)}
                                            </SelectItem>
                                        ),
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div className="space-y-1">
                <span className="text-sm md:hidden font-medium">Сеидбена норма - самостоятелно:</span>
                <FormField
                    control={form.control}
                    name={`${name}.${index}.seedingRate`}
                    render={({ field, fieldState }) => (
                        <div>
                            <Input
                                type="number"
                                step="0.1"
                                {...field}
                                disabled={!isActive || !isPlantSelected}
                                onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                className={cn(
                                    "text-sm md:text-base",
                                    selectedPlant &&
                                        isActive &&
                                        (field.value < selectedPlant.minSeedingRate || field.value > selectedPlant.maxSeedingRate)
                                        ? "border-yellow-500 focus-visible:ring-yellow-500"
                                        : "",
                                )}
                            />
                            {selectedPlant && isActive && (
                                <p className={`text-muted-foreground mt-1 
                                ${(field.value < selectedPlant.minSeedingRate || field.value > selectedPlant.maxSeedingRate) ? "text-yellow-500 text-sm" : "text-xs"}`}>
                                    Min: {selectedPlant.minSeedingRate} | Max: {selectedPlant.maxSeedingRate}
                                </p>
                            )}
                            {fieldState.error && <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>}
                        </div>
                    )}
                />
            </div>

            <div className="space-y-1">
                <span className="text-sm md:hidden font-medium">Участие (%):</span>
                <FormField
                    control={form.control}
                    name={`${name}.${index}.participation`}
                    render={({ field, fieldState }) => (
                        <div>
                            <Input
                                type="number"
                                step="0.1"
                                min={0}
                                max={100}
                                {...field}
                                disabled={!isActive || !isPlantSelected}
                                onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                className="text-sm md:text-base"
                            />
                            {fieldState.error && <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>}
                        </div>
                    )}
                />
            </div>

            <div className="space-y-1">
                <span className="text-sm md:hidden font-medium">Сеидбена норма - в смеската:</span>
                <FormField
                    control={form.control}
                    name={`${name}.${index}.seedingRateInCombination`}
                    render={({ field }) => (
                        <Input
                            className="text-sm md:text-base bg-muted"
                            disabled
                            value={field.value || 0}
                        />
                    )}
                />
            </div>

            <div className="space-y-1">
                <span className="text-sm md:hidden font-medium">Цена на семена за da/BGN:</span>
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
            </div>
        </div>
    )
}

