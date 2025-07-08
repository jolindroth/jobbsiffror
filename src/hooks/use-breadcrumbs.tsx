'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { getRegionBySlug } from '@/constants/swedish-regions';
import { getOccupationBySlug } from '@/constants/occupation-groups';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;

      // Decode URL-encoded segment and get human-readable title
      const decodedSegment = decodeURIComponent(segment);
      const title = getHumanReadableTitle(decodedSegment);

      return {
        title,
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}

function getHumanReadableTitle(segment: string): string {
  // Handle known static segments with Swedish labels
  switch (segment.toLowerCase()) {
    case 'dashboard':
      return 'Dashboard';
    case 'vacancies':
      return 'Lediga jobb';
    default:
      break;
  }

  // Try to find in region mappings
  const region = getRegionBySlug(segment);
  if (region) {
    return region.name;
  }

  // Try to find in occupation mappings
  const occupation = getOccupationBySlug(segment);
  if (occupation) {
    return occupation.name;
  }

  // Fallback: capitalize first letter of decoded segment
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
