'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { RegionMapData } from '@/types/map-types';

// Dynamic import for Leaflet map (client-side only)
const LeafletMapInner = dynamic(() => import('./leaflet-map-inner'), {
  ssr: false,
  loading: () => (
    <div className='flex h-full items-center justify-center'>
      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
        <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
        Laddar karta...
      </div>
    </div>
  )
});

interface SwedenMapProps {
  data: RegionMapData[];
  currentRegion?: string;
  title?: string;
  description?: string;
}

export function SwedenMap({
  data,
  currentRegion,
  title = 'Jobb per Region',
  description = 'Geografisk fördelning av lediga jobb'
}: SwedenMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/maps/sweden-regions.geojson');

        if (!response.ok) {
          throw new Error(`Failed to load map data: ${response.status}`);
        }

        const geoJson = await response.json();
        setGeoJsonData(geoJson);
        setError(null);
      } catch (err) {
        console.error('Error loading GeoJSON data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load map data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      loadGeoJsonData();
    }
  }, [isClient]);

  // Calculate summary statistics for the current data
  const totalJobs = data.reduce((sum, region) => sum + region.jobCount, 0);
  const regionsWithJobs = data.filter((region) => region.jobCount > 0).length;

  return (
    <Card className='@container/card h-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex h-full flex-col px-2 pt-4 sm:px-6 sm:pt-6'>
        <div className='aspect-[4/6] min-h-0 flex-1'>
          {!isClient ? (
            // SSR fallback
            <div className='flex h-full items-center justify-center'>
              <div className='text-muted-foreground text-center text-sm'>
                <div className='bg-muted mx-auto mb-2 h-4 w-4 animate-pulse rounded' />
                Förbereder karta...
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className='flex h-full items-center justify-center'>
              <div className='text-center'>
                <div className='mb-1 text-sm font-medium text-red-600'>
                  Kunde inte ladda kartan
                </div>
                <div className='text-muted-foreground text-xs'>{error}</div>
              </div>
            </div>
          ) : isLoading || !geoJsonData ? (
            // Loading state
            <div className='flex h-full items-center justify-center'>
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                Laddar kartdata...
              </div>
            </div>
          ) : (
            // Map component
            <LeafletMapInner
              data={data}
              geoJsonData={geoJsonData}
              currentRegion={currentRegion}
            />
          )}
        </div>

        {/* Summary information */}
        {!error && !isLoading && (
          <div className='mt-3 border-t pt-3'>
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>
                {totalJobs.toLocaleString('sv-SE')} lediga jobb totalt
              </span>
              <span>{regionsWithJobs} av 21 regioner med jobb</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
