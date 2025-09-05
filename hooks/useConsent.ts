import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { ConsentSetLocation, ConsentSetPreferences, UpdateConsentDate } from "@/store/slices/consentSlice";

import { CONSENT_KEY, DEFAULT_CONSENT } from '@/lib/utils';
import type { ConsentProps } from '@/lib/interfaces';
import { GetLocalStorageItem, SetLocalStorageItem } from '@/lib/localstorage-util';

export function GetClientConsent(): ConsentProps {
    if (typeof window === 'undefined') {
        return { ...DEFAULT_CONSENT, updatedAt: Date.now().toString() };
    }
    const parsed = GetLocalStorageItem<ConsentProps>(CONSENT_KEY);
    if (parsed) {
        return {
            necessary: true,
            preferences: Boolean(parsed.preferences),
            location: Boolean(parsed.location),
            updatedAt: parsed.updatedAt ?? Date.now().toString(),
        };
    }
    return { ...DEFAULT_CONSENT, updatedAt: Date.now().toString() };
}

export function SetClientConsent(value: Partial<ConsentProps>): ConsentProps {
    const normalized: ConsentProps = {
        necessary: true,
        preferences: Boolean(value.preferences),
        location: Boolean(value.location),
        updatedAt: Date.now().toString(),
    };
    try {
        SetLocalStorageItem(CONSENT_KEY, normalized);
    } catch {
        // ignore
    }
    return normalized;
}

export function useConsent() {
    const dispatch = useDispatch();
    const consent = useSelector((state: RootState) => state.consent);

    const preferences = consent?.preferences ?? false;
    const location = consent?.location ?? null;

    const setPreferences = (value: any) => {
        console.log("Setting preferences to:", value);
        dispatch(ConsentSetPreferences(value));
    }
    const setLocation = (value: any) => {
        console.log("Setting location to:", value);
        dispatch(ConsentSetLocation(value));
    }
    const updateConsentDate = () => {
        dispatch(UpdateConsentDate());
    }

    return { preferences, location, setPreferences, setLocation, updateConsentDate, GetClientConsent, SetClientConsent };
}