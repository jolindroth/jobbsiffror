import { validateRegion, validateOccupation } from '@/lib/taxonomy-mappings';

export interface ParsedFilters {
  region?: string;
  occupation?: string;
}

export function parseFilters(filters: string[] | undefined): ParsedFilters {
  const result: ParsedFilters = {};

  if (!filters || filters.length === 0) {
    return result;
  }

  // URL patterns:
  // /vacancies/stockholm → region only
  // /vacancies/systemutvecklare → occupation only
  // /vacancies/stockholm/systemutvecklare → both

  if (filters.length === 1) {
    const filter = filters[0];

    // Check if it's a region or occupation using our validation functions
    if (validateRegion(filter)) {
      result.region = filter;
    } else if (validateOccupation(filter)) {
      result.occupation = filter;
    }
  } else if (filters.length === 2) {
    // Assume first is region, second is occupation
    const [possibleRegion, possibleOccupation] = filters;

    if (validateRegion(possibleRegion)) {
      result.region = possibleRegion;
    }

    if (validateOccupation(possibleOccupation)) {
      result.occupation = possibleOccupation;
    }
  }

  return result;
}
