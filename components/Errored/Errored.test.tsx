import { screen } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import Errored from './Errored';

jest.unmock('@/components/Errored/Errored');

describe('Errored', () => {
  beforeEach(() => {
    renderWithRedux((mockProps) => <Errored {...mockProps} />);
    jest.clearAllMocks();
  });

  it('renders the error heading', () => {
    const heading = screen.getByRole('heading', { name: /something went wrong/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'mb-4');
  });

  it('renders the error message', () => {
    const message = screen.getByText(/please try again later/i);
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-white');
  });

  it('has correct container styling', () => {
    // Outer container
    const outerContainer = screen.getByTestId('error-container');
    expect(outerContainer).toHaveClass(
      'w-full',
      'flex',
      'items-center',
      'justify-center',
      'h-screen'
    );

    // Inner container
    const innerContainer = screen.getByTestId('error-box');
    expect(innerContainer).toHaveClass('max-w-md', 'p-4', 'bg-red-800', 'rounded-lg', 'shadow-md');
  });
});
