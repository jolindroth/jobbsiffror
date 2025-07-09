# Task 005: Build Client Filter Components

## Goal

Create interactive filter components that allow users to change date ranges, regions, and occupations by updating the URL (which triggers server re-renders).

## What You'll Build

- `VacancyFilters` client component with date pickers and selectors
- URL-based state management (no client state)
- Smooth navigation between filter combinations

## Steps

### 1. Create Main Filter Component

**File**: `src/components/vacancy-filters.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CalendarDays, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangePicker } from './date-range-picker';
import { buildFilterUrl } from '@/lib/filter-parser';

interface VacancyFiltersProps {
  currentRegion?: string;
  currentOccupation?: string;
}

export function VacancyFilters({ currentRegion, currentOccupation }: VacancyFiltersProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleRegionChange = (newRegion: string) => {
    setIsNavigating(true);
    const url = buildFilterUrl({
      region: newRegion === 'all' ? undefined : newRegion,
      occupation: currentOccupation
    });
    router.push(url);
  };

  const handleOccupationChange = (newOccupation: string) => {
    setIsNavigating(true);
    const url = buildFilterUrl({
      region: currentRegion,
      occupation: newOccupation === 'all' ? undefined : newOccupation
    });
    router.push(url);
  };

  const handleClearFilters = () => {
    setIsNavigating(true);
    router.push('/vacancies');
  };

  return (
    <div className="relative">
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Region Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Region
              </label>
              <RegionSelect
                value={currentRegion || 'all'}
                onValueChange={handleRegionChange}
                disabled={isNavigating}
              />
            </div>

            {/* Occupation Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Yrkesgrupp
              </label>
              <OccupationSelect
                value={currentOccupation || 'all'}
                onValueChange={handleOccupationChange}
                disabled={isNavigating}
              />
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <DateRangePicker
                from={searchParams.from ? new Date(searchParams.from) : undefined}
                to={searchParams.to ? new Date(searchParams.to) : undefined}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {(currentRegion || currentOccupation || searchParams.from || searchParams.to) && (
              <Button
                variant="outline"
                onClick={() => {
                  handleClearFilters();
                  setSearchParams({ from: null, to: null });
                }}
                disabled={isNavigating}
              >
                Rensa filter
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(currentRegion || currentOccupation || searchParams.from || searchParams.to) && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Aktiva filter:</span>
              {currentRegion && (
                <FilterTag
                  label={capitalizeFirst(currentRegion)}
                  onRemove={() => handleRegionChange('all')}
                />
              )}
              {currentOccupation && (
                <FilterTag
                  label={capitalizeFirst(currentOccupation)}
                  onRemove={() => handleOccupationChange('all')}
                />
              )}
              {(searchParams.from || searchParams.to) && (
                <FilterTag
                  label="Datumfilter"
                  onRemove={() => setSearchParams({ from: null, to: null })}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            Laddar...
          </div>
        </div>
      )}
    </div>
  );
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

### 2. Create Region Select Component

**File**: `src/components/region-select.tsx`

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SWEDISH_REGIONS } from '@/constants/swedish-regions';

interface RegionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RegionSelect({ value, onValueChange, disabled }: RegionSelectProps) {
  // Sort regions alphabetically
  const sortedRegions = SWEDISH_REGIONS
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'));

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Välj region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Alla regioner</SelectItem>

        {sortedRegions.map((region) => (
          <SelectItem key={region.code} value={region.urlSlug}>
            {region.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 3. Create Occupation Select Component

**File**: `src/components/occupation-select.tsx`

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OCCUPATION_GROUPS } from '@/constants/occupation-groups';

interface OccupationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function OccupationSelect({ value, onValueChange, disabled }: OccupationSelectProps) {
  // Sort occupations alphabetically
  const sortedOccupations = OCCUPATION_GROUPS
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'));

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Välj yrkesgrupp" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Alla yrkesgrupper</SelectItem>
        {sortedOccupations.map((occupation) => (
          <SelectItem key={occupation.id} value={occupation.urlSlug}>
            {occupation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 4. Create Filter Tag Component

**File**: `src/components/filter-tag.tsx`

```typescript
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

export function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
      <span>{label}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-primary/20"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
```

### 5. Create Date Range Picker Component

**File**: `src/components/date-range-picker.tsx`

```typescript
'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, subMonths, subYears } from 'date-fns';
import { sv } from 'date-fns/locale';

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onDateRangeChange?: (from?: Date, to?: Date) => void;
}

