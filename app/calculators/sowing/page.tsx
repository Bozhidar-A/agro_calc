"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Ruler, Scale, Droplet, Sprout } from "lucide-react"
import useSowingRateForm from "@/app/hooks/useSowingRateForm"
import { APICaller } from "@/lib/api-util"
import { GetLangNameFromMap } from "@/lib/utils"
import SowingCharts from "@/components/SowingCharts/SowingCharts"

export interface SowingRateDBData {
    id: string
    plant: Plant
    coefficientSecurity: CoefficientSecurity
    wantedPlantsPerMeterSquared: WantedPlantsPerMeterSquared
    massPer1000g: MassPer1000g
    purity: Purity
    germination: Germination
    rowSpacing: RowSpacing
}

interface Plant {
    plantId: string
    plantLatinName: string
}

interface CoefficientSecurity {
    type: string // "slider" or "const"
    unit: string
    step?: number
    minSliderVal?: number
    maxSliderVal?: number
    constValue?: number
}

interface WantedPlantsPerMeterSquared {
    type: string // "slider" or "const"
    unit: string
    step?: number
    minSliderVal?: number
    maxSliderVal?: number
    constValue?: number
}

interface MassPer1000g {
    type: string // "slider" or "const"
    unit: string
    step?: number
    minSliderVal?: number
    maxSliderVal?: number
    constValue?: number
}

interface Purity {
    type: string // "slider" or "const"
    unit: string
    step?: number
    minSliderVal?: number
    maxSliderVal?: number
    constValue?: number
}

interface Germination {
    type: string // "slider" or "const"
    unit: string
    step?: number
    minSliderVal?: number
    maxSliderVal?: number
    constValue?: number
}

interface RowSpacing {
    type: string // "slider" or "const"
    unit: string
    step?: number
    minSliderVal?: number
    maxSliderVal?: number
    constValue?: number
}

function FetchUnitIfExist(data) {
    return data.unit ? `${data.unit}` : ""
}

interface BuildSowingRateRowProps<T extends Exclude<keyof SowingRateDBData, "plant">> {
    varName: T
    displayName: string
    activePlantDbData: SowingRateDBData
    form: any
    icon: React.ReactNode
}

