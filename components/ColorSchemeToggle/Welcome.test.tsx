import { render, screen } from '@/test-utils';
import { ColorSchemeToggle } from './ColorSchemeToggle';

describe('ColorSchemeToggle component', () => {
  it('has Auto text', () => {
    render(<ColorSchemeToggle />);
    expect(screen.getByText('Auto'));
  });
});
