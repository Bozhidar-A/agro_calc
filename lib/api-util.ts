import { useConsent } from '@/hooks/useConsent';
import { APICallerOpts } from '@/lib/interfaces';
import { Log } from '@/lib/logger';
import { TryGetUserLocation } from '@/lib/geo-utils';

export async function APICaller(
  logPath: string[],
  route: string,
  method: string,
  variables?: any,
  opts: APICallerOpts = {}
) {
  const consent = useConsent();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // only attach location if explicitly allowed
  if (opts.includeLocation && consent.location) {

    consent.location ? Log(['consent', 'location', ...logPath], `User has consented to location. Including location headers.`) : Log(['consent', 'location', ...logPath], `User has NOT consented to location. Skipping location headers.`);

    const geo = await TryGetUserLocation();
    if (geo && geo.lat && geo.lon) {
      headers['x-user-lat'] = String(geo.lat);
      headers['x-user-lon'] = String(geo.lon);
    }
  }

  Log(logPath, `Calling ${route} ${method} ${variables ? JSON.stringify(variables) : ''}`);

  const fetchOptions: RequestInit = {
    method,
    credentials: 'include',
    headers,
    cache: opts.noCache ? 'no-store' : 'default',
  };

  const payload = { ...variables };
  if (method !== 'GET') {
    fetchOptions.body = JSON.stringify(payload);
  }

  const res = await fetch(route, fetchOptions);

  if (!res.ok) {
    return { success: false, message: res.statusText };
  }

  const data = await res.json();
  return data;
} 
