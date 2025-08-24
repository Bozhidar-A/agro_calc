import { screen } from '@testing-library/react';
import { type ThemeProviderProps } from 'next-themes';
import { initializeMockTranslate } from '@/test-utils/mocks';
import { renderWithRedux } from '@/test-utils/render';
import { ThemeProvider } from './ThemeProvider';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  ...jest.requireActual('next-themes'),
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeProvider', () => {
  const preloadedState = {
    local: { lang: 'bg', theme: 'light' },
    auth: { user: null, token: null, isAuthenticated: false },
  };

  beforeEach(() => {
    initializeMockTranslate(preloadedState);
    jest.clearAllMocks();
  });

  it('renders children correctly', async () => {
    renderWithRedux(
      () => (
        <ThemeProvider>
          <div data-testid="test-child">Test Content</div>
        </ThemeProvider>
      ),
      { preloadedState }
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('integrates with next-themes provider', async () => {
    const testProps: Partial<ThemeProviderProps> = {
      attribute: 'class',
      defaultTheme: 'dark',
      enableSystem: true,
    };

    renderWithRedux(
      () => (
        <ThemeProvider {...testProps}>
          <div>Test Content</div>
        </ThemeProvider>
      ),
      { preloadedState }
    );

    // Verify content is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Verify theme class is applied to document
    expect(document.documentElement).toHaveAttribute('class');
  });

  it('respects theme from Redux state', async () => {
    const { store } = renderWithRedux(
      () => (
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      ),
      { preloadedState }
    );

    expect(store.getState().local.theme).toBe('light');
    expect(document.documentElement).toHaveAttribute('class');
  });
});
