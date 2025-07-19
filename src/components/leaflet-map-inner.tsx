'use client';

import { MapContainer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RegionMapData } from '@/types/map-types';
import {
  getLeafletStyle,
  getLeafletHoverStyle,
  getSelectedRegionStyle,
  mapGeoJSONToRegionData
} from '@/lib/map-data-transformers';

interface LeafletMapInnerProps {
  data: RegionMapData[];
  geoJsonData: any;
  currentRegion?: string;
}

export default function LeafletMapInner({
  data,
  geoJsonData,
  currentRegion
}: LeafletMapInnerProps) {
  // Create a lookup map for quick data access
  const dataLookup = data.reduce(
    (acc, item) => {
      acc[item.regionCode] = item;
      return acc;
    },
    {} as Record<string, RegionMapData>
  );

  // Style function for GeoJSON features
  const style = (feature: any) => {
    if (!feature?.properties?.l_id) {
      return getLeafletStyle(0); // Default style for missing data
    }

    // Map GeoJSON l_id to our region data
    const regionMapping = mapGeoJSONToRegionData(feature.properties.l_id);
    if (!regionMapping) {
      return getLeafletStyle(0);
    }

    // Get the data for this region
    const regionData = dataLookup[regionMapping.code];
    const intensity = regionData?.intensity || 0;

    // Check if this region is selected (in single-region mode)
    const isSelectedRegion =
      currentRegion && regionMapping.urlSlug === currentRegion;

    if (isSelectedRegion) {
      return getSelectedRegionStyle(intensity);
    } else {
      return getLeafletStyle(intensity);
    }
  };

  // Hover and interaction handlers
  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (!feature?.properties?.l_id) return;

    const regionMapping = mapGeoJSONToRegionData(feature.properties.l_id);
    if (!regionMapping) return;

    const regionData = dataLookup[regionMapping.code];

    // Check if this region should be interactive
    const isMultiRegionMode = !currentRegion || currentRegion === 'all';
    const isSelectedRegion =
      currentRegion && regionMapping.urlSlug === currentRegion;
    const shouldBeInteractive = isMultiRegionMode || isSelectedRegion;

    // Only add tooltips and hover effects for interactive regions
    if (shouldBeInteractive) {
      // Create tooltip content
      const tooltipContent = `
        <div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <strong style="font-size: 14px; color: #1f2937;">${regionMapping.name}</strong><br/>
          <span style="font-size: 12px; color: #6b7280;">
            ${regionData ? `${regionData.jobCount.toLocaleString('sv-SE')} lediga jobb` : 'Ingen data'}
          </span>
        </div>
      `;

      // Bind tooltip
      layer.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      });

      // Hover effects
      layer.on({
        mouseover: (e) => {
          const target = e.target;
          const regionData = dataLookup[regionMapping.code];
          const intensity = regionData?.intensity || 0;
          const hoverStyle = getLeafletHoverStyle(intensity);
          target.setStyle(hoverStyle);
        },
        mouseout: (e) => {
          const target = e.target;
          // Reset to original style
          const originalStyle = style(feature);
          target.setStyle(originalStyle);
        }
      });
    }
  };

  // Sweden viewport configuration - optimized for vertical shape
  const swedenCenter: [number, number] = [62.5, 16.0]; // Center of Sweden, slightly adjusted
  const swedenZoom = 5.2; // Slightly closer for better fit

  return (
    <div className='h-full w-full'>
      <MapContainer
        center={swedenCenter}
        zoom={swedenZoom}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => {}}
        className='leaflet-container'
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        keyboard={false}
        boxZoom={false}
      >
        {/* No tile layer needed for choropleth - just the GeoJSON */}
        <GeoJSON
          data={geoJsonData}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: transparent !important;
          cursor: default !important;
        }

        /* Remove focus outlines and selection boxes */
        .leaflet-interactive:focus {
          outline: none !important;
        }

        .leaflet-interactive {
          cursor: default !important;
        }

        .custom-tooltip {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          padding: 8px !important;
        }

        .custom-tooltip::before {
          border-top-color: #e5e7eb !important;
        }

        .leaflet-tooltip-top .custom-tooltip::before {
          border-top-color: #e5e7eb !important;
        }

        /* Remove zoom control styles since controls are disabled */
      `}</style>
    </div>
  );
}
