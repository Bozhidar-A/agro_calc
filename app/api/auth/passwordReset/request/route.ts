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
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
                <h2 style="color: #15803d; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Password Reset Request</h2>
                <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">We received a request to reset your password. To proceed with the password reset, please click the button below:</p>
                
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}" 
                       style="background-color: #15803d; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 0.5rem;
                              font-weight: 500;
                              display: inline-block;
                              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                              transition: background-color 0.2s;">
                        Reset Password
                    </a>
                </div>

                <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                <p style="background-color: #f3f4f6; 
                          padding: 12px; 
                          border-radius: 0.5rem; 
                          word-break: break-all; 
                          font-size: 14px;
                          color: #374151;
                          border: 1px solid #e5e7eb;">
                    ${resetLink}
                </p>

                <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                    If you did not request a password reset, please ignore this email. Your account security is important to us.
                </p>
            </div>`
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