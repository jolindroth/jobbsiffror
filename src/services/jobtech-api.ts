import { VacancyRecord } from '@/types/vacancy-record';
import { JobTechSearchResponse } from '@/types/jobtech-api';
import { monthToDateRange } from '@/lib/date-utils';

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

export async function GetVacancies(
  month: string,
  region?: string,
  occupation?: string
): Promise<VacancyRecord> {
  // 1. Convert month to date range
  const { from, to } = monthToDateRange(month);

  // 2. Build query parameters
  const params = new URLSearchParams({
    'historical-from': from,
    'historical-to': to,
    limit: '1', // We only need the total count, not individual results
    offset: '0'
  });

  // Add filters if provided (using placeholders for now)
  if (region) {
    params.set('region', getRegionCode(region));
  } else {
    params.set('country', '199'); // Sweden country code
  }

  if (occupation) {
    params.set('occupation-group', getOccupationCode(occupation));
  }

  // 3. Fetch from API
  try {
    const response = await fetch(
      `https://historical.api.jobtechdev.se/search?${params}`,
      {
        next: { revalidate: 3600 * 24 * 30 } // 30 day cache
      }
    );

    if (!response.ok) {
      throw new JobTechAPIError(
        `API request failed: ${response.status}`,
        response.status,
        { month, region, occupation }
      );
    }

    const data: JobTechSearchResponse = await response.json();

    // 4. Return single VacancyRecord with aggregated count from API
    return {
      month,
      region: region || 'all',
      occupation: occupation || 'all',
      count: data.total.value // API provides pre-aggregated total
    };
  } catch (error) {
    if (error instanceof JobTechAPIError) {
      throw error;
    }

    throw new JobTechAPIError(
      `Failed to fetch vacancy data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      { month, region, occupation }
    );
  }
}

// Placeholder functions - will be implemented in Task 002
function getRegionCode(region: string): string {
  // TODO: implement mapping from region slug to region code
  return region;
}

function getOccupationCode(occupation: string): string {
  // TODO: implement mapping from occupation slug to occupation code
  return occupation;
}
