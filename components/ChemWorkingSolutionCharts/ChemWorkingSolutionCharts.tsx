import React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { useTranslate } from '@/app/hooks/useTranslate';
import { ChemProtWorkingToSave } from '@/lib/interfaces';

export default function ChemWorkingSolutionCharts({ data }: { data: ChemProtWorkingToSave }) {
  if (!data) {
    return null;
  }

  const translator = useTranslate();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // For the pie chart - relationship between components
  const pieData = [
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_CHEMICAL),
      value: data.totalChemicalForAreaLiters,
    },
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_SOLUTION),
      value: data.totalWorkingSolutionForAreaLiters,
    },
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER),
      value: data.chemicalPerSprayerLiters * data.roughSprayerCount,
    },
  ];

  // For bar chart - key metrics
  const barData = [
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_CHEMICAL),
      value: data.totalChemicalForAreaLiters,
    },
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_SOLUTION),
      value: data.totalWorkingSolutionForAreaLiters,
    },
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SPRAYER_COUNT),
      value: data.roughSprayerCount,
    },
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER),
      value: data.chemicalPerSprayerLiters * 1000, // Scale up for better visualization
    },
  ];

  // For efficiency metrics
  const efficiencyData = [
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_CONCENTRATION),
      efficiency: (data.totalChemicalForAreaLiters / data.totalWorkingSolutionForAreaLiters) * 100,
      fill: '#0088FE',
    },
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SPRAYER_EFFICIENCY),
      efficiency: (data.chemicalPerSprayerLiters / data.totalChemicalForAreaLiters) * 100,
      fill: '#00C49F',
    },
    {
      name: translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SOLUTION_DISTRIBUTION),
      efficiency: (data.totalWorkingSolutionForAreaLiters / (data.roughSprayerCount * data.chemicalPerSprayerLiters)) * 100,
      fill: '#FFBB28',
    },
  ];

  return (
    <div className="mt-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ)}
          </CardTitle>
          <CardDescription>
            {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_GENERAL)}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metrics Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_ALL_ELEMENTS)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {barData.map((item, index) => {
                const formatValue = (value: number) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`;
                  }
                  return value.toFixed(2);
                };

                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-bold">{formatValue(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${Math.min((item.value / Math.max(...barData.map(d => d.value))) * 100, 100)}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Showing proportion between components */}
        <Card>
          <CardHeader>
            <CardTitle>
              {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_ELEMENTS_RELATIONSHIP)}
            </CardTitle>
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
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}L`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Direct comparison of values */}
        <Card>
          <CardHeader>
            <CardTitle>
              {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_COMPARE_CALCED_PARAMS)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER)) {
                      return `${(value / 1000).toFixed(4)}L`;
                    }
                    return `${value.toFixed(2)}L`;
                  }}
                />
                <Bar dataKey="value" fill="#82ca9d">
                  {barData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency visualization */}
        <Card>
          <CardHeader>
            <CardTitle>
              {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_EFFICIENCY)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={efficiencyData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
                <Bar
                  dataKey="efficiency"
                  fill="#8884d8"
                  name={translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_EFFICIENCY_PERCENTAGE)}
                  radius={[0, 10, 10, 0]}
                >
                  {efficiencyData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center mt-2 text-muted-foreground">
              *{translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_EFFICIENCY_SUGGESTED)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
