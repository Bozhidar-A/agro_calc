'use client';

import React from 'react';
import { useEffect } from 'react';
import { CONSENT_KEY } from '@/lib/utils';
import ConsentForm from '@/components/ConsentForm/ConsentForm';
import { GetLocalStorageItem } from '@/lib/localstorage-util';

export function ConsentProvider({ children }: React.PropsWithChildren) {
    const [showConsent, setShowConsent] = React.useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const raw = GetLocalStorageItem(CONSENT_KEY);
        if (raw === null) {
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
