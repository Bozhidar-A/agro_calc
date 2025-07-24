import { BackendPasswordResetRequest } from "@/lib/auth-utils"
import { SendEmail } from "@/lib/email-util";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { Log } from "@/lib/logger";
import { Base64URLSafeEncode, GetStrFromLangMapKey } from "@/lib/utils";
import { GenerateResetEmailHTML } from "@/components/ResetEmail/ResetEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, prefLangCode } = await req.json();

        Log(["auth", "passwordReset", "request", "route"], `POST called with: email-${email}`);
        const res = await BackendPasswordResetRequest(email);
        Log(["auth", "passwordReset", "request", "route"], `POST returned: ${JSON.stringify(res)}`);

        if (!res.success) {
            Log(["auth", "passwordReset", "request", "route"], `POST failed with: ${res.message}`);
            return NextResponse.json({ success: false, message: res.message });
        }

        const resetLink = `${process.env.NEXT_PUBLIC_HOST_URL}/${process.env.NEXT_PUBLIC_RESET_PASS_PATH}${Base64URLSafeEncode(res.resetToken!)}`;

        const emailRes = await SendEmail(
            email,
            GetStrFromLangMapKey(prefLangCode, SELECTABLE_STRINGS.RESET_EMAIL_TITLE),
            GenerateResetEmailHTML(resetLink, prefLangCode)
        );

        if (!emailRes.success) {
            return NextResponse.json({ success: false, message: emailRes.message });
        }

        return NextResponse.json(res);
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "passwordReset", "request", "route"], `POST failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}