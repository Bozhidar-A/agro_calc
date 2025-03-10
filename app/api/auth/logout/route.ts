import { BackendLogout } from "@/lib/auth-utils";
import { Log } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        Log(["auth", "logout", "route"], `POST called with: userId: ${userId}`);
        const res = await BackendLogout(userId);
        Log(["auth", "logout", "route"], `POST returned: ${JSON.stringify(res)}`);

        return NextResponse.json(res);
    } catch (error) {
        Log(["auth", "logout", "route"], `POST failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}