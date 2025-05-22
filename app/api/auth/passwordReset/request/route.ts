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

        const resetLink = `${process.env.NEXT_PUBLIC_HOST_URL}/auth/password/reset?token=${Base64URLSafeEncode(res.resetToken!)}`;

        const emailRes = await SendEmail(
            email,
            "Password Reset Request",
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>We received a request to reset your password. To proceed with the password reset, please click the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background-color: #007bff; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 4px; 
                              display: inline-block;">
                        Reset Password
                    </a>
                </div>

                <p style="color: #666; font-size: 14px;">If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                <p style="background-color: #f5f5f5; 
                          padding: 10px; 
                          border-radius: 4px; 
                          word-break: break-all; 
                          font-size: 14px;">
                    ${resetLink}
                </p>

                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    If you did not request a password reset, please ignore this email. Your account security is important to us.
                </p>
            </div>`
        );

        if (!emailRes.success) {
            return NextResponse.json({ success: false, message: emailRes.message });
        }

        return NextResponse.json(res);
    } catch (error) {
        Log(["auth", "passwordReset", "request", "route"], `POST failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}