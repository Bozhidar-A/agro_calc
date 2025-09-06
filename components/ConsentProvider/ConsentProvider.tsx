'use client';

import React, { useEffect } from 'react';
import ConsentForm from '@/components/ConsentForm/ConsentForm';
import { useConsent } from '@/hooks/useConsent';
import { GetLocalStorageItem } from '@/lib/localstorage-util';
import { CONSENT_KEY, DEFAULT_CONSENT } from '@/lib/utils';

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
