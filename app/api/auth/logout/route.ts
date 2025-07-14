import { FrontendLogout } from "@/lib/auth-utils";
import { Log } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        Log(["auth", "logout", "route"], `POST called with: userId: ${userId}`);
        const res = await FrontendLogout();
        Log(["auth", "logout", "route"], `POST returned: ${JSON.stringify(res)}`);

        return NextResponse.json(res);
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "logout", "route"], `POST failed with: ${errorMessage}`);
        return NextResponse.json({ success: true });
    }
}