function BuildSowingRateRow<T extends Exclude<keyof SowingRateDBData, "plant">>({
    varName,
    displayName,
    activePlantDbData,
    form,
    icon,
}: BuildSowingRateRowProps<T>) {
    const neededData = activePlantDbData[varName]

    let inputValidityClass = "border-green-500 focus-visible:ring-green-500";
    let inputValidityClassSlider = "within-safe-range";

    if (neededData.type === "slider") {
        if (form.watch(varName) < neededData.minSliderVal || form.watch(varName) > neededData.maxSliderVal) {
            inputValidityClass = "border-red-500 focus-visible:ring-red-500"
            inputValidityClassSlider = "outside-safe-range"
        }
    } else if (neededData.type === "const") {
        if (form.watch(varName) < neededData.constValue || form.watch(varName) > neededData.constValue) {
            inputValidityClass = "border-red-500 focus-visible:ring-red-500"
            inputValidityClassSlider = "outside-safe-range";
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {icon}
                    {displayName}
                </CardTitle>
                <CardDescription>
                    {neededData.type === "slider"
                        ? `Препоръчителен диапазон: ${neededData.minSliderVal} - ${neededData.maxSliderVal} ${FetchUnitIfExist(neededData)}`
                        : `Препорачителна стойност: ${neededData.constValue || ""} ${FetchUnitIfExist(neededData)}`}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                    {neededData.type === "slider" ? (
                        <>
                            <FormField
                                control={form.control}
                                name={varName}
                                render={({ field }) => (
                                    <Input className={`text-center text-xl ${inputValidityClass}`}
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                                        step={0.01}
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                )}
                            />
                        </>
                    ) : (
                        <FormField
                            control={form.control}
                            name={varName}
                            render={({ field }) => (
                                <Input className={`text-center text-xl ${inputValidityClass}`}
                                    type="number"
                                    {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                            )}
                        />
                    )}
                    <div className="text-center font-medium mt-1">
                        {`${form.watch(varName) || 0} ${FetchUnitIfExist(neededData)}`}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function DisplayOutputRow({ data, text, unit }: { data: number, text: string, unit: string }) {
    return (
        <div className="flex flex-row justify-between items-center gap-4">
            <div className="text-lg font-medium">{text}:</div>
            <div className="text-lg font-bold">{data}, {unit}</div>
        </div>
    )
}

export default function SowingRate() {
    const authObj = useSelector((state) => state.auth)
    const [dbData, setDbData] = useState<SowingRateDBData[]>([])
    const [calculatedRate, setCalculatedRate] = useState<number | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await APICaller(["calc", "sowingRate", "page", "init"], "/api/calc/sowing/input", "GET")

                if (!res.success) {
                    toast.error("Грешка при зареждане на данните", {
                        description: res.message,
                    })
                    return
                }

                setDbData(res.data)
            } catch (error) {
                toast.error("Грешка при зареждане на данните", {
                    description: "Моля, опитайте отново по-късно.",
                })
            }
        }
        fetchData()
    }, [])

    const { form, onSubmit, warnings, activePlantDbData, dataToBeSaved } = useSowingRateForm(authObj, dbData)

    // Calculate sowing rate when form values change
    useEffect(() => {
        if (activePlantDbData && form.watch("cultureLatinName")) {
            const coefficientSecurity = form.watch("coefficientSecurity") || 0
            const wantedPlants = form.watch("wantedPlantsPerMeterSquared") || 0
            const massPer1000g = form.watch("massPer1000g") || 0
            const purity = form.watch("purity") || 0
            const germination = form.watch("germination") || 0
            const rowSpacing = form.watch("rowSpacing") || 0

            if (coefficientSecurity && wantedPlants && massPer1000g && purity && germination && rowSpacing) {
                // Formula: (wantedPlants * massPer1000g * 100 * 100 * coefficientSecurity) / (purity * germination * 1000)
                const rate = (wantedPlants * massPer1000g * 100 * 100 * coefficientSecurity) / (purity * germination * 1000)
                setCalculatedRate(Number.parseFloat(rate.toFixed(2)))
            }
        }
    }, [form.watch(), activePlantDbData])

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-primary text-primary-foreground">
                    <CardTitle className="text-3xl">Калкулатор за сеитбена норма</CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-lg">
                        Изчислете точната сеитбена норма за вашите култури
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-4 flex flex-col items-center">
                                <h2 className="text-2xl font-semibold">Изберете култура</h2>
                                <FormField
                                    control={form.control}
                                    name="cultureLatinName"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="text-xl py-6">
                                                <SelectValue placeholder="Изберете култура" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dbData.map((plant) => (
                                                    <SelectItem
                                                        key={plant.plant.plantId}
                                                        value={plant.plant.plantLatinName}
                                                        className="text-lg py-3"
                                                    >
                                                        {GetLangNameFromMap("bg", plant.plant.plantLatinName)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {form.watch("cultureLatinName") && activePlantDbData && (
                                <>
                                    <div className="bg-muted p-4 rounded-lg mb-6 flex flex-col items-center">
                                        <h3 className="text-xl font-medium mb-2">Избрана култура</h3>
                                        <p className="text-2xl font-bold">
                                            {GetLangNameFromMap("bg", form.watch("cultureLatinName"))}
                                            <span className="text-muted-foreground ml-2"><i>({form.watch("cultureLatinName")})</i></span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <BuildSowingRateRow
                                            varName="coefficientSecurity"
                                            displayName="Коефициент сигурност"
                                            activePlantDbData={activePlantDbData}
                                            form={form}
                                            icon={<Scale className="h-5 w-5" />}
                                        />
                                        <BuildSowingRateRow
                                            varName="wantedPlantsPerMeterSquared"
                                            displayName="Желани растения на кв. м"
                                            activePlantDbData={activePlantDbData}
                                            form={form}
                                            icon={<Sprout className="h-5 w-5" />}
                                        />
                                        <BuildSowingRateRow
                                            varName="massPer1000g"
                                            displayName="Маса на 1000g семена"
                                            activePlantDbData={activePlantDbData}
                                            form={form}
                                            icon={<Scale className="h-5 w-5" />}
                                        />
                                        <BuildSowingRateRow
                                            varName="purity"
                                            displayName="Чистота"
                                            activePlantDbData={activePlantDbData}
                                            form={form}
                                            icon={<Droplet className="h-5 w-5" />}
                                        />
                                        <BuildSowingRateRow
                                            varName="germination"
                                            displayName="Кълнова способност"
                                            activePlantDbData={activePlantDbData}
                                            form={form}
                                            icon={<Leaf className="h-5 w-5" />}
                                        />
                                        <BuildSowingRateRow
                                            varName="rowSpacing"
                                            displayName="Редово разстояние"
                                            activePlantDbData={activePlantDbData}
                                            form={form}
                                            icon={<Ruler className="h-5 w-5" />}
                                        />
                                    </div>

                                    {
                                        Object.keys(warnings).length > 0 && (
                                            <div className="flex flex-col items-center space-y-4 mt-8">
                                                <h2 className="text-yellow-500 text-xl">Имате стойности извън препоръчани лимит!</h2>
                                            </div>
                                        )
                                    }

                                    {/* <p>{JSON.stringify(form.formState.errors)}</p>
                                    <p>{JSON.stringify(warnings)}</p> */}

                                    {form.formState.isValid && calculatedRate !== null && (
                                        <div>
                                            <Card className="mt-8 bg-primary text-primary-foreground">
                                                <CardContent className="pt-6">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <DisplayOutputRow
                                                            data={dataToBeSaved.sowingRateSafeSeedsPerMeterSquared}
                                                            text="Сеитбена норма"
                                                            unit="брой семена на m²"
                                                        />
                                                        <DisplayOutputRow
                                                            data={dataToBeSaved.sowingRatePlantsPerDecare}
                                                            text="Сеитбена норма"
                                                            unit="брой растения на декар"
                                                        />
                                                        <DisplayOutputRow
                                                            data={dataToBeSaved.usedSeedsKgPerDecare}
                                                            text="Използвани семена"
                                                            unit="кг/дка"
                                                        />
                                                        <DisplayOutputRow
                                                            data={dataToBeSaved.internalRowHeightCm}
                                                            text="Междуредно разстояние"
                                                            unit="см"
                                                        />
                                                        <p className="text-primary-foreground/80 text-center max-w-lg">
                                                            Това е препоръчителната сеитбена норма базирана на въведените от вас параметри. Може да варира според конкретните условия на полето.
                                                        </p>
                                                        {/* <p>
                                                            {JSON.stringify(activePlantDbData)}
                                                        </p>
                                                        <p>
                                                            {JSON.stringify(dataToBeSaved)}
                                                        </p> */}
                                                    </div>

                                                </CardContent>
                                            </Card>

                                            {
                                                authObj.isAuthenticated && (
                                                    <div className="flex justify-center mt-8">
                                                        <Button type="submit" size="lg" className="px-8 text-xl w-full">
                                                            Запази изчислението
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )}

                                    {
                                        form.formState.isValid && (<SowingCharts data={dataToBeSaved} />)
                                    }
                                </>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

