'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ProvidersProps } from '@/lib/interfaces';
import { persistor, store } from '@/store/store';

import { ConsentProvider } from '@/components/ConsentProvider/ConsentProvider';

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ConsentProvider>
          {children}
        </ConsentProvider>
      </PersistGate>
    </Provider>
  );
}
