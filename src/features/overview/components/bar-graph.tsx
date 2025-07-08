'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'Antal jobb',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

interface BarGraphProps {
  data: Array<{
    category: string;
    count: number;
    displayName: string;
  }>;
  title?: string;
  description?: string;
}

export function BarGraph({
  data,
  title = 'Jobb per Kategori',
  description = 'Fördelning av lediga jobb'
}: BarGraphProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--color-count)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-count)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='displayName'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={<ChartTooltipContent className='w-[200px]' />}
            />
            <Bar dataKey='count' fill='url(#fillBar)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
