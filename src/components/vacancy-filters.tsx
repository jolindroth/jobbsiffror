'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card';
import { parseAsString, useQueryStates } from 'nuqs';
import { MonthRangePicker } from './month-range-picker';
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

  // Use nuqs for URL search param management
  const [searchParams, setSearchParams] = useQueryStates(
    {
      fromMonth: parseAsString,
      toMonth: parseAsString
    },
    {
      shallow: false
    }
  );

  const currentQuery = new URLSearchParams();
  if (searchParams.fromMonth)
    currentQuery.set('fromMonth', searchParams.fromMonth);
  if (searchParams.toMonth) currentQuery.set('toMonth', searchParams.toMonth);
  const queryString = currentQuery.toString();

  const handleRegionChange = (newRegion: string) => {
    const segments = [];

    if (newRegion !== 'all') {
      segments.push(newRegion);
    }

    if (currentOccupation) {
      segments.push(currentOccupation);
    }

    const path = `/dashboard/vacancies${segments.length > 0 ? '/' + segments.join('/') : ''}`;

    const finalUrl = `${path}${queryString ? `?${queryString}` : ''}`;
    router.push(finalUrl);
  };

  const handleOccupationChange = (newOccupation: string) => {
    const segments = [];

    if (currentRegion) {
      segments.push(currentRegion);
    }

    if (newOccupation !== 'all') {
      segments.push(newOccupation);
    }

    const path = `/dashboard/vacancies${segments.length > 0 ? '/' + segments.join('/') : ''}`;

    const finalUrl = `${path}${queryString ? `?${queryString}` : ''}`;
    router.push(finalUrl);
  };

  const handleClearFilters = async () => {
    // Clear search params first
    await setSearchParams({ fromMonth: null, toMonth: null });

    // Navigate to clean URL
    router.replace('/dashboard/vacancies');
  };

  const handleMonthRangeChange = (fromMonth?: string, toMonth?: string) => {
    setSearchParams({
      fromMonth: fromMonth || null,
      toMonth: toMonth || null
    });
  };

  return (
    <div className='relative h-full'>
      <Card className='@container/card h-full'>
        <CardHeader>
          <CardDescription>Filtrera sökningen</CardDescription>
        </CardHeader>
        <CardContent className='flex h-full px-8 pt-4'>
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
                  />
                </div>
              </div>

              {/* Month Range Filter */}
              <div className='w-full'>
                <MonthRangePicker
                  fromMonth={searchParams.fromMonth || undefined}
                  toMonth={searchParams.toMonth || undefined}
                  onMonthRangeChange={handleMonthRangeChange}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex h-10'>
              {(currentRegion ||
                currentOccupation ||
                searchParams.fromMonth ||
                searchParams.toMonth) && (
                <Button variant='outline' onClick={handleClearFilters}>
                  Rensa filter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
