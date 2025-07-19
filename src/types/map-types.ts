export interface RegionMapData {
  regionCode: string; // "01", "12", etc. matching Swedish region IDs
  regionName: string; // "Stockholms län", "Skåne län", etc.
  urlSlug: string; // "stockholms-län" for URL routing
  jobCount: number; // Raw number of job vacancies
  intensity: number; // 0-1 scale for blue color intensity
}

export interface SwedenMapProps {
  data: RegionMapData[];
  currentRegion?: string; // Currently selected region filter
  title?: string;
  description?: string;
}

// Leaflet-specific style object for choropleth coloring
export interface LeafletStyleOptions {
  fillColor: string;
  weight: number;
  opacity: number;
  color: string;
  dashArray?: string;
  fillOpacity: number;
}

// GeoJSON feature properties from our Sweden regions data
export interface SwedenGeoJSONProperties {
  name: string; // Region name in Swedish
  color: number; // Color category from source data
  l_id: number; // Region ID (1-25, matches our region codes)
}
