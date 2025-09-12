import { GetClientConsent } from '@/hooks/useConsent';
import { ConsentProps, UserGPSLoc } from '@/lib/interfaces';
import { Log } from './logger';

export async function TryGetUserLocation(): Promise<UserGPSLoc | null> {
  const consent: ConsentProps = GetClientConsent();

  // only attempt to get location if explicitly allowed

  if (!consent.location) {
    Log(
      ['consent', 'location'],
      `User has NOT consented to location. Skipping location retrieval.`
    );
    return null;
  } else {
    Log(
      ['consent', 'location'],
      `User has consented to location. Attempting to retrieve location.`
    );
  }

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
