'use client';

import { useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Errored from '@/components/Errored/Errored';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslate } from '@/hooks/useTranslate';
import { CombinedHistoryData } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { KgPerAcreToKgPerHectare } from '@/lib/math-util';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';

export default function CombinedCharts({ data }: { data: CombinedHistoryData | null }) {
  const translator = useTranslate();
  const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength);

  if (!data || !data.plants || data.plants.length === 0) {
    return <Errored />;
  }

  return (
    <div className="mt-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            {translator(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_TITLE)}
          </CardTitle>
          <CardDescription>
            {translator(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_DESCRIPTION)}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Seeding Rate by Plant Type */}
        <Card>
          <CardHeader>
            <CardTitle>
              {translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_BY_PLANT_TYPE)}
            </CardTitle>
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
                  name={translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE)}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: Participation Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              {translator(SELECTABLE_STRINGS.COMBINED_PARTICIPATION_DISTRIBUTION)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.plants}
                  dataKey="participation"
                  nameKey={(item) => translator(item.plantLatinName)}
                  fill="#82ca9d"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart: Price per Acre/Hectare */}
        <Card>
          <CardHeader>
            <CardTitle>
              {unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES
                ? translator(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON)
                : translator(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.plants}>
                <XAxis dataKey={(item) => translator(item.plantLatinName)} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={(item) =>
                    unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES
                      ? item.pricePerAcreBGN
                      : KgPerAcreToKgPerHectare(item.pricePerAcreBGN)
                  }
                  stroke="#ff7300"
                  name={translator(
                    unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES
                      ? SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON_LABEL
                      : SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON_LABEL
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Replace Scatter Chart with Grouped Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_COMPARISON)}</CardTitle>
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
                  name={translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_SINGLE_PLANT)}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="combinedRate"
                  fill="#82ca9d"
                  name={translator(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_MIX_PLANT)}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
