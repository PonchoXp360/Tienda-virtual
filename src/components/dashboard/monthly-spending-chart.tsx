'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card } from '@/components/ui/card';

type ChartDataPoint = {
  month: string;
  spending: number;
};

interface MonthlySpendingChartProps {
  data: ChartDataPoint[];
}

const chartConfig = {
  spending: {
    label: 'Gastos',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function MonthlySpendingChart({ data }: MonthlySpendingChartProps) {
  if (data.every((d) => d.spending === 0)) {
    return (
      <p className="text-center text-sm text-muted-foreground py-8">
        Sin compras en los últimos 6 meses.
      </p>
    );
  }

  return (
    <Card className="p-4 border-none shadow-none">
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={data}
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
