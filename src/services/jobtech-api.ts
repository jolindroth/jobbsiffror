import { VacancyRecord } from '@/types/vacancy-record';
import { JobTechSearchResponse } from '@/types/jobtech-api';
import { monthToDateRange } from '@/lib/date-utils';
import {
  getOccupationCode as getOccupationCodeFromSlug,
  getRegionCode as getRegionCodeFromSlug
} from '@/lib/taxonomy-mappings';
import { eachMonthOfInterval, parseISO, format, startOfMonth } from 'date-fns';

export class JobTechAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public params: any
  ) {
    super(message);
    this.name = 'JobTechAPIError';
  }
}

// Single month API call function
async function GetHistoricalVacanciesByMonth(
  month: string, // Format: "2024-01"
  region?: string,
  occupation?: string
): Promise<VacancyRecord> {
  const { from, to } = monthToDateRange(month);

  const params = new URLSearchParams({
    'historical-from': from,
    'historical-to': to,
    limit: '0', // 98% memory reduction: only count data, no job postings (was limit: '1')
    offset: '0'
  });

  // Add filters if provided
  if (region) {
    params.set('region', getRegionCode(region));
  } else {
    params.set('country', '199'); // Sweden country code
  }

  if (occupation) {
    params.set('occupation-group', getOccupationCode(occupation));
  }

  try {
    const response = await fetch(
      `https://historical.api.jobtechdev.se/search?${params}`,
      {
        cache: 'force-cache',
        headers: {
          'User-Agent': 'Jobbsiffror/1.0 (+https://jobbsiffror.se)',
          'Accept-Encoding': 'gzip, deflate, br', // Request compression for smaller payloads
          Accept: 'application/json'
        },
        next: { revalidate: 3600 * 24 * 30 } // 30 day cache
      }
    );

    console.log(response);
    console.log(response.headers);
    console.log(
      `https://historical.api.jobtechdev.se/search?${params}`,
      Date.now()
    );

    if (!response.ok) {
      throw new JobTechAPIError(
        `API request failed: ${response.status}`,
        response.status,
        { month, region, occupation }
      );
    }

    const data: JobTechSearchResponse = await response.json();

    return {
      month,
      region: region || 'all',
      occupation: occupation || 'all',
      count: data.total.value // Real count from API
    };
  } catch (error) {
    if (error instanceof JobTechAPIError) {
      throw error;
    }

    throw new JobTechAPIError(
      `Failed to fetch vacancy data for month ${month}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      { month, region, occupation }
    );
  }
}

export async function GetHistoricalVacanciesByRange(
  dateFrom: string,
  dateTo: string,
  region?: string,
  occupation?: string
): Promise<VacancyRecord[]> {
  try {
    // Apply intelligent cutoff filtering automatically
    const { getCachedCutoffDate } = await import('./data-cutoff-cache');
    const { filterDateRangeByAvailability } = await import(
      './date-range-filter'
    );

    const cutoff = await getCachedCutoffDate();

    if (cutoff) {
      // Apply cutoff filtering before making API calls
      const filterResult = await filterDateRangeByAvailability(
        dateFrom,
        dateTo
      );
      dateFrom = filterResult.adjustedDateFrom;
      dateTo = filterResult.adjustedDateTo;
    }

    // Parse date strings using date-fns
    const startDate = parseISO(
      dateFrom.includes('T') ? dateFrom.split('T')[0] : dateFrom
    );
    const endDate = parseISO(
      dateTo.includes('T') ? dateTo.split('T')[0] : dateTo
    );

    // Generate array of months between start and end dates
    const months = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: startOfMonth(endDate)
    });

    // Make separate API calls for each month to get real monthly data
    const monthlyPromises = months.map((monthDate) => {
      const monthString = format(monthDate, 'yyyy-MM');
      return GetHistoricalVacanciesByMonth(monthString, region, occupation);
    });

    // Execute all API calls and handle individual failures
    const results = await Promise.allSettled(monthlyPromises);

    const monthlyData: VacancyRecord[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        monthlyData.push(result.value);
      } else {
        const monthString = format(months[index], 'yyyy-MM');
        errors.push(
          `Failed to fetch data for ${monthString}: ${result.reason?.message || 'Unknown error'}`
        );

        // Add placeholder record with 0 count for failed months
        monthlyData.push({
          month: monthString,
          region: region || 'all',
          occupation: occupation || 'all',
          count: 0
        });
      }
    });

    // Log errors but don't fail the entire request
    if (errors.length > 0) {
      console.warn('Some monthly data failed to fetch:', errors);
    }

    // Sort by month to ensure proper chronological order
    return monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    throw new JobTechAPIError(
      `Failed to fetch vacancy data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      { dateFrom, dateTo, region, occupation }
    );
  }
}

