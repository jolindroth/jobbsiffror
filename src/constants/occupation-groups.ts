// Import data from JSON file
import occupationGroupsData from './occupation-groups.json';

// Occupation groups with explicit URL slugs from JSON
export const OCCUPATION_GROUPS = occupationGroupsData.map((group) => ({
  id: group.id,
  name: group.name,
  urlSlug: group.urlSlug
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
