import { unstable_cache, revalidateTag } from 'next/cache';
import { VacancyRecord } from '@/types/vacancy-record';

// Cache configuration
const CUTOFF_CACHE_TAG = 'data-cutoff';
const CACHE_DURATION = 604800; // 1 week in seconds (3600 * 24 * 7)

// Minimum job count threshold to distinguish real data from API artifacts
const VALID_DATA_THRESHOLD = 10;

/**
 * Detect cutoff date from monthly data by finding the last month with significant job activity
 * @param monthlyData Array of VacancyRecord with monthly job counts
 * @returns Last valid month in "YYYY-MM" format or null if no valid data found
 */
export function detectCutoffFromMonthlyData(
  monthlyData: VacancyRecord[]
): string | null {
  // Sort by month descending (newest first)
  const sortedData = monthlyData
    .filter((record) => record.month && record.count !== undefined)
    .sort((a, b) => b.month.localeCompare(a.month));

  // Find last month with significant job count (> threshold)
  // This handles the edge case where API returns 0-1 jobs for dead months
  for (const record of sortedData) {
    if (record.count > VALID_DATA_THRESHOLD) {
      return record.month;
    }
  }

  return null; // No valid data found
}

/**
 * Cached function to detect cutoff date from API data
 * This will only run on cache miss and cache the result for 1 week
 */
const getCachedCutoffDetection = unstable_cache(
  async (): Promise<string | null> => {
    // Import here to avoid circular dependencies
    const { GetHistoricalVacanciesByRange } = await import('./jobtech-api');
    const { getDefaultFromDate, getDefaultToDate } = await import(
      '@/lib/date-utils'
    );

    try {
      // Fetch 12 months of default data (all professions, all jobs)
      const defaultData = await GetHistoricalVacanciesByRange(
        getDefaultFromDate(),
        getDefaultToDate()
      );

      // Detect cutoff from the fetched data
      const detectedCutoff = detectCutoffFromMonthlyData(defaultData);

      console.log(
        `Data cutoff detected and cached: ${detectedCutoff} at ${new Date().toISOString()}`
      );

      return detectedCutoff;
    } catch (error) {
      console.error('Failed to detect cutoff during cache operation:', error);
      return null;
    }
  },
  ['data-cutoff-detection'],
  {
    tags: [CUTOFF_CACHE_TAG],
    revalidate: CACHE_DURATION
  }
);

/**
 * Get cached cutoff date with 1-week expiration
 * @returns Cached cutoff date in "YYYY-MM" format or null if not cached or expired
 */
export async function getCachedCutoffDate(): Promise<string | null> {
  try {
    // This will either return cached value or detect new cutoff on cache miss
    const cachedValue = await getCachedCutoffDetection();
    return cachedValue;
  } catch (error) {
    console.warn('Error checking cached cutoff date:', error);
    return null;
  }
}

/**
 * Force refresh of the cached cutoff date
 * This will trigger a new cutoff detection on the next getCachedCutoffDate() call
 */
export async function updateCutoffCache(): Promise<void> {
  try {
    // Invalidate the cache to force fresh detection
    revalidateTag(CUTOFF_CACHE_TAG);

    console.log(
      `Data cutoff cache invalidated for refresh at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error('Failed to update cutoff cache:', error);
    // Don't throw - this should be non-blocking
  }
}

/**
 * Check if a month is within the valid data range
 * @param month Month in "YYYY-MM" format
 * @param cutoffDate Cutoff date in "YYYY-MM" format
 * @returns True if month is within valid range
 */
export function isMonthWithinDataRange(
  month: string,
  cutoffDate: string
): boolean {
  return month <= cutoffDate;
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearCutoffCache(): void {
  revalidateTag(CUTOFF_CACHE_TAG);
}

/**
 * Get cache status for debugging
 */
export async function getCacheStatus(): Promise<{
  hasCachedValue: boolean;
  cachedValue: string | null;
  cacheTag: string;
  cacheDurationSeconds: number;
}> {
  const cachedValue = await getCachedCutoffDate();

  return {
    hasCachedValue: cachedValue !== null,
    cachedValue,
    cacheTag: CUTOFF_CACHE_TAG,
    cacheDurationSeconds: CACHE_DURATION
  };
}

/**
 * Get configuration values for data cutoff detection
 */
export const DATA_CUTOFF_CONFIG = {
  validDataThreshold: VALID_DATA_THRESHOLD,
  cacheTag: CUTOFF_CACHE_TAG,
  cacheDurationSeconds: CACHE_DURATION,
  cacheDurationDays: 7
} as const;
