'use client';

import { createSlice } from '@reduxjs/toolkit';
import { SUPPORTED_LANGS, THEMES } from '@/lib/LocalSettingsMaps';

const localSettingsSlice = createSlice({
  name: 'localSettings',
  initialState: {
    lang: SUPPORTED_LANGS.LANG_BG,
    theme: THEMES.THEME_SYSTEM,
  },
  reducers: {
    LocalSetLang: (state, action) => {
      state.lang = action.payload;
    },
    LocalSetTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { LocalSetLang, LocalSetTheme } = localSettingsSlice.actions;
export default localSettingsSlice.reducer;
