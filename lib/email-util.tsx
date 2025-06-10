import { Log } from "./logger";

export async function SendEmail(
    to: string,
    subject: string,
    text: string,
    senderName: string = "AgroCalc",
    senderEmail: string = "no-reply@resend.musaka.top",
) {
    try {
        //fixes docker build time errors
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY!);

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
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["email", "send"], `Email not sent - ${errorMessage}`);
        return {
            success: false,
            message: `Email not sent - ${errorMessage}`,
        };
    }
}