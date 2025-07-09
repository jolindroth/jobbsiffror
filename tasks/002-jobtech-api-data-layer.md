# Task 002: Build Static Data Mappings

## Goal

Create the lookup tables and mapping functions that convert between friendly URL names (like "stockholm", "systemutvecklare") and API taxonomy codes.

## What You'll Build

- Swedish region mappings
- Occupation group mappings from existing JSON file
- Bidirectional lookup functions

## Steps

### 1. Extract Occupation Groups

**File**: `src/constants/occupation-groups.ts`

```typescript
// Extract data from docs/occupation-groups.json
export const OCCUPATION_GROUPS = [
  { id: '110', name: 'Officerare', urlSlug: 'officerare' },
  { id: '1111', name: 'Politiker', urlSlug: 'politiker' },
  { id: '2512', name: 'Systemutvecklare', urlSlug: 'systemutvecklare' }
  // ... extract all from JSON file
];

export const OCCUPATION_TO_CODE: Record<string, string> = {
  officerare: '110',
  politiker: '1111',
  systemutvecklare: '2512'
  // ... generate from OCCUPATION_GROUPS
};

export const CODE_TO_OCCUPATION: Record<string, string> = {
  '110': 'officerare',
  '1111': 'politiker',
  '2512': 'systemutvecklare'
  // ... reverse mapping
};
```

### 2. Create Swedish Region Mappings

**File**: `src/constants/swedish-regions.ts`

```typescript
// Swedish regions with their codes (using major cities/counties as regions)
export const SWEDISH_REGIONS = [
  { code: '01', name: 'Stockholm', urlSlug: 'stockholm' },
  { code: '14', name: 'Västra Götaland', urlSlug: 'vastra-gotaland' },
  { code: '12', name: 'Skåne', urlSlug: 'skane' },
  { code: '03', name: 'Uppsala', urlSlug: 'uppsala' },
  { code: '04', name: 'Södermanland', urlSlug: 'sodermanland' }
  // ... add all 21 Swedish counties (län)
];

export const REGION_TO_CODE: Record<string, string> = {
  stockholm: '01',
  'vastra-gotaland': '14',
  skane: '12',
  uppsala: '03',
  sodermanland: '04'
  // ... generate from SWEDISH_REGIONS
};

export const CODE_TO_REGION: Record<string, string> = {
  '01': 'stockholm',
  '14': 'vastra-gotaland',
  '12': 'skane',
  '03': 'uppsala',
  '04': 'sodermanland'
  // ... reverse mapping
};
```

### 3. Create Lookup Functions

**File**: `src/lib/taxonomy-mappings.ts`

```typescript
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
```

### 4. Update Main Service to Use Mappings

**File**: `src/services/jobtech-api.ts` (update existing)

```typescript
import { getOccupationCode, getRegionCode } from '@/lib/taxonomy-mappings';

// Replace placeholder functions with real mappings
function getRegionCode(region: string): string {
  const code = getRegionCode(region);
  if (!code) {
    throw new Error(`Unknown region: ${region}`);
  }
  return code;
}

function getOccupationCode(occupation: string): string {
  const code = getOccupationCode(occupation);
  if (!code) {
    throw new Error(`Unknown occupation: ${occupation}`);
  }
  return code;
}
```

### 5. Update GetVacancies to Use Real Mappings

**File**: `src/services/jobtech-api.ts` (update existing functions)

```typescript
import {
  getOccupationCode as getOccupationCodeFromSlug,
  getRegionCode as getRegionCodeFromSlug
} from '@/lib/taxonomy-mappings';

// Update the placeholder functions to use real mappings
function getRegionCode(region: string): string {
  const code = getRegionCodeFromSlug(region);
  if (!code) {
    throw new Error(`Unknown region: ${region}`);
  }
  return code;
}

function getOccupationCode(occupation: string): string {
  const code = getOccupationCodeFromSlug(occupation);
  if (!code) {
    throw new Error(`Unknown occupation: ${occupation}`);
  }
  return code;
}

// Note: No complex transformResponse function needed!
// The API provides pre-aggregated totals via data.total.value
// GetVacancies simply returns:
// {
//   month,
//   region: region || 'all',
//   occupation: occupation || 'all',
//   count: data.total.value
// }
```

### 6. Add Tests

**File**: `src/lib/__tests__/taxonomy-mappings.test.ts`

```typescript
import {
  getOccupationCode,
  getOccupationName,
  getRegionCode,
  getRegionName,
  validateOccupation,
  validateRegion
} from '../taxonomy-mappings';

describe('taxonomy mappings', () => {
  it('should map occupation names to codes', () => {
    expect(getOccupationCode('systemutvecklare')).toBe('2512');
    expect(getOccupationCode('unknown')).toBeNull();
  });

  it('should map region names to codes', () => {
    expect(getRegionCode('stockholm')).toBe('0180');
    expect(getRegionCode('unknown')).toBeNull();
  });

  it('should validate occupation names', () => {
    expect(validateOccupation('systemutvecklare')).toBe(true);
    expect(validateOccupation('invalid')).toBe(false);
  });
});
```

## Data Sources

### Occupation Groups

Extract from existing file: `docs/occupation-groups.json`

- Parse JSON array of `{id, name}` objects
- Generate URL-friendly slugs (lowercase, replace spaces with dashes)
- Create bidirectional mappings

### Swedish Regions

Use Swedish county (län) codes:

- 21 counties total
- Each has unique 2-digit code
- Counties represent the regional level we need

## Acceptance Criteria

- [ ] All occupation groups from JSON file are mapped with URL slugs
- [ ] All 21 Swedish counties (regions) have mappings
- [ ] Bidirectional lookup functions work correctly
- [ ] Validation functions return correct boolean values
- [ ] GetVacancies service uses real mappings instead of placeholders
- [ ] Unit tests pass for all mapping functions
- [ ] No complex aggregation logic needed (API provides totals)

## Files Created/Updated

- `src/constants/occupation-groups.ts` (new)
- `src/constants/swedish-regions.ts` (new)
- `src/lib/taxonomy-mappings.ts` (new)
- `src/services/jobtech-api.ts` (updated)
- `src/lib/__tests__/taxonomy-mappings.test.ts` (new)

## Next Steps

After this task:

- Task 003 will extract and migrate dashboard components
- Task 004 will create the URL routing structure
- Task 005 will build the client filter components
