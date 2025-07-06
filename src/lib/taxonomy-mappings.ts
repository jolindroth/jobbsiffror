import {
  OCCUPATION_TO_CODE,
  CODE_TO_OCCUPATION
} from '@/constants/occupation-groups';
import { REGION_TO_CODE, CODE_TO_REGION } from '@/constants/swedish-regions';

export function getOccupationCode(urlSlug: string): string | null {
  return OCCUPATION_TO_CODE[urlSlug] || null;
}

export function getOccupationName(code: string): string | null {
  return CODE_TO_OCCUPATION[code] || null;
}

export function getRegionCode(urlSlug: string): string | null {
  return REGION_TO_CODE[urlSlug] || null;
}

export function getRegionName(code: string): string | null {
  return CODE_TO_REGION[code] || null;
}

export function validateOccupation(urlSlug: string): boolean {
  return urlSlug in OCCUPATION_TO_CODE;
}

export function validateRegion(urlSlug: string): boolean {
  return urlSlug in REGION_TO_CODE;
}
