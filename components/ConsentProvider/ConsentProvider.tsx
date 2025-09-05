'use client';

import React from 'react';
import { useEffect } from 'react';
import { CONSENT_KEY, DEFAULT_CONSENT } from '@/lib/utils';
import ConsentForm from '@/components/ConsentForm/ConsentForm';
import { GetLocalStorageItem } from '@/lib/localstorage-util';
import { useConsent } from '@/hooks/useConsent';

export function ConsentProvider({ children }: React.PropsWithChildren) {
    const [showConsent, setShowConsent] = React.useState(false);
    const { SetClientConsent } = useConsent();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const raw = GetLocalStorageItem(CONSENT_KEY);
        if (raw === null) {

            //set default consent to necessary only
            SetClientConsent(DEFAULT_CONSENT);

            // show the consent dialog
            setShowConsent(true);
        }
    }, []);

    return (
        <>
            {showConsent && (
                <ConsentForm
                    open={true}
                    onOpenChange={(open: boolean) => {
                        if (!open) setShowConsent(false);
                    }}
                />
            )}
            {children}
        </>
    );
}
