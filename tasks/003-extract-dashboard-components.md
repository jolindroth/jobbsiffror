# Task 003: Extract Dashboard Components

## Goal
Move existing dashboard components from the parallel routes structure to shared, reusable components that can accept data via props.

## What You'll Build
- Reusable chart components in `components/charts/`
- A unified `VacancyDashboard` component
- Updated component interfaces to accept data props

## Steps

### 1. Move Chart Components
Move these files from `src/features/overview/components/` to `src/components/charts/`:

**Move Files:**
- `area-graph.tsx` → `src/components/charts/area-chart.tsx`
- `bar-graph.tsx` → `src/components/charts/bar-chart.tsx`  
- `pie-graph.tsx` → `src/components/charts/pie-chart.tsx`
- `recent-sales.tsx` → `src/components/charts/recent-postings.tsx`

**Update each component to:**
1. Remove hardcoded mock data
2. Accept data via props
3. Update import paths
4. Keep same chart configuration and styling

### 2. Update Area Chart Component
**File**: `src/components/charts/area-chart.tsx`
```typescript
interface AreaChartProps {
  data: Array<{
    month: string;
    [key: string]: string | number; // Dynamic occupation groups
  }>;
  title?: string;
  description?: string;
}

export function AreaChart({ data, title, description }: AreaChartProps) {
  // Remove hardcoded chartData
  // Use props.data instead
  // Keep existing ChartConfig and chart rendering logic
}
```

### 3. Update Bar Chart Component  
**File**: `src/components/charts/bar-chart.tsx`
```typescript
interface BarChartProps {
  data: Array<{
    category: string;
    count: number;
  }>;
  title?: string;
  description?: string;
}

export function BarChart({ data, title, description }: BarChartProps) {
  // Remove hardcoded chartData
  // Use props.data instead
  // Update chart configuration for vacancy data
}
```

### 4. Update Pie Chart Component
**File**: `src/components/charts/pie-chart.tsx`
```typescript
interface PieChartProps {
  data: Array<{
    category: string;
    count: number;
    fill: string;
  }>;
  title?: string;
  description?: string;
}

export function PieChart({ data, title, description }: PieChartProps) {
  // Remove hardcoded chartData
  // Use props.data instead
  // Generate colors for categories dynamically
}
```

### 5. Create Recent Postings Component
**File**: `src/components/charts/recent-postings.tsx`
```typescript
interface RecentPostingsProps {
  data: Array<{
    company: string;
    title: string;
    location: string;
    posted_date: string;
    logo?: string;
  }>;
}

export function RecentPostings({ data }: RecentPostingsProps) {
  // Replace recent sales logic with recent job postings
  // Use similar layout but with job-relevant information
  // Show company name, job title, location, date posted
}
```

### 6. Create Data Transformation Utilities
**File**: `src/lib/chart-data-transformers.ts`
```typescript
import { VacancyRecord } from '@/types/vacancy-record';

// Transform VacancyRecord[] to area chart format (time series)
export function transformToAreaChart(records: VacancyRecord[]): Array<{
  month: string;
  [key: string]: string | number;
}> {
  // For area charts, we typically get multiple months with same filters
  // Each record represents one month's total for specific region/occupation
  const result = records
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(record => ({
      month: record.month,
      total: record.count
    }));
  
  return result;
}

// Transform VacancyRecord[] to bar chart format (category comparison)  
export function transformToBarChart(records: VacancyRecord[]): Array<{
  category: string;
  count: number;
}> {
  // For bar charts, we get records with different regions or occupations
  // Group by the non-'all' dimension
  return records
    .filter(record => record.region !== 'all' || record.occupation !== 'all')
    .map(record => ({
      category: record.region !== 'all' ? record.region : record.occupation,
      count: record.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10
}

// Transform VacancyRecord[] to pie chart format
export function transformToPieChart(records: VacancyRecord[]): Array<{
  category: string;
  count: number;
  fill: string;
}> {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];
  
  return transformToBarChart(records)
    .slice(0, 5) // Top 5 for pie chart
    .map((item, index) => ({
      ...item,
      fill: colors[index % colors.length]
    }));
}
```

