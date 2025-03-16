"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Leaf, PieChart } from "lucide-react"
import useSeedingCombinedForm from "@/app/hooks/useSeedingCombinedForm"
import { APICaller } from "@/lib/api-util"
import { RoundToSecondStr } from "@/lib/math-util"
import { CalculateParticipation, FormatCombinedFormSavedToGraphDisplay } from "@/lib/seedingCombined-utils"
import PlantCombinedCharts from "@/components/PlantCombinedCharts/PlantCombinedCharts"
import { SeedCombinedSection } from "@/components/SeedCombinedSection/SeedCombinedSection"

interface PlantCombinedDBData {
    id: string
    latinName: string
    plantType: string
    minSeedingRate: number
    maxSeedingRate: number
    priceFor1kgSeedsBGN: number
}

export default function Combined() {
    const authObj = useSelector((state) => state.auth)
    const [dbData, setDbData] = useState<PlantCombinedDBData[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const initData = await APICaller(["calc", "combined", "page", "init"], "/api/calc/combined/input", "GET")
                if (!initData.success) {
                    toast.error("Грешка при зареждане на данните", {
                        description: initData.message,
                    })
                    console.log(initData.message)
                    return
                }

                setDbData(initData.data)
            } catch (error) {
                toast.error("Грешка при зареждане на данните", {
                    description: "Моля, опитайте отново по-късно.",
                })
            }
        }
        fetchData()
    }, [])

    const { form, finalData, onSubmit, warnings } = useSeedingCombinedForm(authObj, dbData)

    if (!dbData || dbData.length === 0) {
        return (
            <div className="container mx-auto py-8 flex items-center justify-center min-h-[50vh]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 flex flex-col items-center">
                        <div className="animate-spin mb-4">
                            <PieChart className="h-10 w-10 text-primary" />
                        </div>
                        <p className="text-xl">Зареждане на данни...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalParticipation = CalculateParticipation(form.watch("legume")) + CalculateParticipation(form.watch("cereal"))
    const totalPrice = RoundToSecondStr(
        form.watch("legume").reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0) +
        form.watch("cereal").reduce((acc, curr) => acc + curr.priceSeedsPerDaBGN, 0),
    )

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="text-center bg-primary text-primary-foreground">
                    <CardTitle className="text-3xl">Сеитбена норма на смеска</CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-lg">
                        Изчислете точната сеитбена норма за вашите смески от култури
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <SeedCombinedSection
                                    name="legume"
                                    title="Многогодишни бобови фуражни култури"
                                    maxPercentage={60}
                                    form={form}
                                    dbData={dbData}
                                />

                                <SeedCombinedSection
                                    name="cereal"
                                    title="Многогодишни житни фуражни култури"
                                    maxPercentage={40}
                                    form={form}
                                    dbData={dbData}
                                />
                            </div>

                            <Card className="overflow-hidden">
                                <CardHeader className="bg-muted pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Leaf className="h-5 w-5" />
                                        Обобщение на смеската
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-3">
                                            <span className="font-semibold text-xl">Общо участие в смеската:</span>
                                            <span
                                                className={`text-xl font-bold ${totalParticipation !== 100 ? "text-yellow-500" : "text-green-500"}`}
                                            >
                                                {totalParticipation}%
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center border-b pb-3">
                                            <span className="font-semibold text-xl">Крайна цена:</span>
                                            <div>
                                                <span className="text-xl font-bold">{totalPrice}</span>
                                                <span className="text-xl"> BGN</span>
                                            </div>
                                        </div>

                                        {form.formState.errors.root && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                                                {form.formState.errors.root.message}
                                            </div>
                                        )}

                                        {/* {Object.entries(warnings).length > 0 && (
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                                                {Object.entries(warnings).map(([field, message]) => (
                                                    <p key={field}>{message}</p>
                                                ))}
                                            </div>
                                        )} */}

                                        {
                                            Object.keys(warnings).length > 0 && (
                                                <div className="flex flex-col items-center space-y-4 mt-8">
                                                    <h2 className="text-yellow-500 text-xl">Имате стойности извън препоръчани лимит!</h2>
                                                </div>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>

                            {authObj.isAuthenticated && (
                                <Button type="submit" className="w-full" size="lg" disabled={!form.formState.isValid}>
                                    Запази тази сметка
                                </Button>
                            )}

                            {form.formState.isValid && (
                                <div className="mt-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Визуализация на смеската</CardTitle>
                                            <CardDescription>Графично представяне на участието на културите в смеската</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <PlantCombinedCharts data={FormatCombinedFormSavedToGraphDisplay(finalData, dbData)} />
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

