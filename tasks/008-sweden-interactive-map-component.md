# Task 008: Sweden Interactive Map Component

## Goal

Replace the existing BarGraph "Jobb per Region" component with an interactive Sweden map visualization that displays regional job distribution using color-coded regions based on vacancy counts. The map will show varying degrees of blue color intensity based on job counts in each of Sweden's 21 regions.

## High Level Overview

Create a new map component that integrates seamlessly with the existing dashboard layout and filter system. The component will display a simplified SVG map of Sweden with regional boundaries, where each region is colored with blue intensity proportional to job vacancy counts. When filters are applied (region/occupation/date), the map will reflect the filtered data - showing only the selected region in blue when a specific region is filtered, or showing occupation-specific distribution across all regions when an occupation is filtered.

## Research Findings

### SVG Map Source
- SimpleMaps.com provides free Sweden SVG map (36.7 KB, optimized for web)
- Contains 21 Swedish regions (län) with unique IDs matching our existing region constants
- License: Free for commercial and personal use with attribution
- Mobile-friendly and performance optimized

### React Library
- React Simple Maps: Best suited library for choropleth maps with TypeScript support
- Integrates with d3-geo for geographic projections
- Declarative API that fits well with React patterns
- Lightweight and specifically designed for SVG choropleth visualizations

## Subtasks

### Subtask 1: Setup Dependencies and Map Data
**What needs to be done:** Install required npm packages and prepare the Sweden map data for use in the React component.

**Method signatures and data models:**
```typescript
// Install: react-simple-maps
// Download and prepare: Sweden regions TopoJSON/GeoJSON data
```

**Files to create:**
- `public/maps/sweden-regions.json` - Map data file with 21 Swedish regions

**Files to modify:**
- `package.json` - Add react-simple-maps dependency

### Subtask 2: Enhanced API Integration for Multi-Region Data
**What needs to be done:** Modify the API service to fetch individual regional data when no specific region filter is applied. The current API integration only returns aggregate data for all regions, but the map component requires individual job counts for each of the 21 Swedish regions.

**Critical Issue:** The existing `GetHistoricalVacanciesByRange()` function makes a single API call that returns total counts for all of Sweden when no region is specified. For the map visualization, we need individual counts for each region.

**Method signatures and data models:**
```typescript
async function GetHistoricalVacanciesByRegions(
  dateFrom: string,
  dateTo: string,
  occupation?: string
): Promise<VacancyRecord[]> // Returns 21 VacancyRecords, one per region

async function GetAllRegionsDataForMonth(
  month: string,
  occupation?: string
): Promise<VacancyRecord[]> // Fetches all 21 regions for specific month

function shouldFetchAllRegions(region?: string): boolean // Helper to determine fetch strategy
```

**Files to modify:**
- `src/services/jobtech-api.ts` - Add multi-region fetching functions with request throttling
- `src/types/vacancy-record.ts` - Ensure supports multi-region data structure

**Implementation requirements:**
- Make 21 parallel API calls (one per Swedish region) when region filter is undefined
- Implement request throttling to respect API rate limits
- Add comprehensive error handling for partial regional failures
- Maintain existing caching strategy (30-day cache per region)
- Add loading states for slower multi-region fetches

### Subtask 3: Create Map Data Transformation Logic
**What needs to be done:** Build functions to transform the enhanced VacancyRecord data (now with individual regional data) into a format suitable for map visualization, including color intensity calculations.

**Method signatures and data models:**
```typescript
interface RegionMapData {
  regionCode: string;      // "01", "12", etc. matching Swedish region IDs
  regionName: string;      // "Stockholms län", "Skåne län", etc.
  urlSlug: string;         // "stockholms-län" for URL routing
  jobCount: number;        // Raw number of job vacancies
  intensity: number;       // 0-1 scale for blue color intensity
}

function transformToMapChart(
  records: VacancyRecord[],
  currentRegion?: string
): RegionMapData[]

function calculateColorIntensity(
  jobCount: number,
  maxCount: number,
  minCount: number
): number

function aggregateRegionalData(
  records: VacancyRecord[]
): Record<string, number> // Sum job counts by region across time periods
```

**Files to create:**
- `src/lib/map-data-transformers.ts` - Data transformation functions
- `src/types/map-types.ts` - TypeScript interfaces for map data

### Subtask 4: Build Sweden Map Component
**What needs to be done:** Create the main interactive map component following the existing dashboard component patterns. The component should render Sweden's 21 regions with appropriate color coding and follow the same Card-based layout as other dashboard components.

**Method signatures and data models:**
```typescript
interface SwedenMapProps {
  data: RegionMapData[];
  currentRegion?: string;  // Currently selected region filter
  title?: string;
  description?: string;
}

export function SwedenMap({
  data,
  currentRegion,
  title = 'Jobb per Region',
  description = 'Geografisk fördelning av lediga jobb'
}: SwedenMapProps): JSX.Element
```

**Files to create:**
- `src/components/sweden-map.tsx` - Main map component

