import { useEffect, useState } from "react";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/utils";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/hooks/useTranslate";
import { OAuthButton } from "@/components/OAuthButton/OAuthButton";
import { TryGetUserLocation } from "@/lib/api-util";
import { UserGPSLoc } from "@/lib/interfaces";

export default function OAuthButtonsGrid() {
    const translator = useTranslate();
    const [location, setLocation] = useState<UserGPSLoc | null>(null);

    useEffect(() => {
        (async () => {
            const loc = await TryGetUserLocation();

            if (loc) {
                setLocation(loc);
            }
        })();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-center text-sm text-black dark:text-white">{translator(SELECTABLE_STRINGS.OR)}</p>
            <div className="flex flex-wrap justify-center gap-2">
                {Object.values(SUPPORTED_OAUTH_PROVIDERS).map((buttonData) => (
                    <OAuthButton
                        key={buttonData.name}
                        buttonData={{ ...buttonData, currLoc: location }}
                    />
                ))}
            </div>
        </div>
    );
}