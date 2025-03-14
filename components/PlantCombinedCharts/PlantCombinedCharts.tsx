"use client";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetLangNameFromMap } from "@/lib/utils";

export interface CombinedHistoryDataPlant {
    plantLatinName: string;
    plantType: string;
    seedingRate: number;
    participation: number;
    combinedRate: number;
    pricePerDABGN: number;
}

export interface CombinedHistoryData {
    plants: CombinedHistoryDataPlant[];
    totalPrice: number;
    userId: string;
    isDataValid: boolean;
}

export default function PlantCombinedCharts({ data }: { data: CombinedHistoryData | null }) {
    if (!data || !data.plants || data.plants.length === 0) {
        return null;
    }

    // The data already has the correct property names
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Bar Chart: Seeding Rate by Plant Type */}
            <Card>
                <CardHeader>
                    <CardTitle>Сеидбена норма по растение</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.plants}>
                            <XAxis dataKey={(item) => GetLangNameFromMap('bg', item.plantLatinName)} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="seedingRate" fill="#8884d8" name="Сеидбена норма" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Pie Chart: Participation Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Разпределение по участие</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={data.plants} dataKey="participation" nameKey={(item) => GetLangNameFromMap('bg', item.plantLatinName)} fill="#82ca9d" label />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Line Chart: Price per DA */}
            <Card>
                <CardHeader>
                    <CardTitle>Цена за декър сравнение</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.plants}>
                            <XAxis dataKey={(item) => GetLangNameFromMap('bg', item.plantLatinName)} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pricePerDABGN" stroke="#ff7300" name="Price per DA (BGN)" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Scatter Chart: Seeding Rate vs Combined Rate */}
            <Card>
                <CardHeader>
                    <CardTitle>Седибена норма самосточтелно срещу в смеска</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <XAxis dataKey="seedingRate" name="Сеидбена норма - самостоятелно" />
                            <YAxis dataKey="combinedRate" name="Сеидбена норма - в смескат" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Растение" data={data.plants} fill="#0088FE" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}