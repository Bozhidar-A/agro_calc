import { screen } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import Header from './Header';

// Mock the Sidebar component since we want to test Header in isolation
jest.mock('@/components/Sidebar/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="mock-sidebar">Sidebar</div>;
  };
});

describe('Header', () => {
  const preloadedState = {
    local: { lang: 'bg' },
    auth: { user: null, token: null, isAuthenticated: false },
  };

  it('renders the logo text', () => {
    renderWithRedux(() => <Header />, { preloadedState });
    const logo = screen.getByText('Agro-Calc');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('text-2xl', 'font-bold', 'text-green-700');
  });

  it('renders the logo link to home page', () => {
    renderWithRedux(() => <Header />, { preloadedState });
    const homeLink = screen.getByRole('link', { name: /agro-calc/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders with correct layout classes', () => {
    renderWithRedux(() => <Header />, { preloadedState });

    //check header container
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('w-full', 'py-4', 'shadow-md', 'shadow-green-500/50', 'h-max-20vh');

    //check inner container
    const innerContainer = header.firstElementChild;
    expect(innerContainer).toHaveClass('w-full', 'px-6', 'flex', 'justify-between', 'items-center');
  });

  it('renders the sidebar component', () => {
    renderWithRedux(() => <Header />, { preloadedState });
    const sidebar = screen.getByTestId('mock-sidebar');
    expect(sidebar).toBeInTheDocument();

    //check sidebar container
    const sidebarContainer = sidebar.parentElement;
    expect(sidebarContainer).toHaveClass('flex', 'items-center', 'space-x-4');
  });
});
