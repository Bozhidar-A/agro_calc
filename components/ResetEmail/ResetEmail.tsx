import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { GetStrFromLangMapKey } from "@/lib/utils";

// Email styles optimized for email clients
const emailStyles = {
    container: `font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; background-color: #ffffff;`,
    header: `color: #15803d; font-size: 24px; font-weight: bold; margin-bottom: 16px; text-align: left;`,
    paragraph: `color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px; margin: 0 0 24px 0;`,
    buttonContainer: `text-align: center; margin: 32px 0;`,
    button: `background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block; border: none; font-size: 16px;`,
    smallText: `color: #6b7280; font-size: 14px; margin-bottom: 12px; margin: 0 0 12px 0;`,
    linkBox: `background-color: #f3f4f6; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 14px; color: #374151; border: 1px solid #e5e7eb; margin: 0 0 24px 0;`,
    footer: `color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px; margin: 32px 0 0 0;`
};

//since email is a consistent
//force generate html string that will be the body with inline css styles
export function GenerateResetEmailHTML(resetLink: string, prefLangCode: string): string {
    return `
        <div style="${emailStyles.container}">
            <h2 style="${emailStyles.header}">${GetStrFromLangMapKey(prefLangCode, SELECTABLE_STRINGS.RESET_EMAIL_TITLE)}</h2>
            
            <p style="${emailStyles.paragraph}">
                ${GetStrFromLangMapKey(prefLangCode, SELECTABLE_STRINGS.RESET_EMAIL_INSTRUCTIONS)}
            </p>
            
            <div style="${emailStyles.buttonContainer}">
                <a href="${resetLink}" style="${emailStyles.button}">
                    ${GetStrFromLangMapKey(prefLangCode, SELECTABLE_STRINGS.RESET_EMAIL_RESET_BUTTON)}
                </a>
            </div>
            
            <p style="${emailStyles.smallText}">
                ${GetStrFromLangMapKey(prefLangCode, SELECTABLE_STRINGS.RESET_EMAIL_RESET_BUTTON_NO_WORK)}
            </p>
            
            <div style="${emailStyles.linkBox}">
                ${resetLink}
            </div>
            
            <p style="${emailStyles.footer}">
                ${GetStrFromLangMapKey(prefLangCode, SELECTABLE_STRINGS.RESET_EMAIL_DID_NOT_REQUEST_RESET)}
            </p>
        </div>
    `;
}