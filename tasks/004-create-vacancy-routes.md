# Task 004: Create Vacancy Routes Structure

## Goal
Build the new URL structure with dynamic routes for SEO-friendly vacancy pages using React Server Components.

## What You'll Build
- `/vacancies/[...filters]/page.tsx` - Dynamic routes for all filter combinations
- URL filter parsing logic
- SEO metadata generation
- Integration with VacancyDashboard component

## Steps

### 1. Create Route Structure
**Directory**: `src/app/vacancies/[...filters]/`

Create these files:
- `page.tsx` - Main page component (RSC)
- `loading.tsx` - Loading state
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page

### 2. Create Filter Parser
**File**: `src/lib/filter-parser.ts`
```typescript
export interface ParsedFilters {
  region?: string;
  occupation?: string;
  dateRange?: string;
}

export function parseFilters(filters: string[]): ParsedFilters {
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
    
    // Check if it's a region or occupation
    if (isValidRegion(filter)) {
      result.region = filter;
    } else if (isValidOccupation(filter)) {
      result.occupation = filter;
    }
  } else if (filters.length === 2) {
    // Assume first is region, second is occupation
    const [possibleRegion, possibleOccupation] = filters;
    
    if (isValidRegion(possibleRegion)) {
      result.region = possibleRegion;
    }
    
    if (isValidOccupation(possibleOccupation)) {
      result.occupation = possibleOccupation;
    }
  }
  
  return result;
}

export function buildFilterUrl(filters: ParsedFilters): string {
  const segments: string[] = [];
  
  if (filters.region) {
    segments.push(filters.region);
  }
  
  if (filters.occupation) {
    segments.push(filters.occupation);
  }
  
  return `/vacancies${segments.length > 0 ? '/' + segments.join('/') : ''}`;
}

// Import validation functions from taxonomy mappings
function isValidRegion(slug: string): boolean {
  // Import from taxonomy mappings
  return true; // Placeholder
}

function isValidOccupation(slug: string): boolean {
  // Import from taxonomy mappings
  return true; // Placeholder
}
```

### 3. Create Main Page Component
**File**: `src/app/vacancies/[...filters]/page.tsx`
```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VacancyDashboard } from '@/components/vacancy-dashboard';
import { VacancyFilters } from '@/components/vacancy-filters';
import { GetVacancies } from '@/services/jobtech-api';
import { parseFilters, buildFilterUrl } from '@/lib/filter-parser';
import { validateRegion, validateOccupation } from '@/lib/taxonomy-mappings';

interface VacanciesPageProps {
  params: { filters: string[] };
}

export default async function VacanciesPage({ params }: VacanciesPageProps) {
  const { region, occupation } = parseFilters(params.filters);
  
  // Validate filters
  if (region && !validateRegion(region)) {
    notFound();
  }
  
  if (occupation && !validateOccupation(occupation)) {
    notFound();
  }
  
  // Get last 12 months of time series data for the current filters
  const currentDate = new Date();
  const timeSeriesData = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    try {
      const monthData = await GetVacancies(month, region, occupation);
      timeSeriesData.push(monthData); // Single VacancyRecord per month
    } catch (error) {
      console.error(`Failed to fetch data for ${month}:`, error);
      // Continue with other months
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {buildPageTitle(region, occupation)}
        </h1>
        <p className="text-muted-foreground">
          {buildPageDescription(region, occupation)}
        </p>
      </div>
      
      <VacancyFilters 
        currentRegion={region}
        currentOccupation={occupation}
      />
      
      <VacancyDashboard 
        timeSeriesData={timeSeriesData}
        region={region}
        occupation={occupation}
      />
    </div>
  );
}

export async function generateMetadata({ params }: VacanciesPageProps): Promise<Metadata> {
  const { region, occupation } = parseFilters(params.filters);
  
  const title = buildPageTitle(region, occupation);
  const description = buildPageDescription(region, occupation);
  
  return {
    title: `${title} - Jobbsiffror`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
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
    return 'Lediga jobb i Sverige';
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
```

