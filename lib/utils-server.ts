import { cookies } from "next/headers";
import { Log } from "@/lib/logger";
import { BackendVerifyToken } from "@/lib/auth-utils";

export async function DecodeTokenContent() {
    try {
        const cookieStore = await cookies();

        let noAccessToken: boolean = false;
        let noRefreshToken: boolean = false;

        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            Log(['auth', 'logout', 'frontend'], 'No access token found');
            noAccessToken = true;
        }

        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            Log(['auth', 'logout', 'frontend'], 'No refresh token found');
            noRefreshToken = true;
        }

        if (noAccessToken && noRefreshToken) {
            Log(['auth', 'logout', 'frontend'], 'No access or refresh token found');
            return { success: false, message: 'No access or refresh token found' };
        }

        const [validAccessToken, decodedAccessToken] = await BackendVerifyToken(
            process.env.JWT_SECRET || '',
            accessToken ?? '',
            'access'
        );

        const [validRefreshToken, decodedRefreshToken] = await BackendVerifyToken(
            process.env.JWT_REFRESH_SECRET || '',
            refreshToken ?? '',
            'refresh'
        );

        let decodedUserId: string | undefined = undefined;
        if (
            validAccessToken &&
            typeof decodedAccessToken !== 'boolean' &&
            decodedAccessToken?.payload?.userId &&
            typeof decodedAccessToken.payload.userId === 'string'
        ) {
            decodedUserId = decodedAccessToken.payload.userId;
        } else if (
            validRefreshToken &&
            typeof decodedRefreshToken !== 'boolean' &&
            decodedRefreshToken?.payload?.userId &&
            typeof decodedRefreshToken.payload.userId === 'string'
        ) {
            decodedUserId = decodedRefreshToken.payload.userId;
        }

        if (!decodedUserId) {
            Log(['auth', 'logout', 'frontend'], 'No user id found');
            return { success: false, message: 'No user id found' };
        }

        return {
            success: true, data: {
                accessToken,
                validAccessToken,
                decodedAccessToken,
                refreshToken,
                validRefreshToken,
                decodedRefreshToken,
                userId: decodedUserId,
            }
        }
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(['auth', 'logout', 'frontend'], `FrontendLogout failed with: ${errorMessage}`);
        return { success: true };
    }
}