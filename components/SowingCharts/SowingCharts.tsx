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
import { useTranslate } from '@/app/hooks/useTranslate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FormatValue, UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import { SowingRateSaveData } from '@/lib/interfaces';

export default function SowingCharts({ data }: { data: SowingRateSaveData }) {
  if (!data) {
    return null;
  }

  const translator = useTranslate();
  const unitOfMeasurement = useSelector((state: RootState) => state.local.unitOfMeasurementLength);

  // Create data for comparison chart (comparing this calculation with optimal ranges)
  const plantName = translator(data.plantLatinName) || data.plantLatinName;

  // For the pie chart - relationship between components
  const pieData = [
    {
      name: unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ?
        translator(SELECTABLE_STRINGS.KG_ACRE) :
        translator(SELECTABLE_STRINGS.KG_HECTARE),
      value: data.usedSeedsKgPerAcre,
    },
    {
      name: unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ?
        translator(SELECTABLE_STRINGS.PLANTS_PER_ACRE) :
        translator(SELECTABLE_STRINGS.PLANTS_PER_HECTARE),
      value: data.sowingRateSafeSeedsPerMeterSquared / 100,
    }, // Scale down for better visualization
    {
      name: `${translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_ROW_SPACING)} (${translator(SELECTABLE_STRINGS.CM)})`,
      value: data.internalRowHeightCm,
    },
  ];

  const maxValues = {
    seedsPerMeter: 10000, // Assumed maximum seeds per meter squared
    plantsPerAcre: 50000, // Assumed maximum plants per Acre
    kgPerAcre: 500, // Assumed maximum kg per Acre
    rowHeightCm: 50, // Assumed maximum row height cm
  };

  const radarData = [
    {
      metric: translator(SELECTABLE_STRINGS.SEEDS_PER_M2),
      value: data.sowingRateSafeSeedsPerMeterSquared,
      fullMark: maxValues.seedsPerMeter,
    },
    {
      metric: translator(SELECTABLE_STRINGS.PLANTS_PER_ACRE),
      value: data.sowingRatePlantsPerAcre,
      fullMark: maxValues.plantsPerAcre,
    },
    {
      metric: translator(SELECTABLE_STRINGS.KG_ACRE),
      value: data.usedSeedsKgPerAcre * 10, // Scale up for better visualization
      fullMark: maxValues.kgPerAcre * 10,
    },
    {
      metric: translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_ROW_SPACING),
      value: data.internalRowHeightCm,
      fullMark: maxValues.rowHeightCm,
    },
  ];

  // For bar chart - key metrics
  const barData = [
    {
      name: translator(SELECTABLE_STRINGS.SEEDS_PER_M2),
      value: data.sowingRateSafeSeedsPerMeterSquared,
    },
    {
      name: translator(SELECTABLE_STRINGS.PLANTS_PER_ACRE),
      value: data.sowingRatePlantsPerAcre / 100,
    }, // Scale down for visualization
    {
      name: translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_USED_SEEDS),
      value: data.usedSeedsKgPerAcre * 10,
    }, // Scale up for visualization
    {
      name: translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_ROW_SPACING),
      value: data.internalRowHeightCm,
    },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="mt-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            {translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ)}
          </CardTitle>
          <CardDescription>
            {translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_GENERAL)} {plantName}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metrics Overview - Custom display for large numbers */}
        <Card id="analysisSection">
          <CardHeader>
            <CardTitle>{translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_ALL_ELEMENTS)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {radarData.map((item, index) => {

                // Calculate percentage of max value for visual indicator
                const percentage = (item.value / item.fullMark) * 100;

                return (
                  <div key={item.metric} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <span className="text-sm font-bold">{FormatValue(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      Max: {FormatValue(item.fullMark)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Showing proportion between parameters */}
        <Card>
          <CardHeader>
            <CardTitle>
              {translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_ELEMENTS_RELATIONSHIP)}
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
            <CardTitle>
              {translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_COMPARE_CALCED_PARAMS)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name, props) => {
                    // Undo scaling for display in tooltip
                    if (
                      name ===
                      translator(SELECTABLE_STRINGS.PLANTS_PER_ACRE)
                    ) {
                      return (value * 100).toFixed(0);
                    }
                    if (name === translator(SELECTABLE_STRINGS.KG_ACRE)) {
                      return (value / 10).toFixed(2);
                    }
                    return value;
                  }}
                />
                <Bar dataKey="value" fill="#82ca9d">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center mt-2 text-muted-foreground">
              *{translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_COMPARE_CALCED_PARAMS_VECED)}
            </div>
          </CardContent>
        </Card>

        {/* Relationship visualization */}
        <Card>
          <CardHeader>
            <CardTitle>
              {translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_PLANTING_EFFICIENCY)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: translator(
                      SELECTABLE_STRINGS.SOWING_RATE_VIZ_PLANTING_EFFICIENCY_SEEDS_TO_PLANTS
                    ),
                    efficiency:
                      (data.sowingRatePlantsPerAcre / (data.usedSeedsKgPerAcre * 1000)) * 100,
                    fill: '#0088FE',
                  },
                  {
                    name: translator(
                      SELECTABLE_STRINGS.SOWING_RATE_VIZ_PLANTING_EFFICIENCY_COVERAGE
                    ),
                    efficiency: 100 - (data.internalRowHeightCm / 50) * 100,
                    fill: '#00C49F',
                  },
                  {
                    name: translator(
                      SELECTABLE_STRINGS.SOWING_RATE_VIZ_PLANTING_EFFICIENCY_DENSITY
                    ),
                    efficiency: (data.sowingRateSafeSeedsPerMeterSquared / 400) * 100,
                    fill: '#FFBB28',
                  },
                ]}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
                <Bar
                  dataKey="efficiency"
                  fill="#8884d8"
                  name={`${translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_PLANTING_EFFICIENCY_PARTICIPATION)} (%)`}
                  radius={[0, 10, 10, 0]}
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center mt-2 text-muted-foreground">
              *{translator(SELECTABLE_STRINGS.SOWING_RATE_VIZ_PLANTING_EFFICIENCY_SUGGESTED)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
