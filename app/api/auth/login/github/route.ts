import { generateState } from "arctic";
import { github } from "@/lib/oauth-utils";
import { NextResponse } from "next/server";

export async function GET() {
    const state = generateState();
    const url = github.createAuthorizationURL(state, []);

    const res = NextResponse.redirect(url.toString());

    res.cookies.set("github_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 600,
    });

    return res;
}