export function DateRangePicker({ from, to, onDateRangeChange }: DateRangePickerProps) {
  const [date, setDate] = useState<{ from?: Date; to?: Date }>({
    from,
    to,
  });

  const handleDateChange = (newDate: { from?: Date; to?: Date } | undefined) => {
    setDate(newDate || {});
    if (onDateRangeChange) {
      onDateRangeChange(newDate?.from, newDate?.to);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        Tidsperiod
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date.from && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, y", { locale: sv })} -{" "}
                  {format(date.to, "MMM d, y", { locale: sv })}
                </>
              ) : (
                format(date.from, "MMM d, y", { locale: sv })
              )
            ) : (
              "Senaste 12 månaderna"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const threeMonthsAgo = subMonths(today, 3);
                  handleDateChange({ from: threeMonthsAgo, to: today });
                }}
              >
                3 månader
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const sixMonthsAgo = subMonths(today, 6);
                  handleDateChange({ from: sixMonthsAgo, to: today });
                }}
              >
                6 månader
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const oneYearAgo = subYears(today, 1);
                  handleDateChange({ from: oneYearAgo, to: today });
                }}
              >
                12 månader
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDateChange({})}
              >
                Rensa
              </Button>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={{ from: date.from, to: date.to }}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={sv}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### 6. Update Filter URL Builder

**File**: `src/lib/filter-parser.ts` (add to existing file)

```typescript
export interface FilterUrlOptions {
  region?: string;
  occupation?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function buildFilterUrl(options: FilterUrlOptions): string {
  const segments: string[] = [];
  const searchParams = new URLSearchParams();

  // Add region and occupation to path
  if (options.region) {
    segments.push(options.region);
  }

  if (options.occupation) {
    segments.push(options.occupation);
  }

  // Add date parameters as query params if custom range
  if (options.dateFrom || options.dateTo) {
    if (options.dateFrom) {
      searchParams.set('from', options.dateFrom);
    }
    if (options.dateTo) {
      searchParams.set('to', options.dateTo);
    }
  }

  const basePath = `/vacancies${segments.length > 0 ? '/' + segments.join('/') : ''}`;
  const queryString = searchParams.toString();

  return basePath + (queryString ? '?' + queryString : '');
}
```

### 7. Add Loading States to Filters

**File**: `src/components/vacancy-filters.tsx` (update existing)

```typescript
// Add loading overlay when navigating
{isNavigating && (
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
      Laddar...
    </div>
  </div>
)}
```

### 8. Add Filter Analytics

**File**: `src/lib/filter-analytics.ts`

```typescript
// Track popular filter combinations
export function trackFilterUsage(filters: {
  region?: string;
  occupation?: string;
}) {
  // Log for analytics (implement with your analytics provider)
  console.log('Filter used:', filters);

  // Could send to analytics service:
  // analytics.track('filter_applied', filters);
}
```

### 9. Create Filter Presets Component

**File**: `src/components/filter-presets.tsx`

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const POPULAR_FILTERS = [
  { name: 'Stockholm IT', href: '/vacancies/stockholm/systemutvecklare' },
  { name: 'Göteborg IT', href: '/vacancies/goteborg/systemutvecklare' },
  { name: 'Malmö IT', href: '/vacancies/malmo/systemutvecklare' },
  { name: 'Sjuksköterskor', href: '/vacancies/sjukskoterska' },
  { name: 'Stockholm Alla', href: '/vacancies/stockholm' },
];

export function FilterPresets() {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Populära sökningar:</h3>
      <div className="flex flex-wrap gap-2">
        {POPULAR_FILTERS.map((filter) => (
          <Button
            key={filter.href}
            variant="outline"
            size="sm"
            asChild
          >
            <Link href={filter.href}>{filter.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
```

### 10. Update Main Vacancy Page

**File**: `src/app/vacancies/[[...filters]]/page.tsx` (add filters component)

```typescript
// Add this before the dashboard content
<VacancyFilters
  currentRegion={region}
  currentOccupation={occupation}
/>
```

## Acceptance Criteria

- [ ] Region dropdown shows all Swedish regions (counties)
- [ ] Occupation dropdown shows all occupation groups alphabetically
- [ ] Changing filters navigates to new URL and triggers server re-render
- [ ] Active filters are displayed as removable tags
- [ ] "Clear filters" button navigates back to /vacancies
- [ ] Date range picker allows custom date selections
- [ ] Filter presets provide quick access to popular combinations
- [ ] Loading states shown during navigation
- [ ] All text and labels are in Swedish

## Files Created

- `src/components/vacancy-filters.tsx`
- `src/components/region-select.tsx`
- `src/components/occupation-select.tsx`
- `src/components/filter-tag.tsx`
- `src/components/date-range-picker.tsx`
- `src/components/filter-presets.tsx`
- `src/lib/filter-analytics.ts`

## Files Updated

- `src/lib/filter-parser.ts` (add buildFilterUrl function)
- `src/app/vacancies/[[...filters]]/page.tsx` (add VacancyFilters component)

## Next Steps

After this task, the complete vacancy filtering system will be functional:

- Users can filter by region and occupation using dropdowns
- Filter changes trigger URL navigation and server re-renders
- Popular filter combinations are easily accessible
- All filter state is preserved in URLs for sharing and SEO
