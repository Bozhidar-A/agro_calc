import { BackendPasswordReset } from "@/lib/auth-utils"
import { Log } from "@/lib/logger";
import { Base64URLSafeDecode } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { token, password, confirmPassword } = await req.json();

        if (!token || !password || !confirmPassword) {
            return NextResponse.json({ success: false, message: `Missing required fields` });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ success: false, message: `Passwords do not match` });
        }

        const decodedToken = Base64URLSafeDecode(token);

        Log(["auth", "passwordReset", "reset", "route"], `POST called with: token-${decodedToken}; pass-${password}; confirmPass-${confirmPassword}`);
        const res = await BackendPasswordReset(decodedToken, password, confirmPassword);
        Log(["auth", "passwordReset", "reset", "route"], `POST returned: ${JSON.stringify(res)}`);

        return NextResponse.json(res);
    } catch (error) {
        Log(["auth", "passwordReset", "reset", "route"], `POST failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}