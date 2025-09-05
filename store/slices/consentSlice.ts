'use client';

import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_CONSENT_COOKIE } from '@/lib/utils';

const consentSlice = createSlice({
    name: 'consent',
    initialState: DEFAULT_CONSENT_COOKIE,
    reducers: {
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

export const { ConsentSetPreferences, ConsentSetLocation, UpdateConsentDate } =
    consentSlice.actions;
export default consentSlice.reducer;
