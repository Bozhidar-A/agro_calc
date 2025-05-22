import { MailtrapClient } from "mailtrap";

export const mailer = new MailtrapClient({
    token: process.env.MAILTRAP_API_KEY!,
});

export async function SendEmail(
    to: string,
    subject: string,
    text: string,
    senderName: string = "AgroCalc",
    senderEmail: string = "no-reply@musaka.top",
) {
    return await mailer.send({
        from: {
            name: senderName,
            email: senderEmail,
        },
        to: [{
            email: to,
        }],
        subject,
        text,
    });
}