'use client';

import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { APICaller } from '@/lib/api-util';
import { Log } from '@/lib/logger';
import authReducer, { AuthSuccess } from '@/store/slices/authSlice';
import consentReducer, {
  ConsentSetLocation,
  ConsentSetPreferences,
  UpdateConsentDate,
} from '@/store/slices/consentSlice';
import localSettingsReducer, {
  LocalSetLang,
  LocalSetTheme,
  LocalSetUnitOfMeasurementLength,
} from '@/store/slices/localSettingsSlice';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
};

const combinedReducer = combineReducers({
  auth: authReducer,
  local: localSettingsReducer,
  consent: consentReducer,
});

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: AuthSuccess,
  effect: async (action, listenerApi) => {
    Log(
      ['auth', 'success', 'store', 'listener'],
      `AuthSuccess action received - ${JSON.stringify(action)}`
    );

    const state = listenerApi.getState() as RootState;
    const user = state.auth.user;
    const preferences = state.consent.preferences;

    if (!preferences) {
      Log(
        ['consent', 'preferences', 'settings', 'store', 'listener'],
        `User has not consented to preferences. Skipping loading user settings.`
      );
      return;
    }

    if (user) {
      const userSettings = await APICaller(
        ['user', 'settings', 'get', 'store', 'listener'],
        `/api/user/settings?userId=${user.id}`,
        'GET'
      );

      if (userSettings.success) {
        listenerApi.dispatch(LocalSetLang(userSettings.userSettings.language));
        listenerApi.dispatch(LocalSetTheme(userSettings.userSettings.theme));
        listenerApi.dispatch(
          LocalSetUnitOfMeasurementLength(userSettings.userSettings.prefUnitOfMeasurement)
        );
      }
    }
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(LocalSetLang, LocalSetTheme, LocalSetUnitOfMeasurementLength),
  effect: async (action, listenerApi) => {
    Log(
      ['local', 'settings', 'change', 'store', 'listener'],
      `Settings changed - ${JSON.stringify(action)}`
    );

    const state = listenerApi.getState() as RootState;
    const user = state.auth.user;
    const lang = state.local.lang;
    const theme = state.local.theme;
    const unitOfMeasurementLength = state.local.unitOfMeasurementLength;

    const preferences = state.consent.preferences;

    if (!preferences) {
      Log(
        ['consent', 'preferences', 'settings', 'store', 'listener'],
        `User has not consented to preferences. Skipping saving user settings.`
      );
      return;
    }

    if (user) {
      const userSettings = await APICaller(
        ['user', 'settings', 'post', 'store', 'listener'],
        `/api/user/settings`,
        'POST',
        {
          userId: user.id,
          theme,
          language: lang,
          prefUnitOfMeasurement: unitOfMeasurementLength,
        }
      );

      if (userSettings.success) {
        Log(['user', 'settings', 'post', 'store', 'listener'], 'User settings updated');
      }
    }
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(ConsentSetPreferences, ConsentSetLocation, UpdateConsentDate),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const next = {
      preferences: state.consent.preferences,
      location: state.consent.location,
      updatedAt: state.consent.updatedAt ?? Date.now().toString(),
    };

    Log(
      ['consent', 'change', 'store', 'listener'],
      `Consent changed - action: ${JSON.stringify(action)}; to: ${JSON.stringify(next)}`
    );
  },
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
