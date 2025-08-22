import { generateState } from "arctic";
import { github } from "@/lib/oauth-utils";
import { NextRequest, NextResponse } from "next/server";
import { CreateTempUserLocCookies } from "@/lib/ua-utils";

export async function GET(req: NextRequest) {
    const state = generateState();
    const url = github.createAuthorizationURL(state, [
        "user:email",
    ]);

    //OAuth location transfer
    const reqURL = new URL(req.url);
    const lat = reqURL.searchParams.get("lat") ?? "0";
    const lon = reqURL.searchParams.get("lon") ?? "0";

    const res = NextResponse.redirect(url.toString());

    CreateTempUserLocCookies(res, lat, lon);
    res.cookies.set("github_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 600,
    });

    return res;
}