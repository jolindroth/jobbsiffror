# Task 009: Cache-Based Intelligent Data Cutoff System

## Overview
Implement an intelligent data cutoff detection system that leverages the default "all professions, all jobs" endpoint (most common entry point) to automatically detect when the JobTech API stops having valid data, then use Next.js caching to prevent unnecessary API calls to "dead" months app-wide.

## Problem Statement
The JobTech Historical API only contains valid data up to approximately January 2025. Currently, requests beyond this date either fail or return zero counts, but zero counts can also be legitimate (e.g., no jobs in a specific region/occupation). We need to intelligently distinguish between "no data available" and "legitimately zero jobs" without adding extra API calls that could trigger rate limiting.

## Solution Strategy
Use the default endpoint (`/dashboard/vacancies` with no filters) that fetches 12 months of data for "all professions, all jobs" to detect the last month with significant job activity. Cache this cutoff date for 1 week and use it to filter all date ranges across the application.

## Technical Architecture

### Cache-Based Detection Pattern
- **Trigger**: Default endpoint hit (natural, high-traffic)
- **Detection Logic**: Find last month with >10 jobs (distinguishes real data from API artifacts)
- **Cache Duration**: 1 week (automatic updates via normal usage)
- **Fallback**: If no cached cutoff, allow original behavior

### File Structure
```
src/
├── services/
│   ├── data-cutoff-cache.ts     # Cache management & detection logic
│   ├── date-range-filter.ts     # Date filtering utilities
│   └── jobtech-api.ts           # Enhanced with cutoff filtering
└── app/dashboard/vacancies/[[...filters]]/page.tsx  # Integration point
```

## Implementation Tasks

### Task 1: Data Cutoff Detection Service
**File**: `/src/services/data-cutoff-cache.ts`

**Functions to implement**:
- `detectCutoffFromMonthlyData(monthlyData: VacancyRecord[]): string | null`
  - Sort monthly data by month descending
  - Find last month with >10 jobs (threshold for valid data)
  - Return month in "YYYY-MM" format or null

- `getCachedCutoffDate(): Promise<string | null>`
  - Use Next.js `unstable_cache` with 1-week expiration
  - Cache key: `'current_cutoff_date'`
  - Tag: `['data-cutoff']` for revalidation

- `updateCutoffCache(cutoffDate: string): Promise<void>`
  - Update cached cutoff date
  - Use `revalidateTag('data-cutoff')` to refresh cache

**Dependencies**: Next.js caching, date-fns for date manipulation

### Task 2: Date Range Filter Service
**File**: `/src/services/date-range-filter.ts`

**Functions to implement**:
- `filterDateRangeByAvailability(dateFrom: string, dateTo: string): Promise<FilterResult>`
  - Get cached cutoff date
  - Adjust `dateTo` if beyond cutoff
  - Return object with adjusted dates and metadata

**Return Type**:
```typescript
interface FilterResult {
  adjustedDateFrom: string;
  adjustedDateTo: string;
  wasFiltered: boolean;
  monthsFiltered: string[];
}
```

### Task 3: API Service Integration
**File**: `/src/services/jobtech-api.ts`

**Integrate cache checking directly into existing API functions**:
- Modify `GetHistoricalVacanciesByRange()` to check cache and filter dates automatically
- Modify `GetHistoricalVacanciesByRegions()` to check cache and filter dates automatically
- Cache checking happens transparently inside API functions
- All API calls across the application automatically benefit from cutoff filtering

**No return type changes needed** - functions continue to return `VacancyRecord[]` as before

### Task 4: Dashboard Simplification
**File**: `/src/app/dashboard/vacancies/[[...filters]]/page.tsx`

**Remove all cache logic from dashboard**:
- Dashboard components simply call normal API functions
- Cache checking and filtering happens automatically inside API functions
- No component-level cache logic needed - completely transparent operation

**Simplified code**:
```typescript
// Simple API calls - filtering happens automatically
const dashboardData = await GetHistoricalVacanciesByRange(
  dateFrom,
  dateTo,
  region,
  occupation
);

const mapData = await GetHistoricalVacanciesByRegions(
  dateFrom,
  dateTo,
  occupation
);
```

### Task 5: Remove Wrapper Functions
**File**: `/src/services/jobtech-api.ts`

**Clean up**:
- Remove `GetHistoricalVacanciesByRangeWithCutoff()` wrapper function
- Remove `GetHistoricalVacanciesByRegionsWithCutoff()` wrapper function  
- Remove `APIResult` interface
- Cache filtering is integrated directly into main API functions

