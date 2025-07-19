import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import { PieGraph } from '@/features/overview/components/pie-graph';
import { RecentSales } from '@/features/overview/components/recent-sales';
import {
  GetHistoricalVacanciesByRange,
  GetHistoricalVacanciesByRegions,
  shouldFetchAllRegions
} from '@/services/jobtech-api';
import {
  getDefaultFromDate,
  getDefaultToDate,
  monthToDateRange
} from '@/lib/date-utils';
import {
  transformToAreaChart,
  transformToPieChart,
  calculateSummaryStats,
  transformToMapChart
} from '@/lib/chart-data-transformers';
import { parseFilters } from '@/lib/filter-parser';
import { SWEDISH_REGIONS } from '@/constants/swedish-regions';
import { OCCUPATION_GROUPS } from '@/constants/occupation-groups';
import { VacancyFilters } from '@/components/vacancy-filters';
import { SwedenMap } from '@/components/sweden-map';

interface VacanciesPageProps {
  params: Promise<{ filters?: string[] }>;
  searchParams: Promise<{
    fromMonth?: string;
    toMonth?: string;
    // Legacy support for old date format
    from?: string;
    to?: string;
  }>;
}

export default async function VacanciesPage({
  params: paramsPromise,
  searchParams: searchParamsPromise
}: VacanciesPageProps) {
  // Await params and searchParams for Next.js 15 compatibility
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  const { region, occupation, invalid } = parseFilters(params.filters);

  if (invalid) {
    notFound();
  }

  // Get date range from search params or use defaults (last 12 months)
  let dateFrom: string;
  let dateTo: string;

  if (searchParams.fromMonth && searchParams.toMonth) {
    // Use month-based parameters (new format)
    const fromRange = monthToDateRange(searchParams.fromMonth);
    const toRange = monthToDateRange(searchParams.toMonth);
    dateFrom = fromRange.from;
    dateTo = toRange.to;
  } else {
    // Use defaults (last 12 months)
    dateFrom = getDefaultFromDate();
    dateTo = getDefaultToDate();
  }

  try {
    // Determine which API to use based on whether we need multi-region data
    const needsAllRegions = shouldFetchAllRegions(region);

    let dashboardData;
    let mapData;

    if (needsAllRegions) {
      // Fetch all regions for map visualization
      // (cutoff filtering happens automatically inside API functions)
      mapData = await GetHistoricalVacanciesByRegions(
        dateFrom,
        dateTo,
        occupation
      );

      // For other charts, we still need aggregated data
      // (cutoff filtering happens automatically inside API functions)
      dashboardData = await GetHistoricalVacanciesByRange(
        dateFrom,
        dateTo,
        region,
        occupation
      );
    } else {
      // Single region selected - use existing API for everything
      // (cutoff filtering happens automatically inside API functions)
      dashboardData = await GetHistoricalVacanciesByRange(
        dateFrom,
        dateTo,
        region,
        occupation
      );

      // For map, we'll show only the selected region
      mapData = dashboardData;
    }

    // Transform data for different chart types
    const areaChartData = transformToAreaChart(dashboardData);
    const pieChartData = transformToPieChart(
      dashboardData,
      region ? 'occupation' : 'region'
    );

    // Transform data for map visualization
    const mapChartData = transformToMapChart(mapData);

    // Calculate summary statistics
    const stats = calculateSummaryStats(dashboardData);

    return (
      <PageContainer>
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex items-center justify-between gap-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              {buildPageTitle(region, occupation)}
            </h2>
          </div>

          {/* Filter and Statistics Cards */}
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]'>
            {/* Filter Component */}
            <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs'>
              <VacancyFilters
                currentRegion={region}
                currentOccupation={occupation}
              />
            </div>

            {/* Statistics Cards */}
            <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2'>
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
                    {stats.monthOverMonthChange > 0 ? 'Ökning' : 'Minskning'}{' '}
                    från förra månaden{' '}
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
                  <div className='text-muted-foreground'>
                    Regional aktivitet
                  </div>
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
          </div>

          {/* Charts Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <div className='col-span-4'>
              <AreaGraph
                data={areaChartData}
                title='Lediga Jobb Över Tid'
                description='Månadsvis utveckling av jobbmarknaden'
              />
            </div>
            <div className='col-span-4 md:col-span-3'>
              <SwedenMap
                data={mapChartData}
                currentRegion={region}
                title={region ? 'Jobb per Yrke' : 'Jobb per Region'}
                description={`Geografisk fördelning av lediga jobb ${region ? 'inom olika yrken' : 'över regioner'}`}
              />
            </div>
            <div className='col-span-4'>
              <RecentSales />
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

export async function generateMetadata({
  params: paramsPromise
}: VacanciesPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  const { region, occupation, invalid } = parseFilters(params.filters);

  if (invalid) {
    return {
      title: 'Felaktig sökning - Jobbsiffror',
      description: 'Den sökning du gjorde var ogiltig. Försök igen.',
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true
        }
      }
    };
  }

  const title = buildPageTitle(region, occupation);
  const description = buildPageDescription(region, occupation);

  return {
    title: `${title} - Jobbsiffror`,
    description,
    openGraph: {
      title,
      description,
      type: 'website'
    }
  };
}

export async function generateStaticParams() {
  // Generate static pages for SEO-friendly routes using real data
  const staticParams: { filters?: string[] }[] = [];

  // Add root page (no filters)
  staticParams.push({ filters: undefined });

  // Add all regions
  const majorRegions = SWEDISH_REGIONS.slice(0, 10) // Limit to top 10 regions for performance
    .map((region) => ({ filters: [region.urlSlug] }));
  staticParams.push(...majorRegions);

  // Add popular occupations
  const popularOccupations = OCCUPATION_GROUPS.slice(0, 15) // Top 15 occupations for SEO
    .map((occupation) => ({ filters: [occupation.urlSlug] }));
  staticParams.push(...popularOccupations);

  // Add popular combinations (major regions + top occupations)
  const topRegions = SWEDISH_REGIONS.slice(0, 3); // Stockholm, Göteborg, Malmö areas
  const topOccupations = OCCUPATION_GROUPS.slice(0, 5); // Top 5 occupations

  const combinations = topRegions.flatMap((region) =>
    topOccupations.map((occupation) => ({
      filters: [region.urlSlug, occupation.urlSlug]
    }))
  );
  staticParams.push(...combinations);

  return staticParams;
}

// Helper functions
function buildPageTitle(region?: string, occupation?: string): string {
  if (region && occupation) {
    return `${capitalizeFirst(occupation)} jobb i ${capitalizeFirst(region)}`;
  } else if (region) {
    return `Lediga jobb i ${capitalizeFirst(region)}`;
  } else if (occupation) {
    return `${capitalizeFirst(occupation)} jobb i Sverige`;
  } else {
    return 'Sveriges jobbsiffror';
  }
}

function buildPageDescription(region?: string, occupation?: string): string {
  if (region && occupation) {
    return `Se statistik och trender för ${occupation} jobb i ${region}. Aktuella siffror och utveckling över tid.`;
  } else if (region) {
    return `Översikt av alla lediga jobb i ${region}. Statistik, trender och jobbmöjligheter.`;
  } else if (occupation) {
    return `Statistik för ${occupation} jobb i hela Sverige. Se trender och regionala skillnader.`;
  } else {
    return 'Komplett översikt av lediga jobb i Sverige. Statistik, trender och analys av arbetsmarknaden.';
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
