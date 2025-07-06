// Import data from JSON file
import regionsData from './regions.json';

// Swedish regions with explicit URL slugs from JSON
export const SWEDISH_REGIONS = regionsData.map((region) => ({
  code: region.id,
  name: region.name,
  urlSlug: region.urlSlug
}));

// Generate mappings from the regions array
export const REGION_TO_CODE: Record<string, string> = SWEDISH_REGIONS.reduce(
  (acc, region) => {
    acc[region.urlSlug] = region.code;
    return acc;
  },
  {} as Record<string, string>
);

export const CODE_TO_REGION: Record<string, string> = SWEDISH_REGIONS.reduce(
  (acc, region) => {
    acc[region.code] = region.urlSlug;
    return acc;
  },
  {} as Record<string, string>
);

// Helper functions to find regions
export function getRegionBySlug(slug: string) {
  return SWEDISH_REGIONS.find((region) => region.urlSlug === slug);
}

export function getRegionByCode(code: string) {
  return SWEDISH_REGIONS.find((region) => region.code === code);
}
