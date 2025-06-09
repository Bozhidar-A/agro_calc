import { Button } from "@/components/ui/button";
import SimpleIconToSVG from "@/components/SimpleIconToSVG/SimpleIconToSVG";
import { SupportedOAuthProvider } from "@/lib/interfaces";

export function OAuthButton({ buttonData }: { buttonData: SupportedOAuthProvider }) {
    return (
        <Button asChild className="text-black dark:text-white font-bold" >
            <a href={buttonData.authURL}>
                <SimpleIconToSVG icon={buttonData.icon} />
            </a>
        </Button>
    )
}