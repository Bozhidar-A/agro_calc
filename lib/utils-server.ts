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

export async function DecodeTokenContent(
    // which token(s) to verify/decode; default is both
    target: 'access' | 'refresh' | 'both' = 'both'
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value ?? "";
        const refreshToken = cookieStore.get("refreshToken")?.value ?? "";

        // If the caller requested a specific token, ensure that token exists.
        if (target === 'access' && !accessToken) {
            return { success: false, message: 'No access token found' };
        }
        if (target === 'refresh' && !refreshToken) {
            return { success: false, message: 'No refresh token found' };
        }

        // If both were requested and neither exists, return early.
        if (target === 'both' && !accessToken && !refreshToken) {
            return { success: false, message: 'No access or refresh token found' };
        }

        const jwtSecret = process.env.JWT_SECRET || "";
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "";

        // Build verification promises conditionally. Use placeholders for skipped items
        // so the resulting tuple shape is predictable.
        const verifyAccess = (target === 'access' || target === 'both')
            ? BackendVerifyToken(jwtSecret, accessToken, 'access')
            : Promise.resolve([false, null] as const);

        const verifyRefresh = (target === 'refresh' || target === 'both')
            ? BackendVerifyToken(jwtRefreshSecret, refreshToken, 'refresh')
            : Promise.resolve([false, null] as const);

        // If caller only requested one token, we still run both promises but the
        // skipped one resolves immediately; Promise.all keeps wall-clock time low
        // and the result shape stable.
        const [[validAccessToken, rawAccess], [validRefreshToken, rawRefresh]] = await Promise.all([
            verifyAccess,
            verifyRefresh,
        ]);

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