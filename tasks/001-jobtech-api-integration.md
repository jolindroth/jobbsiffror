# Task 001: Simplified JobTech API Integration

## Overview
Replace the hardcoded mock data in the dashboard with real Swedish job statistics from the JobTech Historical Vacancies API. Focus on monthly vacancy counts by occupation group and region for dashboard charts and statistics cards.

## Business Context
The dashboard currently shows mock e-commerce data (desktop/mobile visitors, revenue, etc.). We need to transform this into a Swedish job statistics dashboard that displays:
- Monthly job vacancy trends (time series)
- Vacancy distribution by occupation group
- Vacancy distribution by Swedish counties (län)
- Key statistics cards (total vacancies, trends, growth)

## Technical Requirements

### 1. Simplified Domain Model
Create minimal TypeScript interfaces for aggregated statistics:

```typescript
// Monthly aggregated statistics
interface MonthlyJobStats {
  month: string; // "2024-01" format
  total_vacancies: number;
  by_occupation_group: Record<string, number>; // occupation group ID -> count
  by_region: Record<string, number>; // region code -> count
}

// Dashboard summary metrics
interface JobStatsSummary {
  total_vacancies: number;
  month_over_month_change: number;
  most_active_region: string;
  most_active_occupation_group: string;
  last_updated: string;
}

// Chart data format (matches existing components)
interface ChartDataPoint {
  month: string;
  [key: string]: string | number; // dynamic keys for different occupation groups
}
```

### 2. API Service Layer
Create `src/services/jobtech-api.ts` with focused functions:

```typescript
// Core API functions
async function getMonthlyJobStats(
  startDate: string, // "2024-01"
  endDate: string,   // "2024-12"
  occupationGroups?: string[],
  regions?: string[]
): Promise<MonthlyJobStats[]>

async function getJobStatsSummary(
  dateRange: string // "12m" | "6m" | "3m"
): Promise<JobStatsSummary>

// Supporting functions
async function getOccupationGroups(): Promise<{id: string, name: string}[]>
async function getSwedishRegions(): Promise<{code: string, name: string}[]>
```

### 3. Data Transformation Layer
Create `src/lib/job-data-transformers.ts`:

```typescript
// Transform API responses to chart-compatible formats
function transformToAreaChartData(stats: MonthlyJobStats[]): ChartDataPoint[]
function transformToBarChartData(stats: MonthlyJobStats[]): ChartDataPoint[]
function transformToPieChartData(stats: MonthlyJobStats[]): PieChartData[]
```

### 4. Integration Points

#### Update Dashboard Components
Modify existing components to accept data via props:
- `src/features/overview/components/area-graph.tsx`
- `src/features/overview/components/bar-graph.tsx`
- `src/features/overview/components/pie-graph.tsx`
- `src/features/overview/components/recent-sales.tsx` → Transform to recent job postings

#### Update Parallel Routes
Replace hardcoded delays with real API calls:
- `src/app/dashboard/overview/@area_stats/page.tsx`
- `src/app/dashboard/overview/@bar_stats/page.tsx`
- `src/app/dashboard/overview/@pie_stats/page.tsx`
- `src/app/dashboard/overview/@sales/page.tsx`

#### Search Parameters
Extend `src/lib/searchparams.ts` with job-specific filters:
- `dateRange`: "12m" | "6m" | "3m" | "custom"
- `startDate`: ISO date string
- `endDate`: ISO date string
- `occupationGroups`: Array of occupation group IDs
- `regions`: Array of region codes

### 5. Static Data Integration
- Use `docs/occupation-groups.json` for occupation taxonomy
- Create Swedish region mapping (25 counties)
- Build lookup tables for concept IDs to human-readable names

## Architecture: RSC + Client Components Hybrid

### Replace Dashboard with SEO-Optimized Routes
**Replace** `/dashboard/overview` with `/vacancies/[...filters]`:

```
app/
├── vacancies/
│   └── [...filters]/
│       ├── page.tsx              # Main vacancy dashboard (RSC)
│       ├── loading.tsx           # Loading states
│       └── error.tsx             # Error boundary
└── dashboard/                    # Remove overview - migrate to vacancies
```