### 7. Create Unified Dashboard Component  
**File**: `src/components/vacancy-dashboard.tsx`
```typescript
import { VacancyRecord } from '@/types/vacancy-record';
import { AreaChart } from './charts/area-chart';
import { BarChart } from './charts/bar-chart';
import { PieChart } from './charts/pie-chart';
import { RecentPostings } from './charts/recent-postings';
import { 
  transformToAreaChart, 
  transformToBarChart, 
  transformToPieChart 
} from '@/lib/chart-data-transformers';

interface VacancyDashboardProps {
  timeSeriesData: VacancyRecord[]; // Array from multiple months
  region?: string;
  occupation?: string;
}

export function VacancyDashboard({ timeSeriesData, region, occupation }: VacancyDashboardProps) {
  // Calculate summary statistics from time series data
  const latestMonthData = timeSeriesData[timeSeriesData.length - 1];
  const totalVacancies = latestMonthData?.count || 0;
  const monthOverMonthChange = calculateMonthOverMonth(timeSeriesData);
  
  // Transform data for charts
  const areaChartData = transformToAreaChart(timeSeriesData);
  
  // Note: For bar/pie charts showing comparisons (regions/occupations),
  // the parent component will need to make additional API calls
  // This component focuses on time series visualization
  
  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Totala Lediga Jobb"
          value={totalVacancies.toLocaleString('sv-SE')}
          change={monthOverMonthChange}
        />
        <StatCard 
          title="Mest Aktiva Region"
          value={mostActiveRegion}
        />
        <StatCard 
          title="Mest Aktiva Yrke"
          value={mostActiveOccupation}
        />
        <StatCard 
          title="Senaste Uppdatering"
          value={new Date().toLocaleDateString('sv-SE')}
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChart 
          data={areaChartData}
          title="Lediga Jobb Över Tid"
          description="Månadsvis trend av lediga jobb"
        />
        <BarChart 
          data={barChartData}
          title={region ? "Jobb per Yrke" : "Jobb per Region"}
          description="Fördelning av lediga jobb"
        />
        <PieChart 
          data={pieChartData}
          title="Fördelning av Jobb"
          description="Procentuell fördelning"
        />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Senaste Jobbannonser</h3>
          <RecentPostings data={getRecentPostings()} />
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateMonthOverMonth(data: VacancyRecord[]): number {
  // Calculate month-over-month change percentage
  // Return 0 for now, implement proper calculation
  return 0;
}

function findMostActive(data: VacancyRecord[], field: 'region' | 'occupation'): string {
  const counts = new Map<string, number>();
  for (const record of data) {
    const key = record[field];
    counts.set(key, (counts.get(key) || 0) + record.count);
  }
  
  let maxCount = 0;
  let mostActive = '';
  for (const [key, count] of counts) {
    if (count > maxCount && key !== 'all') {
      maxCount = count;
      mostActive = key;
    }
  }
  
  return mostActive;
}

function getRecentPostings() {
  // For now return mock data, later integrate with real API
  return [
    {
      company: "Spotify",
      title: "Senior Utvecklare", 
      location: "Stockholm",
      posted_date: "2024-01-15"
    }
  ];
}
```

### 8. Create Stat Card Component
**File**: `src/components/stat-card.tsx`
```typescript
interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground">
            {change > 0 ? '+' : ''}{change}% från förra månaden
          </p>
        )}
      </div>
    </div>
  );
}
```

### 9. Update Import/Export Structure
**File**: `src/components/charts/index.ts`
```typescript
export { AreaChart } from './area-chart';
export { BarChart } from './bar-chart'; 
export { PieChart } from './pie-chart';
export { RecentPostings } from './recent-postings';
```

**File**: `src/components/index.ts`
```typescript
export { VacancyDashboard } from './vacancy-dashboard';
export { StatCard } from './stat-card';
export * from './charts';
```

## Acceptance Criteria
- [ ] All chart components moved from features/overview to components/charts
- [ ] Components accept data via props instead of using hardcoded data
- [ ] VacancyDashboard component renders all charts with real data
- [ ] Chart transformers convert VacancyRecord[] to correct chart formats
- [ ] Statistics cards show calculated values from data
- [ ] Swedish labels and text throughout components
- [ ] Components maintain existing styling and responsiveness

## Files Created/Moved
- `src/components/charts/area-chart.tsx` (moved)
- `src/components/charts/bar-chart.tsx` (moved)
- `src/components/charts/pie-chart.tsx` (moved)
- `src/components/charts/recent-postings.tsx` (moved)
- `src/components/charts/index.ts` (new)
- `src/components/vacancy-dashboard.tsx` (new)
- `src/components/stat-card.tsx` (new)
- `src/components/index.ts` (new)
- `src/lib/chart-data-transformers.ts` (new)

## Next Steps
After this task:
- Task 004 will create the URL routing structure
- Task 005 will build client filter components
- Components will be ready to integrate with real vacancy data