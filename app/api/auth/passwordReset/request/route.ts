import { BackendPasswordResetRequest } from "@/lib/auth-utils"
import { SendEmail } from "@/lib/email-util";
import { Log } from "@/lib/logger";
import { Base64URLSafeEncode } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        Log(["auth", "passwordReset", "request", "route"], `POST called with: email-${email}`);
        const res = await BackendPasswordResetRequest(email);
        Log(["auth", "passwordReset", "request", "route"], `POST returned: ${JSON.stringify(res)}`);

        if (!res.success) {
            return NextResponse.json({ success: false, message: res.message });
        }

        console.log('link UNTIL FUCKING MAILTRAP ANSWERS ME:', `${process.env.NEXT_PUBLIC_HOST_URL}/auth/password/reset?token=${Base64URLSafeEncode(res.resetToken!)}`);

        // const emailRes = await SendEmail(email, "Password Reset Request", `Please click the link below to reset your password: ${process.env.NEXT_PUBLIC_APP_URL}/auth/password/reset?token=${res.resetToken}`);

        // if (!emailRes.success) {
        //     return NextResponse.json({ success: false, message: emailRes.message });
        // }

        return NextResponse.json(res);
    } catch (error) {
        Log(["auth", "passwordReset", "request", "route"], `POST failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}