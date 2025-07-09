'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card';
import { parseAsString, useQueryStates } from 'nuqs';
import { DateRangePicker } from './date-range-picker';
import { RegionCombobox } from './region-combobox';
import { OccupationCombobox } from './occupation-combobox';

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

  const handleClearFilters = async () => {
    setIsNavigating(true);

    // Clear search params first
    await setSearchParams({ from: null, to: null });

    // Navigate to clean URL
    router.replace('/dashboard/vacancies');
  };

  const handleDateRangeChange = (from?: Date, to?: Date) => {
    setSearchParams({
      from: from ? from.toISOString().split('T')[0] : null,
      to: to ? to.toISOString().split('T')[0] : null
    });
  };

  return (
    <div className='relative h-full'>
      <Card className='@container/card h-full'>
        <CardHeader>
          <CardDescription>Filtrera sökningen</CardDescription>
        </CardHeader>
        <CardContent className='flex h-full px-8 py-4'>
          <div className='flex w-full flex-col gap-4'>
            <div className='grid flex-1 grid-cols-1 gap-4'>
              {/* Region Filter */}
              <div className='w-full space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium'>
                  <MapPin className='h-4 w-4' />
                  Region
                </label>
                <div className='w-full'>
                  <RegionCombobox
                    value={currentRegion || 'all'}
                    onValueChange={handleRegionChange}
                    disabled={isNavigating}
                  />
                </div>
              </div>

              {/* Occupation Filter */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium'>
                  <Briefcase className='h-4 w-4' />
                  Yrkesgrupp
                </label>
                <div className='w-full'>
                  <OccupationCombobox
                    value={currentOccupation || 'all'}
                    onValueChange={handleOccupationChange}
                    disabled={isNavigating}
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className='w-full'>
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
                  onClick={handleClearFilters}
                  disabled={isNavigating}
                >
                  Rensa filter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
