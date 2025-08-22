import { ReverseGeocodeAddress, ReverseGeocodeResult, UserAgentNext, UserGPSLoc } from "@/lib/interfaces";
import { Log } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

function FormatUAValue(value?: string, fallback = "?"): string {
    return value && value.trim() ? value.trim() : fallback;
}

export function FormatUserAgent(ua: UserAgentNext) {
    if (!ua) {
        return "? - ? (?, ?, ?)";
    }

    // Browser
    const browser = FormatUAValue(ua.browser?.name);

    // Device
    const deviceVendor = FormatUAValue(ua.device?.vendor);
    const deviceModel = FormatUAValue(ua.device?.model);
    let device: string;
    if (deviceVendor !== "?" || deviceModel !== "?") {
        device = `${deviceVendor} ${deviceModel}`.trim();
    } else {
        device = ua.device?.type ?? "?";
    }

    // Engine
    const engine = FormatUAValue(ua.engine?.name);

    // OS
    const osName = FormatUAValue(ua.os?.name);
    const osVersion = FormatUAValue(ua.os?.version, "");
    const os = `${osName} ${osVersion}`.trim();

    // CPU
    const cpu = FormatUAValue(ua.cpu?.architecture);

    return `${browser} - ${device} (${engine}, ${os}, ${cpu})`;
}

export async function ReverseGeocode(
    lat: number,
    lon: number
): Promise<ReverseGeocodeAddress | null> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            {
                headers: {
                    // per Nominatim usage policy, always send a UA
                    "User-Agent": "AgroCalc/1.0 (bplatanasov@gmail.com)"
                }
            }
        );

        if (!res.ok) {
            Log(["ua-utils", "ReverseGeocode", "fail"], `${res.status} ${res.statusText}`);
            return null;
        }

        const data = (await res.json()) as ReverseGeocodeResult;

        if (!data.address) {
            return null; // no usable address
        }

        return data.address;
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["ua-utils", "ReverseGeocode", "error"], errorMessage);
        return null;
    }
}


export async function FormatUserAccessInfo(loc: UserGPSLoc | null, ua: UserAgentNext | null, OAuthProvider: string | null): Promise<string> {
    let locationStr = "?";
    if (loc) {
        const location = await ReverseGeocode(loc.lat, loc.lon);
        locationStr = location ? `${location.city || location.town || location.village || "?"}, ${location.country || "?"}` : "?";
    }
    const userAgent = ua ? FormatUserAgent(ua) : "? - ? (?, ?, ?)";
    return `${locationStr} / ${userAgent} / ${OAuthProvider || "?"}`;
}

export async function FromRequestFormatUserAccessInfo(request: NextRequest, userAgent: UserAgentNext | null, OAuthProvider: string | null): Promise<string> {
    const lat = request.headers.get("x-user-lat");
    const lon = request.headers.get("x-user-lon");

    const loc: UserGPSLoc | null = lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : null;
    const ua: UserAgentNext | null = userAgent ? userAgent : null;

    return await FormatUserAccessInfo(loc, ua, OAuthProvider);
}

//since OAuth LOVES to mess with me here are some duct tape solutions

//cant get user location from request?
//bolt it on as query params
export function ReadUserLocationFromQueryParams(request: NextRequest): UserGPSLoc | null {
    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");

    if (lat && lon) {
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }

    return null;
}

//cant survive callback?
//just make temp cookies
export function CreateTempUserLocCookies(req: NextResponse, lat: string, lon: string): void {
    if (lat && lon) {
        req.cookies.set("temp_user_lat", lat);
        req.cookies.set("temp_user_lon", lon);
    }
}

export function ReadTempUserLocationCookies(req: NextRequest): UserGPSLoc | null {
    const lat = req.cookies.get("temp_user_lat")?.value;
    const lon = req.cookies.get("temp_user_lon")?.value;

    if (lat && lon) {
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }

    return null;
}

export function DeleteTempUserLocationCookies(req: NextRequest): void {
    req.cookies.delete("temp_user_lat");
    req.cookies.delete("temp_user_lon");
}
