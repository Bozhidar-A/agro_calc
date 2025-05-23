'use client';
import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import OAuthLoader from "@/components/OAuthLoader/OAuthLoader";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate
                loading={<div>Loading...</div>}
                persistor={persistor}
            >
                <OAuthLoader />
                {children}
            </PersistGate>
        </Provider>
    );
}