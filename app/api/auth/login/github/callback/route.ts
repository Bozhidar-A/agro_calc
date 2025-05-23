import { github } from "@/lib/oauth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Log } from "@/lib/logger";
import {
    CreateUserGitHub,
    FindUserByGitHubId,
    DeleteAllRefreshTokensByUserId,
    InsertRefreshTokenByUserId,
} from "@/prisma/prisma-utils";
import { SignJWT } from "jose";

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        const cookieStore = await cookies();
        const storedState = cookieStore.get("github_oauth_state")?.value;

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
        const githubId = githubUser.id.toString();
        const githubUsername = githubUser.login;

        let user = await FindUserByGitHubId(githubId);
        if (!user) {
            user = await CreateUserGitHub(githubId, githubUsername);
        }

        await DeleteAllRefreshTokensByUserId(user.id);

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

        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60,
            path: "/",
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });
        response.cookies.set("userId", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;
    } catch (err) {
        Log(["auth", "login", "github", "callback"], `Failed with: ${err.message}`);
        return new Response(null, { status: 500 });
    }
}
