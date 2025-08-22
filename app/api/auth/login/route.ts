import { BackendLogin } from "@/lib/auth-utils"
import { Log } from "@/lib/logger";
import { FromRequestFormatUserAccessInfo } from "@/lib/ua-utils";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        Log(["auth", "login", "route"], `POST called with: email-${email}; pass-${password}`);
        const userAccessInfo = await FromRequestFormatUserAccessInfo(req, userAgent(req));
        const res = await BackendLogin(email, password, userAccessInfo);
        Log(["auth", "login", "route"], `POST returned: ${JSON.stringify(res)}`);

        return NextResponse.json(res);
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "login", "route"], `POST failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}