### 4. Create Loading Component
**File**: `src/app/vacancies/[...filters]/loading.tsx`
```typescript
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-96 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Filters skeleton */}
      <div className="mb-8 flex gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Create Error Component
**File**: `src/app/vacancies/[...filters]/error.tsx`
```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Vacancy page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Något gick fel</h2>
      <p className="text-muted-foreground mb-6">
        Vi kunde inte hämta jobbstatistiken. Försök igen eller kontakta support om problemet kvarstår.
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
  );
}
```

### 6. Create Not Found Component
**File**: `src/app/vacancies/[...filters]/not-found.tsx`
```typescript
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Sida hittades inte</h2>
      <p className="text-muted-foreground mb-6">
        Den region eller yrkesgrupp du söker efter finns inte i vårt system.
      </p>
      <Button asChild>
        <a href="/vacancies">Tillbaka till översikt</a>
      </Button>
    </div>
  );
}
```

### 7. Add Static Generation for Popular Routes
**File**: `src/app/vacancies/[...filters]/page.tsx` (add to existing file)
```typescript
export async function generateStaticParams() {
  // Generate static pages for popular combinations
  const popularCombinations = [
    { filters: [] }, // Root page
    { filters: ['stockholm'] },
    { filters: ['goteborg'] },
    { filters: ['malmo'] },
    { filters: ['systemutvecklare'] },
    { filters: ['sjukskoterska'] },
    { filters: ['stockholm', 'systemutvecklare'] },
    { filters: ['goteborg', 'systemutvecklare'] },
    { filters: ['stockholm', 'sjukskoterska'] },
  ];

  return popularCombinations;
}
```

### 8. Update Root Vacancies Page
**File**: `src/app/vacancies/page.tsx`
```typescript
import { redirect } from 'next/navigation';

export default function VacanciesRootPage() {
  // Redirect to the catch-all route with no filters
  redirect('/vacancies/');
}
```

### 9. Add Breadcrumb Navigation
**File**: `src/components/vacancy-breadcrumbs.tsx`
```typescript
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface VacancyBreadcrumbsProps {
  region?: string;
  occupation?: string;
}

export function VacancyBreadcrumbs({ region, occupation }: VacancyBreadcrumbsProps) {
  const breadcrumbs = [
    { name: 'Hem', href: '/' },
    { name: 'Lediga Jobb', href: '/vacancies' },
  ];

  if (region) {
    breadcrumbs.push({
      name: capitalizeFirst(region),
      href: `/vacancies/${region}`,
    });
  }

  if (occupation) {
    breadcrumbs.push({
      name: capitalizeFirst(occupation),
      href: region ? `/vacancies/${region}/${occupation}` : `/vacancies/${occupation}`,
    });
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-muted-foreground">{breadcrumb.name}</span>
            ) : (
              <Link 
                href={breadcrumb.href}
                className="text-primary hover:text-primary/80"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

## Acceptance Criteria
- [ ] `/vacancies` shows all vacancies (no filters)
- [ ] `/vacancies/stockholm` shows Stockholm vacancies
- [ ] `/vacancies/systemutvecklare` shows systemutvecklare vacancies
- [ ] `/vacancies/stockholm/systemutvecklare` shows both filters
- [ ] Invalid regions/occupations show 404 page
- [ ] SEO metadata generated for each filter combination
- [ ] Popular routes are statically generated
- [ ] Loading and error states work correctly
- [ ] Breadcrumb navigation shows current location

## Files Created
- `src/app/vacancies/[...filters]/page.tsx`
- `src/app/vacancies/[...filters]/loading.tsx`
- `src/app/vacancies/[...filters]/error.tsx`
- `src/app/vacancies/[...filters]/not-found.tsx`
- `src/app/vacancies/page.tsx`
- `src/lib/filter-parser.ts`
- `src/components/vacancy-breadcrumbs.tsx`

## Next Steps
After this task:
- Task 005 will build client filter components for interactivity
- Routes will be ready to display real vacancy data
- SEO-optimized URLs will be fully functional