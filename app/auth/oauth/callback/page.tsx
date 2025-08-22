'use client';

import { AuthSuccess } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";

export default function OAuthCallback() {
    const translator = useTranslate();
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const updateAuthState = searchParams.get('updateAuthState');

    useEffect(() => {
        if (updateAuthState) {
            try {
                const base64 = decodeURIComponent(updateAuthState);
                const json =
                    typeof window !== "undefined" &&
                    (window.atob
                        ? window.atob(base64)
                        : Buffer.from(base64, "base64").toString("utf-8"));

                const parsedState = JSON.parse(json as string);
                const age = parsedState?.timestamp
                    ? Date.now() - parsedState.timestamp
                    : null;

                const MAX_AGE_MS = 30_000; // 30 seconds
                if (parsedState.timestamp && age !== null && age < MAX_AGE_MS) {
                    dispatch(AuthSuccess(parsedState));
                    router.replace("/");
                } else {
                    toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_OAUTH_CALLBACK_EXPIRED));
                }
            } catch {
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_OAUTH_CALLBACK_FAILED));
            }
        }
    }, [updateAuthState, dispatch, router]);

    return <LoadingDisplay />;
}
