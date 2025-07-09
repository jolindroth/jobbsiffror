# Task 004: Create Dynamic Vacancies Route ✅ COMPLETED

## Goal

Create dynamic vacancies route with filtering capabilities for SEO-friendly vacancy pages, compatible with Next.js 15.

## What Was Built

- Dynamic vacancies route at `/dashboard/vacancies/[[...filters]]/`
- URL parsing for filters (region/occupation) via filter-parser.ts
- SEO metadata generation and static params
- Complete data fetching and chart integration

## Status: ✅ COMPLETED

**Remaining**: Fix generateStaticParams to use real region/occupation slugs instead of hardcoded values.

## Steps

### 1. Rename and Move Route Files

**From**: `src/app/dashboard/overview/`
**To**: `src/app/vacancies/[[...filters]]/`

Move these files:

- `page.tsx` → `src/app/vacancies/[[...filters]]/page.tsx`
- `error.tsx` → `src/app/vacancies/[[...filters]]/error.tsx`

Create these additional files:

- `loading.tsx` - Loading state
- `not-found.tsx` - 404 page

### 2. Create Filter Parser

**File**: `src/lib/filter-parser.ts`

```typescript
import { validateRegion, validateOccupation } from '@/lib/taxonomy-mappings';

export interface ParsedFilters {
  region?: string;
  occupation?: string;
}

export function parseFilters(filters: string[] | undefined): ParsedFilters {
  const result: ParsedFilters = {};

  if (!filters || filters.length === 0) {
    return result;
  }

  // URL patterns:
  // /vacancies/stockholm → region only
  // /vacancies/systemutvecklare → occupation only
  // /vacancies/stockholm/systemutvecklare → both

  if (filters.length === 1) {
    const filter = filters[0];

    // Check if it's a region or occupation using our validation functions
    if (validateRegion(filter)) {
      result.region = filter;
    } else if (validateOccupation(filter)) {
      result.occupation = filter;
    }
  } else if (filters.length === 2) {
    // Assume first is region, second is occupation
    const [possibleRegion, possibleOccupation] = filters;

    if (validateRegion(possibleRegion)) {
      result.region = possibleRegion;
    }

    if (validateOccupation(possibleOccupation)) {
      result.occupation = possibleOccupation;
    }
  }

  return result;
}
```

### 3. Update Main Page Component

**File**: `src/app/vacancies/[[...filters]]/page.tsx` (moved from dashboard)

**Changes to make to the existing dashboard page**:

1. **Update interface** to handle both params and searchParams:

```typescript
interface VacanciesPageProps {
  params: Promise<{ filters?: string[] }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}
```

2. **Add filter parsing** at the start of the component:

```typescript
export default async function VacanciesPage({
  params: paramsPromise,
  searchParams: searchParamsPromise
}: VacanciesPageProps) {
  // Await params and searchParams for Next.js 15 compatibility
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  const { region, occupation } = parseFilters(params.filters);

  // Validate filters
  if (region && !validateRegion(region)) {
    notFound();
  }

  if (occupation && !validateOccupation(occupation)) {
    notFound();
  }

  // Get date range from search params or use defaults (last 12 months)
  const dateFrom = searchParams.from || getDefaultFromDate();
  const dateTo = searchParams.to || getDefaultToDate();

  // Pass region and occupation to existing GetVacancies call
  const dashboardData = await GetVacancies(dateFrom, dateTo, region, occupation);

  // Rest of the existing code stays the same...
```

3. **Update page title** to be dynamic:

```typescript
<h2 className='text-2xl font-bold tracking-tight'>
  {buildPageTitle(region, occupation)}
</h2>
```

4. **Add imports** at the top:

```typescript
import { notFound } from 'next/navigation';
import { parseFilters } from '@/lib/filter-parser';
import { validateRegion, validateOccupation } from '@/lib/taxonomy-mappings';
```

5. **Add helper functions** at the bottom:

```typescript
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

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

**Note**: Keep ALL existing data fetching, chart components, and styling exactly as they are. Only add the filtering logic on top.

### 4. Create Loading Component

**File**: `src/app/vacancies/[[...filters]]/loading.tsx`

```typescript
import { Skeleton } from '@/components/ui/skeleton';
import PageContainer from '@/components/layout/page-container';

