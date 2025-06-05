import exp from 'constants';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import configureStore from 'redux-mock-store';
import { AuthLogout } from '@/store/slices/authSlice';
import { persistor, store } from '@/store/store';
import { act, renderWithProviders, screen, waitFor } from '@/test-utils';
import Header from './Header';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react Menu icon
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu Icon</div>,
  X: () => <div data-testid="close-icon">Close Icon</div>,
}));

// Mock the ThemeSwitcher component
jest.mock('@/components/ThemeSwitcher/ThemeSwitcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme Switcher</div>,
}));

// jest.mock('@/components/ui/button', () => ({ Button: ({ children, ...props }) => <button {...props}>{children}</button> }));

const mockStore = configureStore([]);

describe('Header Component', () => {
  let testStore;
  let testPersistor;

  beforeEach(() => {
    mockRouter.setCurrentUrl('/');
    global.fetch = jest.fn();

    // Setup mock store with initial state
    testStore = mockStore({
      auth: { isAuthenticated: false },
    });

    // Mock persistor methods
    testPersistor = {
      ...persistor,
      persist: jest.fn(),
    };
  });

  it('renders logo and basic elements', () => {
    renderWithProviders(<Header />, {}, testStore, testPersistor);

    expect(screen.getByText('Agro-Calc')).toBeInTheDocument();
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('shows login and register buttons when user is not authenticated', async () => {
    const user = userEvent.setup();

    testStore = mockStore({
      auth: { isAuthenticated: false },
    });

    renderWithProviders(<Header />, {}, testStore, testPersistor);

    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument();

    // Open the menu using the menu button
    const menuButton = screen.getByTestId('open-sheet-button');
    // menuButton.click();
    await user.click(menuButton);

    await waitFor(() => {
      screen.debug();
      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    });
  });

  it('shows welcome message and logout button when user is authenticated', async () => {
    const user = userEvent.setup();
    const mockUser = { email: 'test@example.com' };

    testStore = mockStore({
      auth: { isAuthenticated: true, user: mockUser },
    });

    renderWithProviders(<Header />, {}, testStore, testPersistor);

    // Open the menu using the menu button
    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    expect(screen.getByText(`Welcome, ${mockUser.email}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('handles logout successfully', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ message: 'Logged out successfully' }),
    });

    const mockUser = { email: 'test@example.com' };
    testStore = mockStore({
      auth: { isAuthenticated: true, user: mockUser },
    });

    renderWithProviders(<Header />, {}, testStore, testPersistor);

    // Open the menu using the menu button
    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    // Click logout
    await user.click(screen.getByRole('button', { name: /logout/i }));

    // Check if the AuthLogout action was dispatched
    const actions = testStore.getActions();
    expect(actions).toContainEqual(AuthLogout());
  });

  it('handles logout failure', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log');
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const mockUser = { email: 'test@example.com' };
    testStore = mockStore({
      auth: { isAuthenticated: true, user: mockUser },
    });

    renderWithProviders(<Header />, {}, testStore, testPersistor);

    // Open the menu using the menu button
    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    // Click logout
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(alertMock).toHaveBeenCalledWith('Logout failed');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('handles unauthorized logout', async () => {
    const user = userEvent.setup();
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

    global.fetch.mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve({ message: 'Unauthorized' }),
    });

    const mockUser = { email: 'test@example.com' };
    testStore = mockStore({
      auth: { isAuthenticated: true, user: mockUser },
    });

    renderWithProviders(<Header />, {}, testStore, testPersistor);

    // Open the menu using the menu button
    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    // Click logout
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(alertMock).toHaveBeenCalledWith('Unauthorized');
  });

  it('navigation links work correctly', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouterProvider>
        <Header />
      </MemoryRouterProvider>,
      {},
      testStore,
      testPersistor
    );

    // Open the menu using the menu button
    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    // Click home link
    await user.click(screen.getByRole('link', { name: /home/i }));

    expect(mockRouter.asPath).toBe('/');
  });

  it('checks if protected route link exists', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Header />, {}, testStore, testPersistor);

    // Open the menu using the menu button
    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    expect(screen.getByText('prot')).toBeInTheDocument();
  });

  it('closes sheet when close button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Header />, {}, testStore, testPersistor);

    expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument();

    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    const closeButton = screen.getByTestId('close-icon');
    await user.click(closeButton);

    // Use waitFor to check for the absence of the sheet content
    await waitFor(() => {
      expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument();
    });
  });

  it('closes when link is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouterProvider>
        <Header />
      </MemoryRouterProvider>,
      {},
      testStore,
      testPersistor
    );

    const menuButton = screen.getByTestId('open-sheet-button');
    await user.click(menuButton);

    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);

    // Use waitFor to check for the absence of the sheet content
    await waitFor(() => {
      expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument();
    });
  });
});
