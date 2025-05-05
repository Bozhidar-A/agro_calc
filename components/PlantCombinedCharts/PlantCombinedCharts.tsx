"use client";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/app/hooks/useTranslate";

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

    const translator = useTranslate();

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
                            <XAxis dataKey={(item) => translator(item.plantLatinName)} />
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
                            <Pie data={data.plants} dataKey="participation" nameKey={(item) => translator(item.plantLatinName)} fill="#82ca9d" label />
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
                            <XAxis dataKey={(item) => translator(item.plantLatinName)} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pricePerDABGN" stroke="#ff7300" name="Price per DA (BGN)" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Replace Scatter Chart with Grouped Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Сравнение на сеидбени норми</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.plants}>
                            <XAxis dataKey={(item) => translator(item.plantLatinName)} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="seedingRate"
                                fill="#8884d8"
                                name="Сеидбена норма - самостоятелно"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="combinedRate"
                                fill="#82ca9d"
                                name="Сеидбена норма - в смеската"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}