'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, subMonths, subYears } from 'date-fns';
import { sv } from 'date-fns/locale';

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onDateRangeChange?: (from?: Date, to?: Date) => void;
}

export function DateRangePicker({
  from,
  to,
  onDateRangeChange
}: DateRangePickerProps) {
  const [date, setDate] = useState<{ from?: Date; to?: Date }>({
    from,
    to
  });

  const handleDateChange = (
    newDate: { from?: Date; to?: Date } | undefined
  ) => {
    setDate(newDate || {});
    if (onDateRangeChange) {
      onDateRangeChange(newDate?.from, newDate?.to);
    }
  };

  return (
    <div className='space-y-2'>
      <label className='flex items-center gap-2 text-sm font-medium'>
        <CalendarDays className='h-4 w-4' />
        Tidsperiod
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-full justify-start text-left font-normal',
              !date.from && 'text-muted-foreground'
            )}
          >
            <CalendarDays className='mr-2 h-4 w-4' />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, 'MMM d, y', { locale: sv })} -{' '}
                  {format(date.to, 'MMM d, y', { locale: sv })}
                </>
              ) : (
                format(date.from, 'MMM d, y', { locale: sv })
              )
            ) : (
              'Senaste 12 månaderna'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='border-b p-3'>
            <div className='grid grid-cols-2 gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const today = new Date();
                  const threeMonthsAgo = subMonths(today, 3);
                  handleDateChange({ from: threeMonthsAgo, to: today });
                }}
              >
                3 månader
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const today = new Date();
                  const sixMonthsAgo = subMonths(today, 6);
                  handleDateChange({ from: sixMonthsAgo, to: today });
                }}
              >
                6 månader
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const today = new Date();
                  const oneYearAgo = subYears(today, 1);
                  handleDateChange({ from: oneYearAgo, to: today });
                }}
              >
                12 månader
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleDateChange({})}
              >
                Rensa
              </Button>
            </div>
          </div>
          <Calendar
            initialFocus
            mode='range'
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
