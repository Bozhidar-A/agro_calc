import { BackendRegister } from "@/lib/auth-utils"
import { Log } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        Log(["auth", "register", "route"], `POST called with: email-${email}; pass-${password}`);
        const res = await BackendRegister(email, password);
        Log(["auth", "register", "route"], `POST returned: ${JSON.stringify(res)}`);

        return NextResponse.json(res);
    } catch (error) {
        Log(["auth", "register", "route"], `POST failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}