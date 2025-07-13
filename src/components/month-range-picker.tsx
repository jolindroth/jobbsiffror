'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, subMonths } from 'date-fns';
import { sv } from 'date-fns/locale';

interface MonthRangePickerProps {
  fromMonth?: string; // Format: "YYYY-MM"
  toMonth?: string; // Format: "YYYY-MM"
  onMonthRangeChange?: (fromMonth?: string, toMonth?: string) => void;
}

// Generate years from 2006 to current year + 1
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2006; year <= currentYear + 1; year++) {
    years.push(year.toString());
  }
  return years;
};

// Generate months in Swedish
const months = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Maj' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Augusti' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

export function MonthRangePicker({
  fromMonth,
  toMonth,
  onMonthRangeChange
}: MonthRangePickerProps) {
  const [monthRange, setMonthRange] = useState<{
    fromMonth?: string;
    toMonth?: string;
  }>({
    fromMonth,
    toMonth
  });

  const [tempRange, setTempRange] = useState<{
    fromYear?: string;
    fromMonthValue?: string;
    toYear?: string;
    toMonthValue?: string;
  }>(() => {
    // Initialize temp values from props
    const fromParts = fromMonth?.split('-');
    const toParts = toMonth?.split('-');
    return {
      fromYear: fromParts?.[0],
      fromMonthValue: fromParts?.[1],
      toYear: toParts?.[0],
      toMonthValue: toParts?.[1]
    };
  });

  const years = generateYears();

  // Generate filtered years for "To" selection based on "From" selection
  const getAvailableToYears = () => {
    if (!tempRange.fromYear) return years;
    return years.filter(
      (year) => parseInt(year) >= parseInt(tempRange.fromYear!)
    );
  };

  // Generate filtered months for "To" selection based on "From" selection
  const getAvailableToMonths = () => {
    if (!tempRange.fromYear || !tempRange.toYear) return months;

    // If different years, all months are available
    if (tempRange.fromYear !== tempRange.toYear) return months;

    // If same year, only months from the selected "from" month onwards
    if (!tempRange.fromMonthValue) return months;

    return months.filter(
      (month) => parseInt(month.value) >= parseInt(tempRange.fromMonthValue!)
    );
  };

  const handleMonthRangeChange = (newRange: {
    fromMonth?: string;
    toMonth?: string;
  }) => {
    setMonthRange(newRange);
    if (onMonthRangeChange) {
      onMonthRangeChange(newRange.fromMonth, newRange.toMonth);
    }
  };

  // Handle "From" year change and clear invalid "To" selections
  const handleFromYearChange = (value: string) => {
    const newTempRange = { ...tempRange, fromYear: value };

    // Clear "To" selections if they become invalid
    if (tempRange.toYear && parseInt(value) > parseInt(tempRange.toYear)) {
      newTempRange.toYear = undefined;
      newTempRange.toMonthValue = undefined;
    } else if (
      tempRange.toYear === value &&
      tempRange.toMonthValue &&
      tempRange.fromMonthValue
    ) {
      // Same year: clear "To" month if it's before "From" month
      if (
        parseInt(tempRange.toMonthValue) < parseInt(tempRange.fromMonthValue)
      ) {
        newTempRange.toMonthValue = undefined;
      }
    }

    setTempRange(newTempRange);
  };

  // Handle "From" month change and clear invalid "To" selections
  const handleFromMonthChange = (value: string) => {
    const newTempRange = { ...tempRange, fromMonthValue: value };

    // If same year and "To" month is before new "From" month, clear it
    if (tempRange.fromYear === tempRange.toYear && tempRange.toMonthValue) {
      if (parseInt(tempRange.toMonthValue) < parseInt(value)) {
        newTempRange.toMonthValue = undefined;
      }
    }

    setTempRange(newTempRange);
  };

  const handleApply = () => {
    const { fromYear, fromMonthValue, toYear, toMonthValue } = tempRange;

    const newFromMonth =
      fromYear && fromMonthValue ? `${fromYear}-${fromMonthValue}` : undefined;
    const newToMonth =
      toYear && toMonthValue ? `${toYear}-${toMonthValue}` : undefined;

    handleMonthRangeChange({
      fromMonth: newFromMonth,
      toMonth: newToMonth
    });
  };

  const handlePreset = (monthsBack: number) => {
    const today = new Date();
    const fromDate = monthsBack > 0 ? subMonths(today, monthsBack) : today;
    const toDate = today;

    const fromFormatted = format(fromDate, 'yyyy-MM');
    const toFormatted = format(toDate, 'yyyy-MM');

    handleMonthRangeChange({
      fromMonth: fromFormatted,
      toMonth: toFormatted
    });
  };

  const formatDisplayDate = (monthStr?: string) => {
    if (!monthStr) return null;
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return format(date, 'MMM yyyy', { locale: sv });
  };

  const displayText = () => {
    if (monthRange.fromMonth && monthRange.toMonth) {
      return `${formatDisplayDate(monthRange.fromMonth)} - ${formatDisplayDate(monthRange.toMonth)}`;
    }
    if (monthRange.fromMonth) {
      return formatDisplayDate(monthRange.fromMonth);
    }
    return 'Senaste 12 månaderna';
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
              'w-full justify-start truncate text-left font-normal',
              !monthRange.fromMonth && 'text-muted-foreground'
            )}
          >
            <CalendarDays className='mr-2 h-4 w-4' />
            {displayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 p-0' align='start'>
          {/* Preset buttons */}
          <div className='border-b p-3'>
            <div className='grid grid-cols-2 gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePreset(3)}
              >
                3 månader
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePreset(6)}
              >
                6 månader
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePreset(12)}
              >
                12 månader
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleMonthRangeChange({})}
              >
                Rensa
              </Button>
            </div>
          </div>

          {/* Month/Year selectors */}
          <div className='space-y-4 p-4'>
            <div className='space-y-3'>
              <div className='text-sm font-medium'>Från</div>
              <div className='grid grid-cols-2 gap-2'>
                <Select
                  value={tempRange.fromYear}
                  onValueChange={handleFromYearChange}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='År' />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={tempRange.fromMonthValue}
                  onValueChange={handleFromMonthChange}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Månad' />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='text-sm font-medium'>Till</div>
              <div className='grid grid-cols-2 gap-2'>
                <Select
                  value={tempRange.toYear}
                  onValueChange={(value) =>
                    setTempRange({ ...tempRange, toYear: value })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='År' />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableToYears().map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={tempRange.toMonthValue}
                  onValueChange={(value) =>
                    setTempRange({ ...tempRange, toMonthValue: value })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Månad' />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableToMonths().map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className='w-full' onClick={handleApply}>
              Tillämpa
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