### URL Structure Examples
- `/vacancies` - All vacancies (default view)
- `/vacancies/stockholm` - Stockholm vacancies
- `/vacancies/stockholm/data-utvecklare` - Data developers in Stockholm
- `/vacancies/data-utvecklare` - All data developer vacancies

### Hybrid Component Architecture
Server Component handles data, Client Component handles interactivity:

```typescript
// app/vacancies/[...filters]/page.tsx (Server Component)
import { VacancyFilters } from '@/components/vacancy-filters';
import { VacancyDashboard } from '@/components/vacancy-dashboard';

export default async function VacanciesPage({ 
  params 
}: { 
  params: { filters: string[] } 
}) {
  const { region, occupationGroup, dateRange } = parseFilters(params.filters);
  
  // Fetch data server-side for SEO
  const vacancyStats = await getVacancyStatistics(region, occupationGroup, dateRange);
  
  return (
    <main>
      {/* Client Component for interactive filters */}
      <VacancyFilters currentFilters={params.filters} />
      
      {/* Server Component for dashboard */}
      <VacancyDashboard data={vacancyStats} />
    </main>
  );
}

// Generate SEO metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { filters: string[] } 
}): Promise<Metadata> {
  const { region, occupationGroup } = parseFilters(params.filters);
  
  return {
    title: `${occupationGroup} lediga jobb i ${region} - Jobbsiffror`,
    description: `Se statistik för ${occupationGroup} lediga jobb i ${region}. Trender och jobbmöjligheter.`
  };
}
```

### Client Component for Filters
```typescript
// components/vacancy-filters.tsx
'use client';

import { useRouter } from 'next/navigation';

export function VacancyFilters({ currentFilters }: { currentFilters: string[] }) {
  const router = useRouter();

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    const newUrl = buildFilterUrl(currentFilters, { startDate, endDate });
    router.push(newUrl); // Triggers server re-render
  };

  const handleMunicipalityChange = (municipality: string) => {
    const newUrl = buildFilterUrl(currentFilters, { municipality });
    router.push(newUrl); // Triggers server re-render
  };

  return (
    <div className="filters">
      <DateRangePicker onChange={handleDateRangeChange} />
      <MunicipalitySelect onChange={handleMunicipalityChange} />
    </div>
  );
}
```

## File Structure
```
src/
├── app/
│   ├── vacancies/
│   │   └── [...filters]/
│   │       ├── page.tsx          # Main vacancy dashboard (RSC)
│   │       ├── loading.tsx       # Loading states
│   │       └── error.tsx         # Error boundary
│   └── dashboard/                # Remove overview - migrate to vacancies
├── services/
│   └── jobtech-api.ts            # API service layer (direct RSC calls)
├── lib/
│   ├── vacancy-data-transformers.ts # Data transformation functions
│   ├── filter-parser.ts          # Parse URL filters
│   └── filter-url-builder.ts     # Build URLs from filters
├── types/
│   └── vacancy-statistics.ts     # Simple statistics types
├── constants/
│   ├── occupation-groups.ts      # Occupation group mappings
│   └── swedish-regions.ts        # Swedish county mappings
├── components/
│   ├── vacancy-filters.tsx       # Client component for filters
│   ├── vacancy-dashboard.tsx     # Shared dashboard component
│   └── charts/                   # Extracted chart components
│       ├── area-chart.tsx        # Moved from features/overview
│       ├── bar-chart.tsx         # Moved from features/overview
│       └── pie-chart.tsx         # Moved from features/overview
```

## Implementation Steps

### Phase 1: Dashboard Migration
1. **Move existing dashboard components** from `src/features/overview/components/` to `src/components/charts/`
2. **Create new route structure** `app/vacancies/[...filters]/page.tsx`
3. **Extract dashboard logic** into reusable `VacancyDashboard` component
4. **Remove parallel routes** from `/dashboard/overview`

### Phase 2: RSC + Client Components Setup
1. **Create `VacancyFilters` client component** for interactive filters
2. **Implement filter URL parsing** and building logic
3. **Add RSC data fetching** in main page component
4. **Connect client filters to URL navigation**

