'use client';

import { createSlice } from '@reduxjs/toolkit';
import { SUPPORTED_LANGS, THEMES, UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/LocalSettingsMaps';

const localSettingsSlice = createSlice({
  name: 'localSettings',
  initialState: {
    lang: SUPPORTED_LANGS.BG.code,
    theme: THEMES.THEME_SYSTEM,
    unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES,
  },
  reducers: {
    LocalSetLang: (state, action) => {
      state.lang = action.payload;
    },
    LocalSetTheme: (state, action) => {
      state.theme = action.payload;
    },
    LocalSetUnitOfMeasurementLength: (state, action) => {
      state.unitOfMeasurementLength = action.payload;
    },
  },
});

export const { LocalSetLang, LocalSetTheme, LocalSetUnitOfMeasurementLength } = localSettingsSlice.actions;
export default localSettingsSlice.reducer;
