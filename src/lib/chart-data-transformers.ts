import { VacancyRecord } from '@/types/vacancy-record';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

// Transform VacancyRecord[] to area chart format (time series)
export function transformToAreaChart(records: VacancyRecord[]): Array<{
  month: string;
  total: number;
  displayMonth: string;
}> {
  return records
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((record) => ({
      month: record.month,
      total: record.count,
      displayMonth: format(new Date(record.month + '-01'), 'MMM yyyy', {
        locale: sv
      })
    }));
}

// Transform VacancyRecord[] to bar chart format (category comparison)
export function transformToBarChart(
  records: VacancyRecord[],
  type: 'region' | 'occupation'
): Array<{
  category: string;
  count: number;
  displayName: string;
}> {
  // Group by the specified dimension
  const grouped = records.reduce(
    (acc, record) => {
      const key = type === 'region' ? record.region : record.occupation;

      // Skip only if the key is explicitly 'all' or empty/null
      if (!key || key === 'all') return acc;

      if (!acc[key]) {
        acc[key] = {
          category: key,
          count: 0,
          displayName: capitalizeFirst(key)
        };
      }
      acc[key].count += record.count;
      return acc;
    },
    {} as Record<
      string,
      { category: string; count: number; displayName: string }
    >
  );

  return Object.values(grouped)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10
}

// Transform VacancyRecord[] to pie chart format
export function transformToPieChart(
  records: VacancyRecord[],
  type: 'region' | 'occupation'
): Array<{
  category: string;
  count: number;
  displayName: string;
  fill: string;
}> {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return transformToBarChart(records, type)
    .slice(0, 5) // Top 5 for pie chart
    .map((item, index) => ({
      ...item,
      fill: colors[index % colors.length]
    }));
}

// Calculate summary statistics from vacancy records
export function calculateSummaryStats(records: VacancyRecord[]): {
  totalVacancies: number;
  monthOverMonthChange: number;
  mostActiveRegion: string;
  mostActiveOccupation: string;
  lastUpdated: string;
} {
  const totalVacancies = records.reduce((sum, record) => sum + record.count, 0);

  // Calculate month-over-month change (comparing last 2 months)
  // Group records by month to get monthly totals
  const monthlyTotals = records.reduce(
    (acc, record) => {
      acc[record.month] = (acc[record.month] || 0) + record.count;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedMonths = Object.keys(monthlyTotals).sort();
  const latestMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];

  const monthOverMonthChange =
    latestMonth && previousMonth
      ? ((monthlyTotals[latestMonth] - monthlyTotals[previousMonth]) /
          monthlyTotals[previousMonth]) *
        100
      : 0;

  // Find most active region and occupation
  const regionCounts = new Map<string, number>();
  const occupationCounts = new Map<string, number>();

  records.forEach((record) => {
    // Only count regions/occupations that are not 'all' and not empty
    if (record.region && record.region !== 'all') {
      regionCounts.set(
        record.region,
        (regionCounts.get(record.region) || 0) + record.count
      );
    }
    if (record.occupation && record.occupation !== 'all') {
      occupationCounts.set(
        record.occupation,
        (occupationCounts.get(record.occupation) || 0) + record.count
      );
    }
  });

  const mostActiveRegion = findMostActive(regionCounts);
  const mostActiveOccupation = findMostActive(occupationCounts);

  return {
    totalVacancies,
    monthOverMonthChange,
    mostActiveRegion,
    mostActiveOccupation,
    lastUpdated: new Date().toLocaleDateString('sv-SE')
  };
}

// Helper functions
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function findMostActive(counts: Map<string, number>): string {
  let maxCount = 0;
  let mostActive = '';

  counts.forEach((count, key) => {
    if (count > maxCount) {
      maxCount = count;
      mostActive = key;
    }
  });

  return capitalizeFirst(mostActive);
}

// Re-export map transformation functions for easy access
export {
  transformToMapChart,
  aggregateRegionalData,
  calculateColorIntensity,
  getLeafletStyle,
  getLeafletHoverStyle
} from './map-data-transformers';
