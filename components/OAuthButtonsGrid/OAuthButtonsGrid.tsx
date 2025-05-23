import { Button } from "@/components/ui/button";
import SimpleIconToSVG from "@/components/SimpleIconToSVG/SimpleIconToSVG";
import { SupportedOAuthProvider } from "@/lib/interfaces";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/utils";


function OAuthButton({ buttonData }: { buttonData: SupportedOAuthProvider }) {
    return (
        <Button asChild className="text-black dark:text-white font-bold">
            <a href={buttonData.authURL}>
                <SimpleIconToSVG icon={buttonData.icon} />
            </a>
        </Button>
    )
}

export default function OAuthButtonsGrid() {
    return (
        <div className="flex flex-wrap justify-center gap-2">
            {Object.values(SUPPORTED_OAUTH_PROVIDERS).map((buttonData) => (
                <OAuthButton key={buttonData.name} buttonData={buttonData} />
            ))}
        </div>
    );
}