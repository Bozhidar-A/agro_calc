'use client';

import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '@/lib/interfaces';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authType: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    AuthStart: (state, action) => {
      state.loading = true;
      state.error = null;
      state.authType = action.payload;
    },
    AuthSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.authType = action.payload.authType;
    },
    AuthFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.authType = null;
    },
    AuthLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.authType = null;
    },
  },
});

export const { AuthStart, AuthSuccess, AuthFailure, AuthLogout } = authSlice.actions;
export default authSlice.reducer;
