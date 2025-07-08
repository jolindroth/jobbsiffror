'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    label: 'Antal jobb'
  }
} satisfies ChartConfig;

interface PieGraphProps {
  data: Array<{
    category: string;
    count: number;
    displayName: string;
    fill: string;
  }>;
  title?: string;
  description?: string;
}

export function PieGraph({
  data,
  title = 'Fördelning av Jobb',
  description = 'Procentuell fördelning av lediga jobb'
}: PieGraphProps) {
  const totalCount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey='count'
              nameKey='displayName'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalCount.toLocaleString('sv-SE')}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Totalt
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {data.length > 0 && (
          <div className='flex items-center gap-2 leading-none font-medium'>
            {data[0].displayName} leder med{' '}
            {((data[0].count / totalCount) * 100).toFixed(1)}%{' '}
            <IconTrendingUp className='h-4 w-4' />
          </div>
        )}
        <div className='text-muted-foreground leading-none'>
          Baserat på senaste data
        </div>
      </CardFooter>
    </Card>
  );
}
