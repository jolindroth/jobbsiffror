# Task 001: Create Vacancy Data Service Layer

## Goal
Create the core API service that fetches Swedish job vacancy data from JobTech API and returns the aggregated count with filter information.

## What You'll Build
A service function `GetVacancies(month, region?, occupation?)` that returns a single `VacancyRecord` object with the aggregated count from the API.

## Steps

### 1. Create Type Definitions
**File**: `src/types/vacancy-record.ts`
```typescript
export interface VacancyRecord {
  month: string;      // "2024-01"
  region: string;     // "stockholm"  
  occupation: string; // "systemutvecklare"
  count: number;      // 123
}
```

**File**: `src/types/jobtech-api.ts`
```typescript
export interface JobTechSearchResponse {
  total: {
    value: number;
  };
  positions: number;
  query_time_in_millis: number;
  result_time_in_millis: number;
  hits: JobTechHit[];
}

export interface JobTechHit {
  _source: {
    workplace_address?: {
      municipality_code?: string;
    };
    occupation_group?: {
      concept_id?: string;
    };
  };
}
```

### 2. Create Date Utilities
**File**: `src/lib/date-utils.ts`
```typescript
import { startOfMonth, endOfMonth, format } from 'date-fns';

export function monthToDateRange(month: string): { from: string; to: string } {
  // Convert "2024-01" to { from: "2024-01-01T00:00:00", to: "2024-01-31T23:59:59" }
  const [year, monthStr] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
  
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  
  return {
    from: format(startDate, "yyyy-MM-dd'T'00:00:00"),
    to: format(endDate, "yyyy-MM-dd'T'23:59:59")
  };
}
```

**Install date-fns dependency:**
```bash
pnpm add date-fns
```

### 3. Create Main API Service
**File**: `src/services/jobtech-api.ts`
```typescript
import { VacancyRecord, JobTechSearchResponse } from '@/types';
import { monthToDateRange } from '@/lib/date-utils';

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
    'limit': '1', // We only need the total count, not individual results
    'offset': '0'
  });
  
  // Add filters if provided (you'll implement these mappings later)
  if (region) {
    params.set('municipality', getRegionCode(region));
  }
  if (occupation) {
    params.set('occupation-group', getOccupationCode(occupation));
  }
  
  // 3. Fetch from API
  const response = await fetch(
    `https://historical.api.jobtechdev.se/search?${params}`,
    { 
      next: { revalidate: 3600 * 24 * 30 } // 30 day cache
    }
  );
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data: JobTechSearchResponse = await response.json();
  
  // 4. Return single VacancyRecord with aggregated count from API
  return {
    month,
    region: region || 'all',
    occupation: occupation || 'all',
    count: data.total.value // API provides pre-aggregated total
  };
}

// Placeholder functions - you'll implement these with real mappings
function getRegionCode(region: string): string {
  return region; // TODO: implement mapping
}

function getOccupationCode(occupation: string): string {
  return occupation; // TODO: implement mapping
}
```

### 4. Add Error Handling
Add to `src/services/jobtech-api.ts`:
```typescript
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

// Update GetVacancies to use proper error handling
// Add try/catch blocks
// Add timeout handling
// Add retry logic for failed requests
```

### 5. Add Basic Tests
**File**: `src/services/__tests__/jobtech-api.test.ts`
```typescript
import { GetVacancies } from '../jobtech-api';

describe('GetVacancies', () => {
  it('should return a single vacancy record for a given month', async () => {
    const result = await GetVacancies('2024-01');
    expect(result).toHaveProperty('month', '2024-01');
    expect(result).toHaveProperty('region', 'all');
    expect(result).toHaveProperty('occupation', 'all');
    expect(result).toHaveProperty('count');
    expect(typeof result.count).toBe('number');
  });
  
  it('should handle region filter', async () => {
    const result = await GetVacancies('2024-01', 'stockholm');
    expect(result).toHaveProperty('region', 'stockholm');
    expect(result).toHaveProperty('month', '2024-01');
  });
  
  it('should handle occupation filter', async () => {
    const result = await GetVacancies('2024-01', undefined, 'systemutvecklare');
    expect(result).toHaveProperty('occupation', 'systemutvecklare');
    expect(result).toHaveProperty('region', 'all');
  });
  
  it('should handle both filters', async () => {
    const result = await GetVacancies('2024-01', 'stockholm', 'systemutvecklare');
    expect(result).toHaveProperty('region', 'stockholm');
    expect(result).toHaveProperty('occupation', 'systemutvecklare');
  });
});
```

## Acceptance Criteria
- [ ] `GetVacancies('2024-01')` returns a single VacancyRecord object
- [ ] Function accepts optional region and occupation parameters as filters
- [ ] Returned object includes month, region, occupation, and aggregated count
- [ ] API responses are properly cached (30 day duration)
- [ ] Uses `date-fns` for date manipulation (no custom date code)
- [ ] Errors are handled gracefully with custom error types
- [ ] TypeScript types match actual JobTech API response structure
- [ ] Basic unit tests pass for all filter combinations

## Next Steps
After this task is complete:
- Task 002 will add the taxonomy mappings (region/occupation codes)
- Task 003 will extract dashboard components to accept data from this service
- Task 004 will create the URL routing structure
- Dashboard components will make multiple calls to GetVacancies with different parameters to build charts

## Files Created
- `src/types/vacancy-record.ts`
- `src/types/jobtech-api.ts`
- `src/lib/date-utils.ts`
- `src/services/jobtech-api.ts`
- `src/services/__tests__/jobtech-api.test.ts`