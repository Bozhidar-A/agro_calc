import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/oauth-utils";
import { NextResponse } from "next/server";

export async function GET() {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);
    const res = NextResponse.redirect(url.toString());

    res.cookies.set("google_oauth_state", state, { path: "/", httpOnly: true, secure: true, sameSite: "lax", maxAge: 600 });
    res.cookies.set("google_code_verifier", codeVerifier, { path: "/", httpOnly: true, secure: true, sameSite: "lax", maxAge: 600 });

    return res;
}
