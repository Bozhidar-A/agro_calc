import { render as testingLibraryRender } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PersistGate } from 'redux-persist/integration/react';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// app
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import localReducer from '@/store/slices/localSettingsSlice';
import authReducer from '@/store/slices/authSlice';

// fallback for tests without redux
export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    ),
  });
}

// Create test store with preloaded state
function createTestStore(preloadedState = {}) {
  const rootReducer = {
    local: localReducer,
    auth: authReducer,
  };

  const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    whitelist: ['local', 'auth'],
  };

  const persistedReducer = persistReducer(persistConfig, (state: any, action: any) => {
    return {
      local: rootReducer.local(state?.local, action),
      auth: rootReducer.auth(state?.auth, action),
    };
  });

  const store = configureStore({
    reducer: persistedReducer,
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
}

// Render component with mocked providers
export function renderWithProviders(
  ui: React.ReactNode,
  {
    preloadedState = {
      local: { lang: 'en' },
      auth: { user: null, token: null },
    },
  }: { preloadedState?: any } = {}
) {
  const { store, persistor } = createTestStore(preloadedState);

  return testingLibraryRender(
    <Provider store={store}>
      <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {ui}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
