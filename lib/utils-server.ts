import { cookies } from "next/headers";
import { Log } from "@/lib/logger";
import { BackendVerifyToken } from "@/lib/auth-utils";
import { JWTPayload, JWTVerifyResult } from "jose";

type DecodedLike = JWTVerifyResult<JWTPayload> | JWTPayload | boolean | null | undefined;

function ToJWTPayload(decoded: DecodedLike): JWTPayload | null {
    if (!decoded || decoded === true || decoded === false) {
        return null;
    }
    if (typeof decoded === "object" && "payload" in decoded) {
        return (decoded as JWTVerifyResult<JWTPayload>).payload ?? null;
    }
    return (decoded as JWTPayload) ?? null;
}

export async function DecodeTokenContent() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value ?? "";
        const refreshToken = cookieStore.get("refreshToken")?.value ?? "";

        if (!accessToken && !refreshToken) {
            return { success: false, message: "No access or refresh token found" };
        }

        const [validAccessToken, rawAccess] = await BackendVerifyToken(
            process.env.JWT_SECRET || "",
            accessToken,
            "access"
        );

        const [validRefreshToken, rawRefresh] = await BackendVerifyToken(
            process.env.JWT_REFRESH_SECRET || "",
            refreshToken,
            "refresh"
        );

        // <<< THE TWO YOU ASKED FOR >>>
        const decodedAccess = validAccessToken ? ToJWTPayload(rawAccess) : null;
        const decodedRefresh = validRefreshToken ? ToJWTPayload(rawRefresh) : null;

        const userId =
            (decodedAccess?.userId as string | undefined) ??
            (decodedRefresh?.userId as string | undefined) ??
            null;

        if (!userId) {
            return { success: false, message: "No user id found" };
        }

        return {
            success: true,
            data: {
                accessToken: accessToken || undefined,
                refreshToken: refreshToken || undefined,
                validAccessToken,
                validRefreshToken,
                decodedAccess,
                decodedRefresh,
                userId,
            },
        };
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(['auth', 'logout', 'frontend'], `DecodeTokenContent failed with: ${errorMessage}`);
        return { success: true };
    }
}