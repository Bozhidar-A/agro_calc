'use client';

import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_CONSENT_COOKIE } from '@/lib/utils';

const consentSlice = createSlice({
    name: 'consent',
    initialState: {
        hasConsented: true, //default to true to avoid infinite redirect loop
        ...DEFAULT_CONSENT_COOKIE
    },
    reducers: {
        ConsentSetHasConsented: (state, action) => {
            state.hasConsented = action.payload;
        },
        //none for necessary since its always true
        ConsentSetPreferences: (state, action) => {
            state.preferences = action.payload;
            state.updatedAt = Date.now().toString();
        },
        ConsentSetLocation: (state, action) => {
            state.location = action.payload;
            state.updatedAt = Date.now().toString();
        },
        UpdateConsentDate: (state) => {
            state.updatedAt = Date.now().toString();
        }
    },
});

export const { ConsentSetHasConsented, ConsentSetPreferences, ConsentSetLocation, UpdateConsentDate } =
    consentSlice.actions;
export default consentSlice.reducer;