// Helper function to determine if we should fetch all regions
export function shouldFetchAllRegions(region?: string): boolean {
  return !region || region === 'all';
}

// Get all regions data for a specific month (for map visualization)
async function GetAllRegionsDataForMonth(
  month: string, // Format: "2024-01"
  occupation?: string
): Promise<VacancyRecord[]> {
  const { SWEDISH_REGIONS } = await import('@/constants/swedish-regions');

  // Create promises for all 21 regions
  const regionPromises = SWEDISH_REGIONS.map((region) =>
    GetHistoricalVacanciesByMonth(month, region.urlSlug, occupation)
  );

  try {
    // Execute all API calls in parallel - atomic operation
    const results = await Promise.all(regionPromises);
    return results;
  } catch (error) {
    // If any regional call fails, the entire operation fails
    throw new JobTechAPIError(
      `Failed to fetch regional data for month ${month}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      { month, occupation, regionCount: SWEDISH_REGIONS.length }
    );
  }
}

// Enhanced function to get vacancy data for all regions (for map visualization)
export async function GetHistoricalVacanciesByRegions(
  dateFrom: string,
  dateTo: string,
  occupation?: string
): Promise<VacancyRecord[]> {
  try {
    // Apply intelligent cutoff filtering automatically
    const { getCachedCutoffDate } = await import('./data-cutoff-cache');
    const { filterDateRangeByAvailability } = await import(
      './date-range-filter'
    );

    const cutoff = await getCachedCutoffDate();

    if (cutoff) {
      // Apply cutoff filtering before making API calls
      const filterResult = await filterDateRangeByAvailability(
        dateFrom,
        dateTo
      );
      dateFrom = filterResult.adjustedDateFrom;
      dateTo = filterResult.adjustedDateTo;
    }

    // Parse date strings using date-fns
    const startDate = parseISO(
      dateFrom.includes('T') ? dateFrom.split('T')[0] : dateFrom
    );
    const endDate = parseISO(
      dateTo.includes('T') ? dateTo.split('T')[0] : dateTo
    );

    // Generate array of months between start and end dates
    const months = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: startOfMonth(endDate)
    });

    // Make API calls for each month to get all regional data
    const monthlyPromises = months.map((monthDate) => {
      const monthString = format(monthDate, 'yyyy-MM');
      return GetAllRegionsDataForMonth(monthString, occupation);
    });

    // Execute all monthly calls - atomic operation
    const monthlyResults = await Promise.all(monthlyPromises);

    // Flatten the results (each month returns array of regions)
    const allRecords: VacancyRecord[] = monthlyResults.flat();

    // Sort by month to ensure proper chronological order
    return allRecords.sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    throw new JobTechAPIError(
      `Failed to fetch regional vacancy data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      { dateFrom, dateTo, occupation }
    );
  }
}

// Real mapping functions using taxonomy mappings
function getRegionCode(region: string): string {
  const code = getRegionCodeFromSlug(region);
  if (!code) {
    throw new Error(`Unknown region: ${region}`);
  }
  return code;
}

function getOccupationCode(occupation: string): string {
  const code = getOccupationCodeFromSlug(occupation);
  if (!code) {
    throw new Error(`Unknown occupation: ${occupation}`);
  }
  return code;
}
