import { APICallerOpts, UserGPSLoc } from '@/lib/interfaces';
import { Log } from '@/lib/logger';

export async function TryGetUserLocation(): Promise<UserGPSLoc | null> {
  if (!('geolocation' in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => resolve(null), // user denied or error
      { enableHighAccuracy: false, timeout: 5000 }
    );
  });
}

export async function APICaller(
  logPath: string[],
  route: string,
  method: string,
  variables?: any,
  opts: APICallerOpts = {}
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // only attach location if explicitly allowed
  if (opts.includeLocation) {
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
