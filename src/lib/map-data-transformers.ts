import { VacancyRecord } from '@/types/vacancy-record';
import { RegionMapData } from '@/types/map-types';
import { SWEDISH_REGIONS, getRegionByCode } from '@/constants/swedish-regions';

// Transform VacancyRecord[] to RegionMapData[] for map visualization
export function transformToMapChart(records: VacancyRecord[]): RegionMapData[] {
  // Aggregate job counts by region across all time periods
  const regionTotals = aggregateRegionalData(records);

  // Get min and max for color intensity calculation
  const jobCounts = Object.values(regionTotals);
  const maxCount = Math.max(...jobCounts, 1); // Avoid division by zero
  const minCount = Math.min(...jobCounts);

  // Transform each Swedish region into RegionMapData
  return SWEDISH_REGIONS.map((region) => {
    const jobCount = regionTotals[region.urlSlug] || 0;
    const intensity = calculateColorIntensity(jobCount, maxCount, minCount);

    return {
      regionCode: region.code,
      regionName: region.name,
      urlSlug: region.urlSlug,
      jobCount,
      intensity
    };
  });
}

// Aggregate job counts by region across all time periods
export function aggregateRegionalData(
  records: VacancyRecord[]
): Record<string, number> {
  return records.reduce(
    (acc, record) => {
      // Skip records without region or with 'all' region
      if (!record.region || record.region === 'all') return acc;

      acc[record.region] = (acc[record.region] || 0) + record.count;
      return acc;
    },
    {} as Record<string, number>
  );
}

// Calculate color intensity using full range scaling (0-1)
export function calculateColorIntensity(
  jobCount: number,
  maxCount: number,
  minCount: number
): number {
  // Handle edge cases
  if (jobCount === 0) return 0;
  if (maxCount === minCount) return 0.5; // All regions have same count

  // Full range scaling: lightest region = lightest blue, highest region = darkest blue
  const intensity = (jobCount - minCount) / (maxCount - minCount);

  // Ensure intensity is between 0 and 1
  return Math.max(0, Math.min(1, intensity));
}

// Helper function to map GeoJSON l_id to our region data
export function mapGeoJSONToRegionData(
  geoJsonLId: number
): { code: string; urlSlug: string; name: string } | null {
  // The GeoJSON l_id corresponds to our region code (as number)
  const regionCode = geoJsonLId.toString().padStart(2, '0');
  const region = getRegionByCode(regionCode);

  if (!region) {
    console.warn(`No region found for l_id: ${geoJsonLId}`);
    return null;
  }

  return {
    code: regionCode,
    urlSlug: region.urlSlug,
    name: region.name
  };
}

// Generate Leaflet style object based on intensity
export function getLeafletStyle(intensity: number) {
  // Enhanced blue color scale using CSS custom properties for consistency
  const fillColor =
    intensity === 0
      ? 'transparent'
      : `hsl(217, 91%, ${Math.round(70 - intensity * 30)}%)`; // HSL for better color transitions

  const borderColor = 'hsl(217, 91%, 50%)'; // Slightly darker border for better definition

  return {
    fillColor,
    weight: 1,
    opacity: 0.7,
    color: borderColor,
    fillOpacity: intensity === 0 ? 0 : 0.5 + intensity * 0.3, // Slightly more subtle fill
    dashArray: undefined
  };
}

// Alternative style for hover effects - emphasize borders
export function getLeafletHoverStyle(intensity: number) {
  return {
    ...getLeafletStyle(intensity),
    weight: 3, // Thicker border for clear hover indication
    opacity: 1,
    color: 'hsl(217, 91%, 35%)', // Darker border color on hover
    fillOpacity: intensity === 0 ? 0 : 0.6 + intensity * 0.2 // Slightly more visible fill
  };
}

// Style for selected region (when single region is filtered)
export function getSelectedRegionStyle(intensity: number) {
  return {
    ...getLeafletStyle(intensity),
    weight: 2, // Slightly thicker border to show selection
    opacity: 1,
    color: 'hsl(217, 91%, 40%)', // Darker border for selected region
    fillOpacity: intensity === 0 ? 0.3 : 0.7 + intensity * 0.2, // More prominent fill
    dashArray: undefined
  };
}