### Phase 3: API Service Integration
1. **Create `jobtech-api.ts`** with direct fetch calls (no API routes)
2. **Add caching with `next.cache`** for server-side performance
3. **Create transformation functions** for chart data
4. **Add error handling and retry logic**

### Phase 4: SEO & Static Generation
1. **Implement `generateStaticParams`** for popular combinations
2. **Add dynamic metadata generation** for each filter combination
3. **Create breadcrumb navigation** for SEO
4. **Add structured data** for search engines

## Data Fetching Strategy

### Direct RSC to External API
**No API Routes Required** - Server Components call external API directly:

```typescript
// app/vacancies/[...filters]/page.tsx
import { getVacancyStatistics } from '@/services/jobtech-api';

export default async function VacanciesPage({ params }: { params: { filters: string[] } }) {
  // Direct API call in RSC - server-side only
  const vacancyStats = await getVacancyStatistics(params.filters);
  
  return (
    <main>
      <VacancyFilters currentFilters={params.filters} />
      <VacancyDashboard data={vacancyStats} />
    </main>
  );
}
```

### Caching Strategy
```typescript
// services/jobtech-api.ts
export async function getVacancyStatistics(filters: string[]) {
  const { region, occupationGroup, dateRange } = parseFilters(filters);
  
  // Built-in Next.js caching
  const response = await fetch(`https://historical.api.jobtechdev.se/search`, {
    next: { revalidate: 3600 } // 1 hour cache
  });
  
  return transformToChartData(response);
}
```

### Component Migration Strategy
1. **Extract existing components** from `/features/overview/components/` 
2. **Move to shared location** `/components/charts/`
3. **Create wrapper dashboard** component that accepts data props
4. **Remove parallel routes** - single unified page

## Default Data Strategy
- **Root page (`/vacancies`)**: SSG with last 12 months data
- **Filtered pages**: SSR with 1-hour cache
- **Popular combinations**: Pre-generated with `generateStaticParams`
- **URL-based state**: No client-side state management needed

## Acceptance Criteria

### Functional Requirements
1. **Vacancy Dashboard**: Display real monthly vacancy data with interactive charts
2. **Statistics Cards**: Show total vacancies, growth trends, top regions/occupations
3. **Default View**: `/vacancies` loads last 12 months of data (SSG)
4. **SEO URLs**: Each region/occupation combination has unique URL (e.g., `/vacancies/stockholm/data-utvecklare`)
5. **Interactive Filters**: Date pickers and municipality selectors update URL
6. **Performance**: Initial page load under 2 seconds
7. **Swedish Language**: All labels and text in Swedish

### Technical Requirements
1. **Type Safety**: All API responses properly typed with TypeScript
2. **RSC Architecture**: Server Components for data fetching, Client Components for interactivity
3. **URL-based State**: All filter state lives in URL parameters (no client state)
4. **Error Handling**: Graceful handling of API failures and rate limits
5. **Caching**: Next.js built-in caching (1-hour revalidation)
6. **Component Migration**: Successfully move from parallel routes to single unified page

### Data Requirements
1. **Monthly Granularity**: Monthly vacancy statistics (extensible to weekly)
2. **Occupation Groups**: Use high-level groups from JSON file
3. **Swedish Counties**: Use 25 Swedish counties (län)  
4. **Accurate Data**: Real JobTech API data, not mock data
5. **Default Range**: Last 12 months of vacancy data for root page

## Dependencies
- Existing: `@tanstack/react-query`, `zod`, `nuqs`, `recharts`
- New: None required - use existing tech stack

## Estimated Effort
- **Dashboard Migration**: 8 hours (move components, create new routes)
- **RSC + Client Components**: 6 hours (filter components, URL handling)
- **API Service**: 4 hours (direct RSC calls, caching)
- **Data Transformation**: 2 hours (adapt existing chart data format)
- **Total**: 20 hours (~3 days)

## Success Metrics
- `/vacancies` shows real Swedish vacancy data in dashboard format
- Monthly trends accurately reflect JobTech API data
- SEO-friendly URLs for each region/occupation combination
- Smooth URL-based filtering without full page reloads
- Page load performance maintained (under 2 seconds)
- Zero runtime type errors
- Successful migration from parallel routes to unified page