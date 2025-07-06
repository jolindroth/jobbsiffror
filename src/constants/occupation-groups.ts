// Import data from JSON file
import occupationGroupsData from './occupation-groups.json';

// Helper function to create URL-friendly slugs
function createUrlSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[é]/g, 'e')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Generate occupation groups with URL slugs
export const OCCUPATION_GROUPS = occupationGroupsData.map((group) => ({
  id: group.id,
  name: group.name,
  urlSlug: createUrlSlug(group.name)
}));

// Generate mappings from the occupation groups array
export const OCCUPATION_TO_CODE: Record<string, string> =
  OCCUPATION_GROUPS.reduce(
    (acc, group) => {
      acc[group.urlSlug] = group.id;
      return acc;
    },
    {} as Record<string, string>
  );

export const CODE_TO_OCCUPATION: Record<string, string> =
  OCCUPATION_GROUPS.reduce(
    (acc, group) => {
      acc[group.id] = group.urlSlug;
      return acc;
    },
    {} as Record<string, string>
  );

// Helper functions to find occupations
export function getOccupationBySlug(slug: string) {
  return OCCUPATION_GROUPS.find((group) => group.urlSlug === slug);
}

export function getOccupationById(id: string) {
  return OCCUPATION_GROUPS.find((group) => group.id === id);
}
