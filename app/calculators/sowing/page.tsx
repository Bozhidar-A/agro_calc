'use client';

import useSowingRateForm from "@/app/hooks/useSowingRateForm";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APICaller } from "@/lib/api-util";
import { GetLangNameFromMap } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export interface SowingRateDBData {
    plant: Plant;

    coefficientSecurity: CoefficientSecurity;

    wantedPlantsPerMeterSquared: WantedPlantsPerMeterSquared;

    massPer1000g: MassPer1000g

    purity: Purity;

    germination: Germination;

    rowSpacing: RowSpacing;
}

interface Plant {
    plantId: string;
    plantLatinName: string;
}

interface CoefficientSecurity {
    type: string; // "slider" or "const"
    unit: string;
    // Fields for slider type
    step?: number;
    minSliderVal?: number;
    maxSliderVal?: number;
    // Field for const type
    constValue?: number;
}

interface WantedPlantsPerMeterSquared {
    type: string; // "slider" or "const"
    unit: string;
    // Fields for slider type
    step?: number;
    minSliderVal?: number;
    maxSliderVal?: number;
    // Field for const type
    constValue?: number;
}

interface MassPer1000g {
    type: string; // "slider" or "const"
    unit: string;
    // Fields for slider type
    step?: number;
    minSliderVal?: number;
    maxSliderVal?: number;
    // Field for const type
    constValue?: number;
}

interface Purity {
    type: string; // "slider" or "const"
    unit: string;
    // Fields for slider type
    step?: number;
    minSliderVal?: number;
    maxSliderVal?: number;
    // Field for const type
    constValue?: number;
}

interface Germination {
    type: string; // "slider" or "const"
    unit: string;
    // Fields for slider type
    step?: number;
    minSliderVal?: number;
    maxSliderVal?: number;
    // Field for const type
    constValue?: number;
}

interface RowSpacing {
    type: string; // "slider" or "const"
    unit: string;
    // Fields for slider type
    step?: number;
    minSliderVal?: number;
    maxSliderVal?: number;
    // Field for const type
    constValue?: number;
}

function FetchUnitIfExist(data) {
    return data.unit ? `${data.unit}` : "";
}

interface BuildSowingRateRowProps<T extends Exclude<keyof SowingRateDBData, "plant">> {
    varName: T;
    displayName: string;
    activePlantDbData: SowingRateDBData;
    form: any;
}

function BuildSowingRateRow<T extends Exclude<keyof SowingRateDBData, "plant">>({
    varName,
    displayName,
    activePlantDbData,
    form
}: BuildSowingRateRowProps<T>) {
    const neededData = activePlantDbData[varName];

    let inputValidityClass = "within-safe-range";

    if (neededData.type === "slider") {
        if (form.watch(varName) < neededData.minSliderVal || form.watch(varName) > neededData.maxSliderVal) {
            inputValidityClass = "outside-safe-range";
        } else {
            inputValidityClass = "within-safe-range";
        }
    } else if (neededData.type === "const") {
        if (form.watch(varName) < neededData.constValue) {
            inputValidityClass = "outside-safe-range";
        } else {
            inputValidityClass = "within-safe-range";
        }
    }

    return (
        <>
            {/* name and min/max */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">
                    {`${displayName} ${FetchUnitIfExist(neededData)}`}
                </h2>
                {neededData.type === "slider" ?
                    <p className="text-xl">{`(${neededData.minSliderVal} ${FetchUnitIfExist(neededData)} - ${neededData.maxSliderVal} ${FetchUnitIfExist(neededData)})`}</p>
                    :
                    <p className="text-xl">{`(${neededData.constValue ? neededData.constValue : ""} ${FetchUnitIfExist(neededData)})`}</p>}
            </div>

            {/* actual input */}
            <div className="flex flex-col">
                {
                    neededData.type === "slider" ?
                        <>
                            <FormField
                                control={form.control}
                                name={varName}
                                render={({ field }) => (
                                    <Input
                                        className={`text-center !text-2xl ${inputValidityClass}`}
                                        type="number"
                                        {...field}
                                    />
                                )}
                            /><FormField
                                control={form.control}
                                name={varName}
                                render={({ field }) => (
                                    <input
                                        className={`text-center !text-2xl ${inputValidityClass}`}
                                        type="range"
                                        min={neededData.minSliderVal}
                                        max={neededData.maxSliderVal}
                                        step={neededData.step}
                                        {...field}
                                    />
                                )}
                            />
                        </>
                        :
                        <FormField
                            control={form.control}
                            name={varName}
                            render={({ field }) => (
                                <Input
                                    className={`text-center !text-2xl ${inputValidityClass}`}
                                    type="number"
                                    {...field}
                                />
                            )}
                        />
                }
            </div>

            {/* display of current value */}
            <div>
                <Input disabled className="text-center !text-2xl" value={`${form.watch(varName) || 0} ${FetchUnitIfExist(neededData)}`} />
            </div>
        </>
    );
}


export default function SowingRate() {
    const authObj = useSelector((state) => state.auth);

    //state for the fetched data from db
    const [dbData, setDbData] = useState<SowingRateDBData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await APICaller(['calc', 'sowingRate', 'page', 'init'], '/api/calc/sowing/input', "GET");

            if (!res.success) {
                toast.error("Failed to fetch data", {
                    description: res.message,
                });
                return;
            }

            setDbData(res.data);
        };
        fetchData();
    }, [])

    const { form, onSubmit, activePlantDbData } = useSowingRateForm(authObj, dbData);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
            <h1 className="text-2xl font-bold">Сеитбена норма</h1>
            {/* <p>{JSON.stringify(dbData)}</p>
            <p>{JSON.stringify(activePlantDbData)}</p> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-7xl">
                    <div className="border-b pb-4">
                        <div className="grid gap-4">
                            <h2 className="text-2xl font-semibold mb-4">Избрана култура - {
                                form.watch('cultureLatinName') ? `${GetLangNameFromMap('bg', form.watch("cultureLatinName"))} (${form.watch("cultureLatinName")})` : "?"
                            }</h2>
                            <FormField
                                control={form.control}
                                name="cultureLatinName"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value} >
                                        <SelectTrigger className="text-2xl py-3 px-4"><SelectValue placeholder="Изберете култура" /></SelectTrigger>
                                        <SelectContent>
                                            {
                                                dbData.map((plant) => (
                                                    <SelectItem key={plant.plant.plantId} value={plant.plant.plantLatinName} className="text-xl py-3 px-4">
                                                        {GetLangNameFromMap('bg', plant.plant.plantLatinName)}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    {
                        form.watch('cultureLatinName') && activePlantDbData && (<div className="grid grid-cols-3 gap-8 items-center">
                            <BuildSowingRateRow varName="coefficientSecurity" displayName="Коефициент сигурност" activePlantDbData={activePlantDbData} form={form} />
                            <BuildSowingRateRow varName="wantedPlantsPerMeterSquared" displayName="Желани растения на кв. м" activePlantDbData={activePlantDbData} form={form} />
                            <BuildSowingRateRow varName="massPer1000g" displayName="Маса на 1000g семена" activePlantDbData={activePlantDbData} form={form} />
                            <BuildSowingRateRow varName="purity" displayName="Чистота" activePlantDbData={activePlantDbData} form={form} />
                            <BuildSowingRateRow varName="germination" displayName="Кълнова способност" activePlantDbData={activePlantDbData} form={form} />
                            <BuildSowingRateRow varName="rowSpacing" displayName="Редово разстояние" activePlantDbData={activePlantDbData} form={form} />
                        </div>)
                    }
                </form>
            </Form>
        </div >
    )
}