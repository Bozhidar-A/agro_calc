import { google } from "@/lib/oauth-utils";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";
import { AttachGoogleIdToUser, CreateUserGoogle, FindUserByGoogleId } from "@/prisma/prisma-utils";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { Log } from "@/lib/logger";
import { HandleOAuthLogin } from '@/lib/auth-utils';
import { DeleteTempUserLocationCookies, FormatUserAccessInfo, ReadTempUserLocationCookies } from "@/lib/ua-utils";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/utils";

export async function GET(request: NextRequest) {
    try {
        Log(["auth", "login", "google", "callback"], `GET called with: ${request.url}`);

        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        const cookieStore = await cookies();
        const storedState = cookieStore.get("google_oauth_state")?.value;
        const codeVerifier = cookieStore.get("google_code_verifier")?.value;
        const location = ReadTempUserLocationCookies(request);

        //clean up tmp cookies
        cookieStore.delete("google_oauth_state");
        cookieStore.delete("google_code_verifier");
        DeleteTempUserLocationCookies(request);

        Log(["auth", "login", "google", "callback"], `Stored state: ${storedState}`);
        Log(["auth", "login", "google", "callback"], `Code: ${code}`);
        Log(["auth", "login", "google", "callback"], `State: ${state}`);
        Log(["auth", "login", "google", "callback"], `Code verifier: ${codeVerifier}`);

        if (!code || !state || state !== storedState || !codeVerifier) {
            Log(["auth", "login", "google", "callback"], `Invalid code, state, or code verifier`);
            return new Response(null, { status: 400 });
        }

        let tokens;
        try {
            tokens = await google.validateAuthorizationCode(code, codeVerifier);
        } catch {
            return new Response(null, { status: 400 });
        }

        Log(["auth", "login", "google", "callback"], `Tokens: ${JSON.stringify(tokens)}`);

        const claims = decodeIdToken(tokens.idToken());
        const userId = claims.sub;
        const email = claims.email;

        const refreshTokenUserInfo = await FormatUserAccessInfo(location, userAgent(request), SUPPORTED_OAUTH_PROVIDERS.GOOGLE.name);
        // Use generic OAuth handler
        const { user, accessToken, refreshToken } = await HandleOAuthLogin({
            provider: "google",
            providerId: userId,
            email,
            findUserByProviderId: FindUserByGoogleId,
            attachProviderIdToUser: AttachGoogleIdToUser,
            createUserWithProvider: CreateUserGoogle,
            refreshTokenUserInfo
        });

        const authState = {
            user: {
                id: user.id,
                email: user.email,
            },
            isAuthenticated: true,
            loading: false,
            error: null,
            authType: 'google',
            timestamp: Date.now()
        };
        const authStateBase64 = Buffer.from(JSON.stringify(authState)).toString('base64');

        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST_URL}/${process.env.OAUTH_CLIENT_HANDLE_PATH_REDIRECT}?updateAuthState=${authStateBase64}`);

        // Set cookies
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60, // 15 min
            path: "/"
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/"
        });

        //add a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));

        return response;
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "login", "google", "callback"], `Error: ${errorMessage}`);
        return new Response(null, { status: 500 });
    }
}
