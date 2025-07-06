// Type definitions for taxonomy data structures

export interface RegionData {
  id: string;
  name: string;
  urlSlug: string;
}

export interface OccupationGroupData {
  id: string;
  name: string;
  urlSlug: string;
}

export interface Region {
  code: string;
  name: string;
  urlSlug: string;
}

export interface OccupationGroup {
  id: string;
  name: string;
  urlSlug: string;
}
