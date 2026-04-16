'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card } from '@/components/ui/card';

const chartData = [
  { month: 'Enero', spending: 186 },
  { month: 'Febrero', spending: 305 },
  { month: 'Marzo', spending: 237 },
  { month: 'Abril', spending: 73 },
  { month: 'Mayo', spending: 209 },
  { month: 'Junio', spending: 214 },
];

const chartConfig = {
  spending: {
    label: 'Gastos',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function MonthlySpendingChart() {
  return (
    <Card className="p-4 border-none shadow-none">
      <ChartContainer config={chartConfig}>
        <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={40}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
