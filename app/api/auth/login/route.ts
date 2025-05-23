import { BackendLogin } from "@/lib/auth-utils"
import { Log } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        Log(["auth", "login", "route"], `POST called with: email-${email}; pass-${password}`);
        const res = await BackendLogin(email, password);
        Log(["auth", "login", "route"], `POST returned: ${JSON.stringify(res)}`);

        return NextResponse.json(res);
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "login", "route"], `POST failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}