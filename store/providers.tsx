'use client';
import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ProvidersProps } from "@/lib/interfaces";

export function Providers({ children }: ProvidersProps) {

    return (
        <Provider store={store}>
            <PersistGate
                loading={<div>Loading...</div>}
                persistor={persistor}
            >
                {children}
            </PersistGate>
        </Provider>
    );
}