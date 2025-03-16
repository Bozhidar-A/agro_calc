"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalculateParticipation } from "@/lib/seedingCombined-utils"
import { SeedCombinedRow } from "@/components/SeedCombinedRow/SeedCombinedRow"
import { TreesIcon as Plant, Percent } from "lucide-react"

interface SeedCombinedSectionProps {
    name: string
    title: string
    maxPercentage: number
    form: any
    dbData: any[]
}

export function SeedCombinedSection({ name, title, maxPercentage, form, dbData }: SeedCombinedSectionProps) {
    const participation = CalculateParticipation(form.watch(name))
    const isOverLimit = participation > maxPercentage

    return (
        <Card className="overflow-hidden">
            <CardHeader className={`${isOverLimit ? "bg-red-50" : "bg-muted"} pb-4`}>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Plant className="h-5 w-5" />
                    {title}
                </CardTitle>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg">Общо участие: {participation.toFixed(1)}%</span>
                    </div>
                    <span className={`text-lg font-medium ${isOverLimit ? "text-red-500" : "text-green-500"}`}>
                        Максимално: {maxPercentage}%
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {isOverLimit && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>Участието надвишава максималния процент. Моля, намалете участието.</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-4">
                    <div className="grid grid-cols-6 gap-4 font-medium text-sm md:text-base border-b pb-2">
                        <div className="text-center">Активно?</div>
                        <div>Растиение</div>
                        <div>Сеидбена норма - самостоятелно</div>
                        <div>Участие (%)</div>
                        <div>Сеидбена норма - в смеската</div>
                        <div>Цена на семена за da/BGN</div>
                    </div>

                    {form.watch(name).map((_, index) => (
                        <SeedCombinedRow key={index} form={form} name={name} index={index} dbData={dbData} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

