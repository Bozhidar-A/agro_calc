// components/AuthChecker.js
'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AuthSuccess, AuthFailure } from '@/store/slices/authSlice';
import { APICaller } from '@/lib/api-util';
import { Log } from '@/lib/logger';

export default function OAuthChecker() {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await APICaller(["auth", "oauth", "me"], "/api/auth/oauth/me", "GET");

                if (res.success) {
                    Log(["auth", "oauth", "me"], `User ${res.data.user.id} authenticated - ${JSON.stringify(res.data)}`);
                    dispatch(AuthSuccess(res.data));
                    return;
                }

                Log(["auth", "oauth", "me"], `User not authenticated - ${JSON.stringify(res.error)}`);
                dispatch(AuthFailure(res.error));
            } catch (error: unknown) {
                const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
                Log(["auth", "oauth", "me"], `Auth check failed: ${errorMessage}`);
                dispatch(AuthFailure(errorMessage));
            }
        };

        checkAuthStatus();
    }, [dispatch]);

    return null; // This component doesn't render anything
}