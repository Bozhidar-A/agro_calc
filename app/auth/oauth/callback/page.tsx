'use client';

import { AuthSuccess } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import LoadingDisplay from "@/components/LoadingDisplay/LoadingDisplay";
import { toast } from "sonner";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback() {
    //handle oauth bounce from callback
    //this is absolutely terrible but just handles client side state
    //real auth is double checked on the server
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const updateAuthState = searchParams.get('updateAuthState');

    useEffect(() => {
        if (updateAuthState) {
            try {
                const parsedState = JSON.parse(
                    Buffer.from(updateAuthState, 'base64').toString('utf-8')
                );
                if (parsedState.timestamp && (Date.now() - parsedState.timestamp) < 5000) {
                    dispatch(AuthSuccess(parsedState));
                    toast.success(SELECTABLE_STRINGS.TOAST_LOGIN_SUCCESS);
                    router.replace('/');
                }
            } catch (e) {
                // invalid json, ignore
            }
        }
    }, [updateAuthState, dispatch, router]);

    return <LoadingDisplay />;
}