**Design requirements:**
- Follow existing Card component structure with CardHeader, CardTitle, CardDescription, CardContent
- Use transparent background for regions with no jobs
- Implement blue color gradient scaling (lighter to darker blue based on job counts)
- Add hover tooltips showing region name and job count
- Ensure mobile-first responsive design using existing Tailwind classes
- Handle loading states appropriately

### Subtask 5: Integrate Map Component into Dashboard
**What needs to be done:** Replace the existing BarGraph component in the dashboard layout with the new SwedenMap component, ensuring data flows correctly and the layout remains consistent.

**Method signatures and data models:**
```typescript
// In dashboard page:
const mapChartData = await GetHistoricalVacanciesByRegions(dateFrom, dateTo, occupation);
const transformedMapData = transformToMapChart(mapChartData, region);
```

**Files to modify:**
- `src/app/dashboard/vacancies/[[...filters]]/page.tsx` - Replace BarGraph with SwedenMap and update data fetching
- `src/lib/chart-data-transformers.ts` - Add export for map transformation function

**Integration requirements:**
- Replace BarGraph component at line ~238-242 in dashboard page
- Update data fetching logic to use new multi-region API function when needed
- Handle loading states for slower multi-region data fetching
- Maintain existing responsive grid layout structure
- Ensure proper TypeScript imports and component registration
- Add error handling for partial regional data failures

### Subtask 6: Implement Color Scaling and Visual Polish
**What needs to be done:** Fine-tune the visual appearance including color scaling algorithm, tooltips, and ensure consistency with existing design system.

**Visual requirements:**
- Use percentile-based color scaling for better visual distribution
- Implement CSS custom properties for blue gradient
- Add hover effects consistent with other dashboard components
- Ensure accessibility with proper contrast ratios
- Handle edge cases (zero jobs, single region with jobs, etc.)

**Files to modify:**
- `src/components/sweden-map.tsx` - Add final styling and color scaling
- Add appropriate CSS custom properties if needed

## Expected Behavior

### Default View (All Regions, All Jobs)
- Show all 21 Swedish regions with blue intensity based on total job counts in selected time period
- Regions with more jobs appear in darker blue
- Regions with fewer jobs appear in lighter blue
- Regions with zero jobs remain transparent/white

### Region Filtered View
- When a specific region is selected, only that region appears in blue
- All other regions remain white/transparent as visual indicators
- Blue intensity represents the job count within that filtered region

### Occupation Filtered View
- When a specific occupation is selected but region is "All"
- Show distribution of that occupation type across all regions
- Blue intensity represents count of that specific occupation by region

### Combined Filter View
- When both region and occupation are filtered
- Only the selected region appears in blue
- Blue intensity represents the count of that occupation in that region

## Acceptance Criteria

- Map displays all 21 Swedish regions with correct boundaries
- Color intensity accurately reflects job vacancy counts
- Component follows existing Card-based styling patterns
- Hover tooltips show region name and job count
- Mobile-responsive design matches other dashboard components
- Integration works correctly with existing filter system
- Performance is acceptable (smooth rendering, no lag)
- Replaces BarGraph component in exact same grid position
- All Swedish text labels and descriptions
- Handles loading and error states gracefully

## Files to Create

- `public/maps/sweden-regions.json` - Sweden map data
- `src/components/sweden-map.tsx` - Main map component
- `src/lib/map-data-transformers.ts` - Data transformation utilities
- `src/types/map-types.ts` - TypeScript interfaces

## Files to Modify

- `package.json` - Add react-simple-maps dependency
- `src/app/dashboard/vacancies/[[...filters]]/page.tsx` - Replace BarGraph with SwedenMap
- `src/lib/chart-data-transformers.ts` - Export map transformation function

## Dependencies to Add

- `react-simple-maps` - For SVG map rendering and choropleth functionality

## Technical Notes

- Use SimpleMaps.com Sweden SVG data with proper attribution
- Implement percentile-based color scaling for optimal visual distribution
- Follow existing component patterns for consistency
- Ensure TypeScript strict mode compliance
- Test with various filter combinations to ensure correct behavior
- Mobile-first responsive design using existing Tailwind patterns

### Performance Considerations
- **API Calls**: When showing "all regions", component requires 21 parallel API calls instead of 1
- **Caching**: Existing 30-day cache strategy will help mitigate performance impact
- **Rate Limiting**: Implement request throttling to respect JobTech API limits
- **Loading States**: Add appropriate loading indicators for multi-region data fetching
- **Error Handling**: Handle partial failures gracefully (some regions may fail to load)
- **Memory Usage**: Increased data volume when fetching all regional data simultaneously

### API Integration Strategy
- **Smart Fetching**: Only use multi-region API calls when no specific region is filtered
- **Fallback Behavior**: If multi-region fetch fails, show error state with option to retry
- **Throttling**: Implement configurable delay between regional API calls if needed
- **Monitoring**: Add logging to track API call performance and failure rates

## Next Steps

After completion, this component will provide a more intuitive geographic visualization of Swedish job market data, replacing the current bar chart with an interactive map that clearly shows regional employment distribution patterns.