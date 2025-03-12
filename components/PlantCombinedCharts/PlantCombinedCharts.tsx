"use client";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CombinedCalcDBData } from "@/app/hooks/useSeedingCombinedForm";

export default function PlantCombinedCharts({ data }: { data: CombinedCalcDBData | null }) {
    if (!data || !data.plants || data.plants.length === 0) {
        return null;
    }

    // The data already has the correct property names
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Bar Chart: Seeding Rate by Plant Type */}
            <Card>
                <CardHeader>
                    <CardTitle>Seeding Rate by Plant Type</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.plants}>
                            <XAxis dataKey="plantType" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="seedingRate" fill="#8884d8" name="Seeding Rate" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Pie Chart: Participation Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Participation Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={data.plants} dataKey="participation" nameKey="plantType" fill="#82ca9d" label />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Line Chart: Price per DA */}
            <Card>
                <CardHeader>
                    <CardTitle>Price per DA Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.plants}>
                            <XAxis dataKey="plantType" />
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
                    <CardTitle>Seeding Rate vs Combined Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <XAxis dataKey="seedingRate" name="Seeding Rate" />
                            <YAxis dataKey="combinedRate" name="Combined Rate" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Plants" data={data.plants} fill="#0088FE" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}