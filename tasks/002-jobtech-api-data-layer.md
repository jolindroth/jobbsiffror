# Task 002: JobTech API Data Layer Implementation

## Overview
Implement the core data layer service that fetches and transforms JobTech Historical Vacancies API data into our simplified VacancyRecord model. This service will handle month-specific queries, taxonomy mapping, and response aggregation.

## Data Model
```typescript
interface VacancyRecord {
  month: string;      // "2024-01" 
  region: string;     // "stockholm" (friendly name)
  occupation: string; // "systemutvecklare" (friendly name)
  count: number;      // total vacancies for this combination
}

// Primary service function
function GetVacancies(
  month: string, 
  region?: string, 
  occupation?: string
): Promise<VacancyRecord[]>
```

## API Integration Requirements

### 1. Month to Date Range Conversion
```typescript
// Convert month string to JobTech API date range
function monthToDateRange(month: string): { from: string; to: string } {
  // Input: "2024-01"
  // Output: { 
  //   from: "2024-01-01T00:00:00", 
  //   to: "2024-01-31T23:59:59" 
  // }
}
```

### 2. Taxonomy Mapping
Create bidirectional mappings between friendly names and API codes:

#### Region Mapping
```typescript
// From URL-friendly names to municipality/region codes
const REGION_TO_CODE: Record<string, string> = {
  "stockholm": "0180",     // Stockholm municipality
  "goteborg": "1480",      // Göteborg municipality
  "malmo": "1280",         // Malmö municipality
  // ... all Swedish municipalities
};

// Reverse mapping for display
const CODE_TO_REGION: Record<string, string> = {
  "0180": "stockholm",
  "1480": "goteborg",
  // ...
};
```

#### Occupation Mapping
```typescript
// From URL-friendly names to occupation-group codes
const OCCUPATION_TO_CODE: Record<string, string> = {
  "systemutvecklare": "2512",
  "sjukskoterska": "2223", 
  "lastbilsforare": "8332",
  // ... from occupation-groups.json
};

// Reverse mapping
const CODE_TO_OCCUPATION: Record<string, string> = {
  "2512": "systemutvecklare",
  "2223": "sjukskoterska",
  // ...
};
```

