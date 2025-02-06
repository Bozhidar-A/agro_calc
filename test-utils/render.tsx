import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { render as testingLibraryRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

//defaults
import { persistor, store } from "@/store/store";

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >{children}</ThemeProvider>
    ),
  });
}

//full redux testing with prod defaults
export function renderWithProviders(ui: React.ReactNode, objectExtra: {} = {}, mockStore: any = store, mockPersistor: any = persistor) {
  return testingLibraryRender(
    <Provider store={mockStore}>
      <PersistGate loading={<h1>Loading...</h1>} persistor={mockPersistor}>
        {ui}
      </PersistGate>
    </Provider>, objectExtra
  )
}
