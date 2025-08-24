import { screen } from '@testing-library/react';
import { SupportedOAuthProvider } from '@/lib/interfaces';
import { render } from '@/test-utils/render';
import { OAuthButton } from './OAuthButton';

describe('OAuthButton', () => {
  const mockButtonData: SupportedOAuthProvider = {
    name: 'GitHub',
    authURL: 'https://example.com/auth',
    icon: 'github',
  };

  it('renders with correct auth URL', () => {
    render(<OAuthButton buttonData={mockButtonData} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockButtonData.authURL);
  });

  it('renders with the provided icon', () => {
    render(<OAuthButton buttonData={mockButtonData} />);
    // Since SimpleIconToSVG renders an SVG, we can check for its presence
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with correct styling', () => {
    render(<OAuthButton buttonData={mockButtonData} />);
    const element = screen.getByRole('link');
    expect(element).toHaveClass('dark:text-white', 'font-bold');
  });

  it('renders as an anchor tag', () => {
    render(<OAuthButton buttonData={mockButtonData} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.tagName.toLowerCase()).toBe('a');
  });
});
