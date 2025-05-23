import { google } from "@/lib/oauth-utils";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";
import { CreateUserGoogle, DeleteAllRefreshTokensByUserId, FindUserByGoogleId, InsertRefreshTokenByUserId } from "@/prisma/prisma-utils";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { Log } from "@/lib/logger";

export async function GET(request: Request) {

    try {
        Log(["auth", "login", "google", "callback"], `GET called with: ${request.url}`);

        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        const cookieStore = await cookies();
        const storedState = cookieStore.get("google_oauth_state")?.value;
        const codeVerifier = cookieStore.get("google_code_verifier")?.value;

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

        Log(["auth", "login", "google", "callback"], `Claims: ${JSON.stringify(claims)}`);
        Log(["auth", "login", "google", "callback"], `User ID: ${userId}`);
        Log(["auth", "login", "google", "callback"], `Email: ${email}`);

        let user = await FindUserByGoogleId(userId);
        if (!user) {
            user = await CreateUserGoogle(userId, email);
            Log(["auth", "login", "google", "callback"], `Created new user: ${user.id}`);
        }

        //nuke all old refresh tokens
        const deletedTokensCount = await DeleteAllRefreshTokensByUserId(user.id);

        Log(["auth", "login", "google", "callback"], `Deleted ${deletedTokensCount?.count} old refresh tokens for user ${user.id}`);

        const encoder = new TextEncoder();
        const accessToken = await new SignJWT({ userId: user.id, type: "access" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("15m")
            .sign(encoder.encode(process.env.JWT_SECRET!));

        const refreshToken = await new SignJWT({ userId: user.id, type: "refresh" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(encoder.encode(process.env.JWT_REFRESH_SECRET!));

        await InsertRefreshTokenByUserId(refreshToken, user.id);

        Log(["auth", "login", "google", "callback"], `Inserted refresh token for user ${user.id}`);

        const response = NextResponse.redirect(new URL("/", request.url));
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
        response.cookies.set("userId", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/"
        });

        return response;
    } catch (error) {
        Log(["auth", "login", "google", "callback"], `GET failed with: ${error.message}`);
        return new Response(null, { status: 500 });
    }
}
