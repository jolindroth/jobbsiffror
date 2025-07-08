import { validateRegion, validateOccupation } from '@/lib/taxonomy-mappings';

export interface ParsedFilters {
  invalid?: boolean;
  region?: string;
  occupation?: string;
}

export function parseFilters(filters: string[] | undefined): ParsedFilters {
  const result: ParsedFilters = { invalid: true };

  const decodedFilters = filters?.map((filter) => decodeURIComponent(filter));
  if (!decodedFilters || decodedFilters.length === 0) {
    result.invalid = false;
    return result;
  }

  // URL patterns:
  // /vacancies/stockholm → region only
  // /vacancies/systemutvecklare → occupation only
  // /vacancies/stockholm/systemutvecklare → both

  if (decodedFilters.length === 1) {
    const filter = decodedFilters[0];

    // Check if it's a region or occupation using our validation functions
    if (validateRegion(filter)) {
      result.region = filter;
      result.invalid = false;
    } else if (validateOccupation(filter)) {
      result.occupation = filter;
      result.invalid = false;
    }
  } else if (decodedFilters.length === 2) {
    // Assume first is region, second is occupation
    const [possibleRegion, possibleOccupation] = decodedFilters;

    if (validateRegion(possibleRegion)) {
      result.region = possibleRegion;
      result.invalid = false;
    }

    if (validateOccupation(possibleOccupation)) {
      result.occupation = possibleOccupation;
      result.invalid = false;
    }
  }

  return result;
}
