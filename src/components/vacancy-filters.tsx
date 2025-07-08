'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseAsString, useQueryStates } from 'nuqs';
import { DateRangePicker } from './date-range-picker';
import { RegionSelect } from './region-select';
import { OccupationSelect } from './occupation-select';
import { FilterTag } from './filter-tag';

interface VacancyFiltersProps {
  currentRegion?: string;
  currentOccupation?: string;
}

export function VacancyFilters({
  currentRegion,
  currentOccupation
}: VacancyFiltersProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Use nuqs for URL search param management
  const [searchParams, setSearchParams] = useQueryStates({
    from: parseAsString,
    to: parseAsString
  });

  const handleRegionChange = (newRegion: string) => {
    setIsNavigating(true);
    const segments = [];

    if (newRegion !== 'all') {
      segments.push(newRegion);
    }

    if (currentOccupation) {
      segments.push(currentOccupation);
    }

    const url = `/dashboard/vacancies${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    router.push(url);
  };

  const handleOccupationChange = (newOccupation: string) => {
    setIsNavigating(true);
    const segments = [];

    if (currentRegion) {
      segments.push(currentRegion);
    }

    if (newOccupation !== 'all') {
      segments.push(newOccupation);
    }

    const url = `/dashboard/vacancies${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    router.push(url);
  };

  const handleClearFilters = () => {
    setIsNavigating(true);
    router.push('/dashboard/vacancies');
  };

  const handleDateRangeChange = (from?: Date, to?: Date) => {
    setSearchParams({
      from: from ? from.toISOString().split('T')[0] : null,
      to: to ? to.toISOString().split('T')[0] : null
    });
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className='relative'>
      <div className='bg-card mb-8 rounded-lg border p-6'>
        <div className='flex flex-col items-start gap-4 lg:flex-row lg:items-center'>
          <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-3'>
            {/* Region Filter */}
            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <MapPin className='h-4 w-4' />
                Region
              </label>
              <RegionSelect
                value={currentRegion || 'all'}
                onValueChange={handleRegionChange}
                disabled={isNavigating}
              />
            </div>

            {/* Occupation Filter */}
            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium'>
                <Briefcase className='h-4 w-4' />
                Yrkesgrupp
              </label>
              <OccupationSelect
                value={currentOccupation || 'all'}
                onValueChange={handleOccupationChange}
                disabled={isNavigating}
              />
            </div>

            {/* Date Range Filter */}
            <div className='space-y-2'>
              <DateRangePicker
                from={
                  searchParams.from ? new Date(searchParams.from) : undefined
                }
                to={searchParams.to ? new Date(searchParams.to) : undefined}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            {(currentRegion ||
              currentOccupation ||
              searchParams.from ||
              searchParams.to) && (
              <Button
                variant='outline'
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
        {(currentRegion ||
          currentOccupation ||
          searchParams.from ||
          searchParams.to) && (
          <div className='mt-4 border-t pt-4'>
            <div className='flex flex-wrap gap-2'>
              <span className='text-muted-foreground text-sm'>
                Aktiva filter:
              </span>
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
                  label='Datumfilter'
                  onRemove={() => setSearchParams({ from: null, to: null })}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isNavigating && (
        <div className='bg-background/80 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm'>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
            Laddar...
          </div>
        </div>
      )}
    </div>
  );
}
