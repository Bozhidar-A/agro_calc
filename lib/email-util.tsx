import { Resend } from "resend";
import { Log } from "./logger";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function SendEmail(
    to: string,
    subject: string,
    text: string,
    senderName: string = "AgroCalc",
    senderEmail: string = "no-reply@resend.musaka.top",
) {
    try {
        Log(["email", "send"], `Sending email to ${to} with subject ${subject}`);

        const emailRes = await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: [to],
            subject,
            html: text,
        });

        Log(["email", "send"], `Email status: ${JSON.stringify(emailRes)}`);

        if (emailRes.error) {
            Log(["email", "send"], `Email not sent - ${emailRes.error.message}`);
            return {
                success: false,
                message: `Email not sent - ${emailRes.error.message}`,
            };
        }

        return {
            success: true,
            message: "Email sent successfully",
        };
    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: `Email not sent - ${error.message}`,
        };
    }
}