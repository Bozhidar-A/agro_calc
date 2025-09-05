import { UserGPSLoc } from '@/lib/interfaces';

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