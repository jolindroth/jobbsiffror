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
    expect(getOccupationCode('mjukvaru-systemutvecklare')).toBe('2512');
    expect(getOccupationCode('politiker')).toBe('1111');
    expect(getOccupationCode('unknown')).toBeNull();
  });

  it('should map occupation codes to names', () => {
    expect(getOccupationName('2512')).toBe('mjukvaru-systemutvecklare');
    expect(getOccupationName('1111')).toBe('politiker');
    expect(getOccupationName('unknown')).toBeNull();
  });

  it('should map region names to codes', () => {
    expect(getRegionCode('stockholms-län')).toBe('01');
    expect(getRegionCode('skåne-län')).toBe('12');
    expect(getRegionCode('unknown')).toBeNull();
  });

  it('should map region codes to names', () => {
    expect(getRegionName('01')).toBe('stockholms-län');
    expect(getRegionName('12')).toBe('skåne-län');
    expect(getRegionName('unknown')).toBeNull();
  });

  it('should validate occupation names', () => {
    expect(validateOccupation('mjukvaru-systemutvecklare')).toBe(true);
    expect(validateOccupation('politiker')).toBe(true);
    expect(validateOccupation('invalid')).toBe(false);
  });

  it('should validate region names', () => {
    expect(validateRegion('stockholms-län')).toBe(true);
    expect(validateRegion('skåne-län')).toBe(true);
    expect(validateRegion('invalid')).toBe(false);
  });
});
