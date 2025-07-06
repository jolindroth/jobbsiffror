// Import data from JSON file
import regionsData from './regions.json';

// Helper function to create URL-friendly slugs
function createUrlSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[é]/g, 'e')
    .replace(/\s+län$/i, '') // Remove "län" suffix
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Generate Swedish regions with URL slugs
export const SWEDISH_REGIONS = regionsData.map((region) => ({
  code: region.id,
  name: region.name,
  urlSlug: createUrlSlug(region.name)
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