### 3. API Query Construction
```typescript
async function queryJobTechAPI(params: {
  month: string;
  region?: string;
  occupation?: string;
}): Promise<JobTechSearchResponse> {
  
  const { from, to } = monthToDateRange(params.month);
  const searchParams = new URLSearchParams({
    'historical-from': from,
    'historical-to': to,
    'limit': '100',  // Max per request
    'offset': '0'
  });

  // Add optional filters
  if (params.region) {
    const regionCode = REGION_TO_CODE[params.region];
    if (regionCode) {
      searchParams.set('municipality', regionCode);
    }
  }

  if (params.occupation) {
    const occupationCode = OCCUPATION_TO_CODE[params.occupation];
    if (occupationCode) {
      searchParams.set('occupation-group', occupationCode);
    }
  }

  const response = await fetch(
    `https://historical.api.jobtechdev.se/search?${searchParams}`,
    { 
      next: { revalidate: 3600 * 24 * 30 } // 30 day cache - historical data never changes
    }
  );

  return response.json();
}
```

### 4. Response Aggregation
Transform API response into VacancyRecord format:

```typescript
function aggregateResponse(
  apiResponse: JobTechSearchResponse,
  month: string,
  region?: string,
  occupation?: string
): VacancyRecord[] {
  
  if (region && occupation) {
    // Both filters applied - return single record
    return [{
      month,
      region,
      occupation,
      count: apiResponse.hits.total.value
    }];
  }
  
  if (region) {
    // Region filter applied - group by occupation
    const occupationCounts = new Map<string, number>();
    
    for (const hit of apiResponse.hits.hits) {
      const occupationCode = hit._source.occupation_group?.concept_id;
      const occupationName = CODE_TO_OCCUPATION[occupationCode] || 'other';
      
      occupationCounts.set(occupationName, 
        (occupationCounts.get(occupationName) || 0) + 1
      );
    }
    
    return Array.from(occupationCounts).map(([occupation, count]) => ({
      month,
      region,
      occupation,
      count
    }));
  }
  
  if (occupation) {
    // Occupation filter applied - group by region
    const regionCounts = new Map<string, number>();
    
    for (const hit of apiResponse.hits.hits) {
      const municipalityCode = hit._source.workplace_address?.municipality_code;
      const regionName = CODE_TO_REGION[municipalityCode] || 'other';
      
      regionCounts.set(regionName, 
        (regionCounts.get(regionName) || 0) + 1
      );
    }
    
    return Array.from(regionCounts).map(([region, count]) => ({
      month,
      region,
      occupation,
      count
    }));
  }
  
  // No filters - group by both region and occupation
  const combinationCounts = new Map<string, number>();
  
  for (const hit of apiResponse.hits.hits) {
    const municipalityCode = hit._source.workplace_address?.municipality_code;
    const occupationCode = hit._source.occupation_group?.concept_id;
    
    const regionName = CODE_TO_REGION[municipalityCode] || 'other';
    const occupationName = CODE_TO_OCCUPATION[occupationCode] || 'other';
    const key = `${regionName}:${occupationName}`;
    
    combinationCounts.set(key, 
      (combinationCounts.get(key) || 0) + 1
    );
  }
  
  return Array.from(combinationCounts).map(([key, count]) => {
    const [region, occupation] = key.split(':');
    return { month, region, occupation, count };
  });
}
```

### 5. Pagination Handling
Handle API limit of 100 results per request:

```typescript
async function getAllVacancies(params: {
  month: string;
  region?: string;
  occupation?: string;
}): Promise<VacancyRecord[]> {
  
  let allHits: JobTechHit[] = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await queryJobTechAPI({ ...params, offset, limit });
    allHits.push(...response.hits.hits);
    
    // Check if we have all results
    if (allHits.length >= response.hits.total.value || response.hits.hits.length < limit) {
      break;
    }
    
    offset += limit;
    
    // Safety check - API max offset is 2000
    if (offset >= 2000) {
      console.warn(`Reached maximum offset (2000) for query: ${JSON.stringify(params)}`);
      break;
    }
  }
  
  // Create synthetic response with all hits
  const completeResponse = {
    hits: {
      total: { value: allHits.length },
      hits: allHits
    }
  };
  
  return aggregateResponse(completeResponse, params.month, params.region, params.occupation);
}
```

## File Structure
```
src/
├── services/
│   └── jobtech-api.ts           # Main service implementation
├── lib/
│   ├── taxonomy-mappings.ts     # Region and occupation mappings
│   └── date-utils.ts            # Month to date range conversion
├── types/
│   ├── vacancy-record.ts        # VacancyRecord interface
│   └── jobtech-api.ts          # JobTech API response types
```

## Implementation Steps

### Phase 1: Basic Service Setup (2 hours)
1. Create `VacancyRecord` interface and export from types
2. Implement `monthToDateRange` utility function
3. Create basic `GetVacancies` function with single API call
4. Add TypeScript interfaces for JobTech API responses

### Phase 2: Taxonomy Integration (2 hours)
1. Build region mappings from Swedish municipality data
2. Create occupation mappings from `docs/occupation-groups.json`
3. Implement bidirectional lookup functions
4. Add validation for unknown region/occupation codes

### Phase 3: Response Aggregation (2 hours)
1. Implement `aggregateResponse` function with all filter scenarios
2. Handle edge cases (unknown codes, empty responses)
3. Add comprehensive error handling
4. Test with various filter combinations

### Phase 4: Pagination & Optimization (1 hour)
1. Implement pagination handling for large result sets
2. Add request caching and deduplication
3. Optimize for common queries
4. Add request timeout and retry logic

## Error Handling

### API Failures
```typescript
class JobTechAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public params: any
  ) {
    super(message);
  }
}

// Implement retry logic with exponential backoff
async function retryApiCall<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  // Implementation with exponential backoff
}
```

### Validation
```typescript
function validateParams(params: {
  month: string;
  region?: string;
  occupation?: string;
}): void {
  // Validate month format (YYYY-MM)
  // Validate region exists in mapping
  // Validate occupation exists in mapping
}
```

## Caching Strategy

### Cache Keys
```typescript
function getCacheKey(month: string, region?: string, occupation?: string): string {
  return `vacancies:${month}:${region || 'all'}:${occupation || 'all'}`;
}
```

### Cache Duration
- **Historical data**: 30 days (never changes)
- **Recent months**: 1 hour (may have late additions)
- **Failed requests**: 5 minutes (for retry logic)

## Testing Strategy

### Unit Tests
- Test month to date range conversion
- Test taxonomy mapping functions
- Test response aggregation logic
- Test pagination handling

### Integration Tests
- Test real API calls with various filter combinations
- Test caching behavior
- Test error handling and retries

## Performance Targets
- **Single month query**: < 500ms response time
- **Area chart (12 months)**: < 6 seconds total (12 sequential calls)
- **Cache hit ratio**: > 80% for popular combinations
- **Memory usage**: < 50MB for taxonomy mappings

## Success Criteria
1. **Correct data**: VacancyRecord accurately represents filtered vacancy counts
2. **All filter combinations**: Support no filters, region only, occupation only, both
3. **Reliable caching**: Long-term cache for historical data
4. **Error resilience**: Graceful handling of API failures and rate limits
5. **Performance**: Fast enough for real-time dashboard usage
6. **Type safety**: Full TypeScript coverage with proper API response types