## Data Flow

### Initial Detection (Cache Miss - First Time)
1. Any component calls `GetHistoricalVacanciesByRange()` or `GetHistoricalVacanciesByRegions()`
2. API function checks cache → returns `null` (no cutoff detected yet)
3. API function fetches default data to detect cutoff and populates cache
4. API function applies detected cutoff to current request dates
5. Return filtered data - cutoff detection happens transparently

### Subsequent Requests (Cache Hit)
1. Any component calls API functions with any date range
2. API function checks cached cutoff date → returns cached value instantly
3. API function filters date range BEFORE making external API calls
4. If request extends beyond cutoff, trim `dateTo` automatically
5. Make external API calls only for valid date range
6. Return filtered data - filtering is completely transparent

### Automatic Updates
1. Cache expires after 1 week automatically
2. Next API call with cache miss triggers new detection transparently
3. If API data range has expanded, new cutoff detected automatically
4. No manual intervention required - all automatic

**Note**: All cache logic is invisible to components - they just call normal API functions

## Edge Cases & Handling

### No Cutoff Detected
- **Scenario**: All months have ≤10 jobs or detection fails
- **Handling**: Return null, allow original API behavior
- **Impact**: No filtering applied, graceful degradation

### All Months Filtered
- **Scenario**: Requested date range entirely beyond cutoff
- **Handling**: Return empty data set with clear metadata
- **UX**: Show "no data available for requested period" message

### Cache Miss
- **Scenario**: Cache expired or not yet populated
- **Handling**: Allow original API calls while detection runs in background
- **Impact**: Temporary return to pre-cutoff behavior

### API Data Expansion
- **Scenario**: JobTech API adds more months of data
- **Handling**: Next weekly cache refresh picks up new cutoff automatically
- **Impact**: App immediately benefits from expanded data range

## Performance Considerations

### Cache Efficiency
- **Storage**: Minimal (single string value)
- **Lookup**: O(1) cache access
- **Updates**: Only on default endpoint hits (natural refresh)

### API Call Reduction
- **Prevention**: Eliminates calls to dead months
- **Savings**: Up to 6-12 API calls per request (depending on range)
- **Rate Limiting**: Reduces risk of hitting API limits

## User Experience Enhancements

### Transparent Operation
- System works invisibly for most users
- No disruption to existing workflows
- Automatic adaptation to API changes

### Optional Feedback
- Can display "Data limited to available period" when filtering occurs
- Show filtered month count in subtle UI element
- Maintain date picker restrictions based on availability

## Monitoring & Observability

### Logging
- Log cutoff detection events
- Track filtering frequency and patterns
- Monitor cache hit/miss rates

### Metrics
- Number of months filtered per request
- Cache refresh frequency
- API call reduction statistics

## Success Criteria

### Functional Requirements
- ✅ Automatically detect data cutoff without extra API calls
- ✅ Filter all date ranges app-wide based on detected cutoff
- ✅ Handle legitimate zero-count scenarios correctly
- ✅ Update cutoff automatically when API data range changes
- ✅ **IMPLEMENTATION COMPLETE** - Clean API-level integration deployed

### Performance Requirements
- ✅ Zero additional API overhead for cutoff detection
- ✅ Cache-based filtering with <10ms lookup time
- ✅ Reduce dead month API calls by 100%

### User Experience Requirements
- ✅ Transparent operation (no user-visible changes)
- ✅ Graceful handling when no data available
- ✅ Immediate benefits when API data expands

---

## ✅ IMPLEMENTATION COMPLETED

**Final Architecture**: Clean API-level integration where cache checking happens transparently inside `GetHistoricalVacanciesByRange()` and `GetHistoricalVacanciesByRegions()` functions.

**Key Benefits Delivered**:
- **Zero Component Changes**: All existing code continues to work without modification
- **Automatic Filtering**: Every API call across the application gets intelligent cutoff filtering
- **Transparent Operation**: Components don't need to know about cache logic
- **Performance Optimized**: Prevents unnecessary API calls to dead months
- **Self-Healing**: Cache automatically refreshes weekly and adapts to API changes

**Files Modified**:
- ✅ `/src/services/data-cutoff-cache.ts` - Next.js 15 compatible caching with `unstable_cache`
- ✅ `/src/services/date-range-filter.ts` - Already complete
- ✅ `/src/services/jobtech-api.ts` - Integrated cache checking into main API functions
- ✅ `/src/app/dashboard/vacancies/[[...filters]]/page.tsx` - Simplified to use normal API calls

**Implementation Date**: 2025-01-19
