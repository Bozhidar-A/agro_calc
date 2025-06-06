'use client';
import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { AuthSuccess } from "./slices/authSlice";
import { ProvidersProps } from "@/lib/interfaces";

export function Providers({ children, initialAuthState }: ProvidersProps) {
    //kinda ugly but cant use a hook here because it we are outside of the reach
    useEffect(() => {
        if (initialAuthState) {
            store.dispatch(AuthSuccess(initialAuthState));
        }
    }, [initialAuthState]);

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