import { screen } from '@testing-library/react';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { render } from '@/test-utils/render';
import { ChemProtWorkingSolutionDisplayOutputRow } from './ChemProtWorkingSolutionDisplayOutputRow';

describe('ChemProtWorkingSolutionDisplayOutputRow', () => {
  const defaultProps = {
    data: 42.12745,
    text: 'Test Label',
    unit: mockTranslateFunction(SELECTABLE_STRINGS.LITER),
    decimals: 2,
    base: 10,
  };

  beforeEach(() => {
    initializeMockTranslate({ local: { lang: 'bg' } });
  });

  it('renders with correct label and formatted value', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('42.13')).toBeInTheDocument();
    expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.LITER))).toBeInTheDocument();
  });

  it('handles NaN values by displaying 0', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} data={NaN} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('respects custom decimal places', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} decimals={4} />);

    expect(screen.getByText('42.1275')).toBeInTheDocument();
  });

  it('respects custom base for rounding', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} base={5} />);

    expect(screen.getByText('42.12')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} />);

    const row = screen.getByTestId('display-output-row');
    expect(row).toHaveClass(
      'flex',
      'justify-between',
      'items-center',
      'border-b',
      'pb-2',
      'sm:pb-3'
    );

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('font-semibold', 'text-lg', 'sm:text-xl');

    const value = screen.getByText('42.13');
    expect(value).toHaveClass('text-lg', 'sm:text-xl', 'font-bold');
  });

  it('handles zero values correctly', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} data={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles negative values correctly', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} data={-42.12345} />);

    expect(screen.getByText('-42.12')).toBeInTheDocument();
  });

  it('handles very large numbers correctly', () => {
    render(<ChemProtWorkingSolutionDisplayOutputRow {...defaultProps} data={1234567.89} />);

    expect(screen.getByText('1234567.89')).toBeInTheDocument();
  });
});
