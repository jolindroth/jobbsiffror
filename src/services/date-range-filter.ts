import {
  getCachedCutoffDate,
  isMonthWithinDataRange
} from './data-cutoff-cache';
import {
  eachMonthOfInterval,
  format,
  parseISO,
  startOfMonth,
  endOfMonth
} from 'date-fns';

/**
 * Result of date range filtering operation
 */
export interface FilterResult {
  adjustedDateFrom: string;
  adjustedDateTo: string;
  wasFiltered: boolean;
  monthsFiltered: string[];
}

/**
 * Filter date range based on cached data availability
 * @param dateFrom Start date in ISO format (e.g., "2024-01-01T00:00:00")
 * @param dateTo End date in ISO format (e.g., "2024-12-31T23:59:59")
 * @returns Filtered date range with metadata
 */
export async function filterDateRangeByAvailability(
  dateFrom: string,
  dateTo: string
): Promise<FilterResult> {
  try {
    const cutoffDate = await getCachedCutoffDate();

    if (!cutoffDate) {
      // No cutoff detected yet, return original range
      return {
        adjustedDateFrom: dateFrom,
        adjustedDateTo: dateTo,
        wasFiltered: false,
        monthsFiltered: []
      };
    }

    // Convert cutoff month to end-of-month date for comparison
    const cutoffEndDate = format(
      endOfMonth(parseISO(`${cutoffDate}-01`)),
      "yyyy-MM-dd'T'23:59:59"
    );

    let adjustedDateTo = dateTo;
    let wasFiltered = false;
    let monthsFiltered: string[] = [];

    // If dateTo is beyond cutoff, adjust it
    if (dateTo > cutoffEndDate) {
      adjustedDateTo = cutoffEndDate;
      wasFiltered = true;

      // Calculate which months were filtered out
      monthsFiltered = getFilteredMonths(adjustedDateTo, dateTo);
    }

    return {
      adjustedDateFrom: dateFrom,
      adjustedDateTo,
      wasFiltered,
      monthsFiltered
    };
  } catch (error) {
    console.error('Error filtering date range:', error);

    // On error, return original range (graceful fallback)
    return {
      adjustedDateFrom: dateFrom,
      adjustedDateTo: dateTo,
      wasFiltered: false,
      monthsFiltered: []
    };
  }
}

/**
 * Calculate which months were filtered out
 * @param adjustedEndDate The adjusted end date
 * @param originalEndDate The original requested end date
 * @returns Array of filtered month strings in "YYYY-MM" format
 */
function getFilteredMonths(
  adjustedEndDate: string,
  originalEndDate: string
): string[] {
  try {
    const adjustedEnd = parseISO(adjustedEndDate);
    const originalEnd = parseISO(originalEndDate);

    // Get the first month after the adjusted end date
    const firstFilteredMonth = startOfMonth(
      new Date(adjustedEnd.getFullYear(), adjustedEnd.getMonth() + 1, 1)
    );

    // Generate array of filtered months
    const filteredMonths = eachMonthOfInterval({
      start: firstFilteredMonth,
      end: startOfMonth(originalEnd)
    });

    return filteredMonths.map((month) => format(month, 'yyyy-MM'));
  } catch (error) {
    console.error('Error calculating filtered months:', error);
    return [];
  }
}

/**
 * Check if a specific month string is within available data range
 * @param month Month in "YYYY-MM" format
 * @returns True if month is available, false if beyond cutoff or no cutoff cached
 */
export async function isMonthAvailable(month: string): Promise<boolean> {
  try {
    const cutoffDate = await getCachedCutoffDate();

    if (!cutoffDate) {
      // No cutoff cached - assume available for graceful degradation
      return true;
    }

    return isMonthWithinDataRange(month, cutoffDate);
  } catch (error) {
    console.error('Error checking month availability:', error);
    return true; // Default to available on error
  }
}

/**
 * Get the maximum available date for requests
 * @returns Maximum date in ISO format or null if no cutoff available
 */
export async function getMaxAvailableDate(): Promise<string | null> {
  try {
    const cutoffDate = await getCachedCutoffDate();

    if (!cutoffDate) {
      return null;
    }

    // Convert cutoff month to end-of-month date
    return format(
      endOfMonth(parseISO(`${cutoffDate}-01`)),
      "yyyy-MM-dd'T'23:59:59"
    );
  } catch (error) {
    console.error('Error getting max available date:', error);
    return null;
  }
}

/**
 * Validate if a date range request is entirely within available data
 * @param dateFrom Start date in ISO format
 * @param dateTo End date in ISO format
 * @returns Validation result with details
 */
export async function validateDateRange(
  dateFrom: string,
  dateTo: string
): Promise<{
  isValid: boolean;
  exceedsAvailableData: boolean;
  maxAvailableDate: string | null;
  message?: string;
}> {
  try {
    const maxAvailableDate = await getMaxAvailableDate();

    if (!maxAvailableDate) {
      // No cutoff data available - assume valid
      return {
        isValid: true,
        exceedsAvailableData: false,
        maxAvailableDate: null
      };
    }

    const exceedsAvailableData = dateTo > maxAvailableDate;

    return {
      isValid: !exceedsAvailableData,
      exceedsAvailableData,
      maxAvailableDate,
      message: exceedsAvailableData
        ? `Requested end date exceeds available data. Data available until ${maxAvailableDate}`
        : undefined
    };
  } catch (error) {
    console.error('Error validating date range:', error);
    return {
      isValid: true,
      exceedsAvailableData: false,
      maxAvailableDate: null,
      message: 'Error validating date range'
    };
  }
}

/**
 * Convert month string to date range
 * @param month Month in "YYYY-MM" format
 * @returns Object with from and to dates in ISO format
 */
export function monthToFilteredDateRange(month: string): {
  from: string;
  to: string;
} {
  const monthDate = parseISO(`${month}-01`);
  const startDate = startOfMonth(monthDate);
  const endDate = endOfMonth(monthDate);

  return {
    from: format(startDate, "yyyy-MM-dd'T'00:00:00"),
    to: format(endDate, "yyyy-MM-dd'T'23:59:59")
  };
}

/**
 * Get array of available months within a date range
 * @param dateFrom Start date in ISO format
 * @param dateTo End date in ISO format
 * @returns Array of available month strings in "YYYY-MM" format
 */
export async function getAvailableMonthsInRange(
  dateFrom: string,
  dateTo: string
): Promise<string[]> {
  try {
    const cutoffDate = await getCachedCutoffDate();

    // Generate all months in the requested range
    const startDate = startOfMonth(parseISO(dateFrom));
    const endDate = startOfMonth(parseISO(dateTo));

    const allMonths = eachMonthOfInterval({
      start: startDate,
      end: endDate
    }).map((month) => format(month, 'yyyy-MM'));

    if (!cutoffDate) {
      // No cutoff - return all months
      return allMonths;
    }

    // Filter out months beyond cutoff
    return allMonths.filter((month) =>
      isMonthWithinDataRange(month, cutoffDate)
    );
  } catch (error) {
    console.error('Error getting available months:', error);
    return [];
  }
}
