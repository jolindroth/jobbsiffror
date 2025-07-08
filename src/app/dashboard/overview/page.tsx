import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { AreaGraph } from '@/features/overview/components/area-graph';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { PieGraph } from '@/features/overview/components/pie-graph';
import { RecentSales } from '@/features/overview/components/recent-sales';
import { GetVacancies } from '@/services/jobtech-api';
import { getDefaultFromDate, getDefaultToDate } from '@/lib/date-utils';
import {
  transformToAreaChart,
  transformToBarChart,
  transformToPieChart,
  calculateSummaryStats
} from '@/lib/chart-data-transformers';

interface OverviewPageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    region?: string;
    occupation?: string;
  }>;
}

export default async function OverviewPage({
  searchParams: searchParamsPromise
}: OverviewPageProps) {
  // Await searchParams in Next.js 15
  const searchParams = await searchParamsPromise;
  // Get date range from search params or use defaults (last 12 months)
  const dateFrom = searchParams.from || getDefaultFromDate();
  const dateTo = searchParams.to || getDefaultToDate();
  const region = searchParams.region;
  const occupation = searchParams.occupation;

  try {
    // Single API call for dashboard data
    const dashboardData = await GetVacancies(
      dateFrom,
      dateTo,
      region,
      occupation
    );

    // Transform data for different chart types
    const areaChartData = transformToAreaChart(dashboardData);
    const barChartData = transformToBarChart(
      dashboardData,
      region ? 'occupation' : 'region'
    );
    const pieChartData = transformToPieChart(
      dashboardData,
      region ? 'occupation' : 'region'
    );

    // Calculate summary statistics
    const stats = calculateSummaryStats(dashboardData);

    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-2'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Sveriges jobbsiffror
            </h2>
          </div>

          {/* Statistics Cards */}
          <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
            <Card className='@container/card'>
              <CardHeader>
                <CardDescription>Totala Lediga Jobb</CardDescription>
                <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                  {stats.totalVacancies.toLocaleString('sv-SE')}
                </CardTitle>
                <CardAction>
                  <Badge variant='outline'>
                    {stats.monthOverMonthChange > 0 ? (
                      <IconTrendingUp />
                    ) : (
                      <IconTrendingDown />
                    )}
                    {stats.monthOverMonthChange > 0 ? '+' : ''}
                    {stats.monthOverMonthChange.toFixed(1)}%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                <div className='line-clamp-1 flex gap-2 font-medium'>
                  {stats.monthOverMonthChange > 0 ? 'Ökning' : 'Minskning'} från
                  förra månaden{' '}
                  {stats.monthOverMonthChange > 0 ? (
                    <IconTrendingUp className='size-4' />
                  ) : (
                    <IconTrendingDown className='size-4' />
                  )}
                </div>
                <div className='text-muted-foreground'>
                  Baserat på senaste data
                </div>
              </CardFooter>
            </Card>

            <Card className='@container/card'>
              <CardHeader>
                <CardDescription>Mest Aktiva Region</CardDescription>
                <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                  {stats.mostActiveRegion || 'Ej tillgänglig'}
                </CardTitle>
                <CardAction>
                  <Badge variant='outline'>
                    <IconTrendingUp />
                    #1
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                <div className='line-clamp-1 flex gap-2 font-medium'>
                  Flest publicerade jobb <IconTrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground'>Regional aktivitet</div>
              </CardFooter>
            </Card>

            <Card className='@container/card'>
              <CardHeader>
                <CardDescription>Mest Aktiva Yrke</CardDescription>
                <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                  {stats.mostActiveOccupation || 'Ej tillgänglig'}
                </CardTitle>
                <CardAction>
                  <Badge variant='outline'>
                    <IconTrendingUp />
                    #1
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                <div className='line-clamp-1 flex gap-2 font-medium'>
                  Högst efterfrågan <IconTrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground'>
                  Mest sökta kompetens
                </div>
              </CardFooter>
            </Card>

            <Card className='@container/card'>
              <CardHeader>
                <CardDescription>Senaste Uppdatering</CardDescription>
                <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                  {stats.lastUpdated}
                </CardTitle>
                <CardAction>
                  <Badge variant='outline'>
                    <IconTrendingUp />
                    Live
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                <div className='line-clamp-1 flex gap-2 font-medium'>
                  Aktuell data <IconTrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground'>
                  Uppdateras kontinuerligt
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <div className='col-span-4'>
              <BarGraph
                data={barChartData}
                title={region ? 'Jobb per Yrke' : 'Jobb per Region'}
                description={`Fördelning av lediga jobb ${region ? 'inom olika yrken' : 'över regioner'}`}
              />
            </div>
            <div className='col-span-4 md:col-span-3'>
              <RecentSales />
            </div>
            <div className='col-span-4'>
              <AreaGraph
                data={areaChartData}
                title='Lediga Jobb Över Tid'
                description='Månadsvis utveckling av jobbmarknaden'
              />
            </div>
            <div className='col-span-4 md:col-span-3'>
              <PieGraph
                data={pieChartData}
                title='Fördelning av Jobb'
                description={`Procentuell fördelning ${region ? 'per yrke' : 'per region'}`}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    // Show error state
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col items-center justify-center space-y-4'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Kunde inte ladda data
          </h2>
          <p className='text-muted-foreground'>
            Ett fel uppstod när jobbstatistiken skulle hämtas. Försök igen
            senare.
          </p>
        </div>
      </PageContainer>
    );
  }
}
