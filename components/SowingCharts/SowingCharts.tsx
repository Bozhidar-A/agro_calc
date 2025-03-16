import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SowingRateSaveData } from '@/app/hooks/useSowingRateForm';
import { GetLangNameFromMap } from '@/lib/utils';

export default function SowingCharts({ data }: { data: SowingRateSaveData }) {
    if (!data) {
        return null;
    }

    // Create data for comparison chart (comparing this calculation with optimal ranges)
    const plantName = GetLangNameFromMap('bg', data.plantLatinName) || data.plantLatinName;

    // For the pie chart - relationship between components
    const pieData = [
        { name: 'Кг/дка', value: data.usedSeedsKgPerDecare },
        { name: 'Растения/м²', value: data.sowingRateSafeSeedsPerMeterSquared / 100 }, // Scale down for better visualization
        { name: 'Междуредие (см)', value: data.internalRowHeightCm }
    ];

    // For radar chart - normalized values for visualization
    const maxValues = {
        seedsPerMeter: 500,  // Assumed maximum seeds per meter squared
        plantsPerDecare: 50000, // Assumed maximum plants per decare
        kgPerDecare: 25,     // Assumed maximum kg per decare
        rowHeightCm: 50      // Assumed maximum row height cm
    };

    const radarData = [
        {
            metric: "Семена/м²",
            value: data.sowingRateSafeSeedsPerMeterSquared,
            fullMark: maxValues.seedsPerMeter
        },
        {
            metric: "Растения/дка",
            value: data.sowingRatePlantsPerDecare,
            fullMark: maxValues.plantsPerDecare
        },
        {
            metric: "кг/дка",
            value: data.usedSeedsKgPerDecare * 10, // Scale up for better visualization
            fullMark: maxValues.kgPerDecare * 10
        },
        {
            metric: "Редово разстояние",
            value: data.internalRowHeightCm,
            fullMark: maxValues.rowHeightCm
        }
    ];

    // For bar chart - key metrics
    const barData = [
        { name: 'Семена/м²', value: data.sowingRateSafeSeedsPerMeterSquared },
        { name: 'Растения/дка', value: data.sowingRatePlantsPerDecare / 100 }, // Scale down for visualization
        { name: 'кг/дка', value: data.usedSeedsKgPerDecare * 10 }, // Scale up for visualization
        { name: 'Редово р-е (см)', value: data.internalRowHeightCm }
    ];

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="mt-8">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Визуализация на изчислението</CardTitle>
                    <CardDescription>
                        Графично представяне на резултатите за {plantName}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar Chart - Overall view of all metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Обща визуализация на параметрите</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart outerRadius={90} data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="metric" />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                                <Radar
                                    name={plantName}
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.6}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart - Showing proportion between parameters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Пропорции между параметрите</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toFixed(2)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bar Chart - Direct comparison of values */}
                <Card>
                    <CardHeader>
                        <CardTitle>Сравнение на изчислените стойности</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value, name, props) => {
                                    // Undo scaling for display in tooltip
                                    if (name === 'Растения/дка') return (value * 100).toFixed(0);
                                    if (name === 'кг/дка') return (value / 10).toFixed(2);
                                    return value;
                                }} />
                                <Bar dataKey="value" fill="#82ca9d">
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center mt-2 text-muted-foreground">
                            *Стойностите са мащабирани за по-добра визуализация
                        </div>
                    </CardContent>
                </Card>

                {/* Relationship visualization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ефективност на сеитбата</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={[
                                    {
                                        name: 'Семена→Растения',
                                        efficiency: (data.sowingRatePlantsPerDecare /
                                            (data.usedSeedsKgPerDecare * 1000)) * 100,
                                        fill: '#0088FE'
                                    },
                                    {
                                        name: 'Покритие',
                                        efficiency: 100 - (data.internalRowHeightCm / 50 * 100),
                                        fill: '#00C49F'
                                    },
                                    {
                                        name: 'Гъстота',
                                        efficiency: (data.sowingRateSafeSeedsPerMeterSquared / 400) * 100,
                                        fill: '#FFBB28'
                                    }
                                ]}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                <Legend />
                                <Bar dataKey="efficiency" fill="#8884d8" name="Ефективност (%)" radius={[0, 10, 10, 0]}>
                                    {[0, 1, 2].map((index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center mt-2 text-muted-foreground">
                            *Относителни показатели за качество на сеитбата
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}