import { UserGPSLoc } from "./interfaces";
import { Log } from "./logger";

export async function TryGetUserLocation(): Promise<UserGPSLoc | null> {
    if (!("geolocation" in navigator)) {
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

export async function APICaller(logPath: string[], route: string, method: string, variables?: any) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    const geo = await TryGetUserLocation();
    if (geo && geo.lat && geo.lon) {
        headers["x-user-lat"] = geo.lat.toString();
        headers["x-user-lon"] = geo.lon.toString();
    }

    Log(logPath, `Calling ${route} ${method} ${variables ? JSON.stringify(variables) : ""}`);

    const fetchOptions: RequestInit = {
        method,
        credentials: 'include',
        headers,
    };

    const payload = {
        ...variables,
    };

    if (method !== "GET") {
        fetchOptions.body = JSON.stringify(payload);
    }

    const res = await fetch(`${route}`, fetchOptions);

    if (!res.ok) {
        Log(logPath, `API call failed with: ${res.statusText}`);
        return { success: false, message: res.statusText };
    }

    const data = await res.json();
    Log(logPath, `API call returned: ${JSON.stringify(data)}`);

    return data;
}
