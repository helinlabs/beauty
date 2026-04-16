'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { captureAttribution } from '@/lib/tracking';

/**
 * Mounted once in the locale layout. Captures first-touch attribution from
 * every landing URL (utm_source, ref, p, etc.) for the WhatsApp handoff.
 */
export function AttributionListener() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    captureAttribution(search?.toString() ?? '', pathname ?? '/');
  }, [pathname, search]);

  return null;
}
