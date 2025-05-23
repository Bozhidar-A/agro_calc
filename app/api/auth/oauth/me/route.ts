// app/api/auth/me/route.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { FindUserById } from "@/prisma/prisma-utils";
import { NextResponse } from "next/server";
import { Log } from "@/lib/logger";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const userId = cookieStore.get("userId")?.value;

        if (!accessToken || !userId) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        // Verify the access token
        const encoder = new TextEncoder();
        try {
            await jwtVerify(accessToken, encoder.encode(process.env.JWT_SECRET));
        } catch (error) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        // Get user data
        const user = await FindUserById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
        }

        return NextResponse.json({ success: true, data: { user, authType: user.googleId ? 'google' : user.githubId ? 'github' : 'credentials', } });

    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "oauth", "me"], `GET failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}