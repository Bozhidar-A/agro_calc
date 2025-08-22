import { github } from "@/lib/oauth-utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { Log } from "@/lib/logger";
import {
    CreateUserGitHub,
    FindUserByGitHubId,
    AttachGitHubIdToUser,
} from "@/prisma/prisma-utils";
import { HandleOAuthLogin } from '@/lib/auth-utils';
import { DeleteTempUserLocationCookies, FormatUserAccessInfo, ReadTempUserLocationCookies } from "@/lib/ua-utils";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/utils";

export async function GET(request: NextRequest): Promise<Response> {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        const cookieStore = await cookies();
        const storedState = cookieStore.get("github_oauth_state")?.value;
        const location = ReadTempUserLocationCookies(request);

        //clean up tmp cookies
        cookieStore.delete("github_oauth_state");
        DeleteTempUserLocationCookies(request);

        if (!code || !state || !storedState || state !== storedState) {
            return new Response(null, { status: 400 });
        }

        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            },
        });
        const githubUser = await githubUserResponse.json();

        //try to fetch the user's emails
        const githubUserEmailsResponse = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            },
        });
        const githubUserEmails = await githubUserEmailsResponse.json();

        //get the first verified email or fallback to GitHub username
        const verifiedEmail = githubUserEmails.find((email: any) => email.primary)?.email;
        const githubName = verifiedEmail || githubUser.login;
        const githubId = githubUser.id.toString();

        // Use generic OAuth handler
        const refreshTokenUserInfo = await FormatUserAccessInfo(location, userAgent(request), SUPPORTED_OAUTH_PROVIDERS.GITHUB.name);
        const { user, accessToken, refreshToken } = await HandleOAuthLogin({
            provider: "github",
            providerId: githubId,
            email: githubName,
            findUserByProviderId: FindUserByGitHubId,
            attachProviderIdToUser: AttachGitHubIdToUser,
            createUserWithProvider: CreateUserGitHub,
            refreshTokenUserInfo
        })

        const authState = {
            user: {
                id: user.id,
                email: user.email,
            },
            isAuthenticated: true,
            loading: false,
            error: null,
            authType: 'github',
            timestamp: Date.now()
        };
        const authStateBase64 = Buffer.from(JSON.stringify(authState)).toString('base64');

        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST_URL}/${process.env.OAUTH_CLIENT_HANDLE_PATH_REDIRECT}?updateAuthState=${authStateBase64}`);

        // Set cookies
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60,
            path: "/",
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        //add a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));

        return response;
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "login", "github", "callback"], `Failed with: ${errorMessage}`);
        return new Response(null, { status: 500 });
    }
}

