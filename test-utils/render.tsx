import { render as testingLibraryRender } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FormProvider, useForm, DefaultValues } from 'react-hook-form';

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

//render component with mocked providers
export function renderWithRedux(
  ui: (mockProps: any) => React.ReactNode,
  {
    preloadedState = {
      local: { lang: 'en' },
      auth: { user: null, token: null },
    },
    mockProps
  }: { preloadedState?: any, mockProps?: any } = {}
) {
  const { store } = createTestStore(preloadedState);

  const result = testingLibraryRender(
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {ui(mockProps)}
      </ThemeProvider>
    </Provider>
  );

  return { ...result, store };
}

//render react-hook-form with mock providers
export function renderWithReduxAndForm<TFormValues extends Record<string, any>>(
  ui: (props: { form: any }) => React.ReactNode,
  {
    preloadedState = {
      local: { lang: 'en' },
      auth: { user: null, token: null },
    },
    reactFormDefaultValues,
  }: { preloadedState?: any, reactFormDefaultValues?: DefaultValues<TFormValues> } = {}
) {
  const { store } = createTestStore(preloadedState);

  function Wrapper() {
    const form = useForm<TFormValues>({
      defaultValues: reactFormDefaultValues,
    });

    return (
      <Provider store={store}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FormProvider {...form}>
            {ui({ form })}
          </FormProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  return testingLibraryRender(<Wrapper />);
}