export default function Loading() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="mb-8">
          <Skeleton className="h-10 w-96 mb-2" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="col-span-4 md:col-span-3">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="col-span-4">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="col-span-4 md:col-span-3">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
```

### 5. Move Error Component

**File**: `src/app/vacancies/[[...filters]]/error.tsx` (moved from dashboard)

**Update the existing dashboard error.tsx file**:

```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Vacancy page error:', error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Kunde inte ladda data
        </h2>
        <p className="text-muted-foreground">
          Ett fel uppstod när jobbstatistiken skulle hämtas. Försök igen senare.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            Försök igen
          </Button>
          <Button variant="outline" asChild>
            <a href="/vacancies">Tillbaka till översikt</a>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
```

### 6. Create Not Found Component

**File**: `src/app/vacancies/[[...filters]]/not-found.tsx`

```typescript
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';

export default function NotFound() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Sida hittades inte
        </h2>
        <p className="text-muted-foreground">
          Den region eller yrkesgrupp du söker efter finns inte i vårt system.
        </p>
        <Button asChild>
          <a href="/vacancies">Tillbaka till översikt</a>
        </Button>
      </div>
    </PageContainer>
  );
}
```

### 7. Add SEO Metadata Generation

**Add to**: `src/app/vacancies/[[...filters]]/page.tsx`

```typescript
export async function generateMetadata({
  params: paramsPromise
}: VacanciesPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  const { region, occupation } = parseFilters(params.filters);

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
```

### 8. Add Static Generation for Popular Routes

**Add to**: `src/app/vacancies/[[...filters]]/page.tsx`

```typescript
export async function generateStaticParams() {
  // Generate static pages for popular combinations
  // Note: with optional catch-all routes, empty filters is handled automatically
  const popularCombinations = [
    { filters: ['stockholm'] },
    { filters: ['goteborg'] },
    { filters: ['malmo'] },
    { filters: ['systemutvecklare'] },
    { filters: ['sjukskoterska'] },
    { filters: ['stockholm', 'systemutvecklare'] },
    { filters: ['goteborg', 'systemutvecklare'] },
    { filters: ['stockholm', 'sjukskoterska'] }
  ];

  return popularCombinations;
}
```

### 9. Remove Dashboard Navigation

**Update**: Remove dashboard from navigation and routing

1. **Update main navigation** in `src/constants/data.ts`:

   - Remove or update dashboard links to point to `/vacancies`
   - Update any menu items that reference the dashboard

2. **Update root redirect** in `src/app/page.tsx`:

   - Change redirect from `/dashboard` to `/vacancies`

3. **Remove dashboard layout** (optional):
   - If the dashboard layout is no longer needed, remove `/src/app/dashboard/layout.tsx`
   - Or update it to redirect to vacancies

## Acceptance Criteria

- [ ] Dashboard files successfully moved to `/vacancies/[[...filters]]/`
- [ ] `/vacancies` shows all vacancies (no filters)
- [ ] `/vacancies/stockholm` shows Stockholm vacancies
- [ ] `/vacancies/systemutvecklare` shows systemutvecklare vacancies
- [ ] `/vacancies/stockholm/systemutvecklare` shows both filters
- [ ] Invalid regions/occupations show 404 page
- [ ] SEO metadata generated for each filter combination
- [ ] Popular routes are statically generated
- [ ] Loading and error states work correctly
- [ ] All existing dashboard functionality preserved
- [ ] No broken links or imports after the move

## Files Moved/Created

**Moved Files:**

- `src/app/dashboard/overview/page.tsx` → `src/app/vacancies/[[...filters]]/page.tsx`
- `src/app/dashboard/overview/error.tsx` → `src/app/vacancies/[[...filters]]/error.tsx`

**Created Files:**

- `src/app/vacancies/[[...filters]]/loading.tsx`
- `src/app/vacancies/[[...filters]]/not-found.tsx`
- `src/lib/filter-parser.ts`

**Updated Files:**

- `src/constants/data.ts` (navigation updates)
- `src/app/page.tsx` (redirect updates)

## Next Steps

After this task:

- Task 005 will add client filter components for interactivity
- All existing dashboard functionality will work at the new `/vacancies/` routes
- SEO-optimized URLs will be fully functional with Next.js 15 compatibility
- Date range filtering via searchParams will be supported
- The dashboard concept will be eliminated in favor of public vacancy routes
