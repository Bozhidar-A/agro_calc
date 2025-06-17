import { fireEvent, screen } from '@testing-library/react';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithReduxAndForm } from '@/test-utils/render';
import { ChemProtWorkingSolutionBuildInputRow } from './ChemProtWorkingSolutionBuildInputRow';

describe('ChemProtWorkingSolutionBuildInputRow', () => {
  const defaultProps = {
    varName: 'testField',
    displayName: 'Test Input',
    icon: <span>🌱</span>,
    translator: mockTranslateFunction,
    unit: mockTranslateFunction(SELECTABLE_STRINGS.LITER),
    id: 'test-input',
  };

  beforeEach(() => {
    initializeMockTranslate({ local: { lang: 'bg' } });
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return renderWithReduxAndForm<{ testField: string }>(
      (formProps) => (
        <ChemProtWorkingSolutionBuildInputRow
          {...defaultProps}
          {...props}
          form={formProps.form}
          translator={(key: string) =>
            mockTranslateFunction(key as keyof typeof SELECTABLE_STRINGS)
          }
        />
      ),
      {
        reactFormDefaultValues: { testField: '' },
      }
    );
  };

  it('renders with correct display name and icon', () => {
    renderComponent();

    expect(screen.getByText('Test Input')).toBeInTheDocument();
    expect(screen.getByText('🌱')).toBeInTheDocument();
  });

  it('renders with correct description', () => {
    renderComponent();

    expect(
      screen.getByText(
        mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_DESCRIPTION)
      )
    ).toBeInTheDocument();
  });

  it('renders input field with correct attributes', () => {
    renderComponent();

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveClass('text-center', 'text-xl');
  });

  it('displays correct unit', () => {
    renderComponent();

    const unitText = screen.getByText(/0 l/);
    expect(unitText).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    renderComponent();

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '42' } });

    expect(input).toHaveValue(42);
    expect(screen.getByText(/42 l/)).toBeInTheDocument();
  });

  it('handles empty input correctly', () => {
    renderComponent();

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });

    expect(input).toHaveValue(null);
    expect(screen.getByText(/0 l/)).toBeInTheDocument();
  });

  it('handles non-numeric input correctly', () => {
    renderComponent();

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(input).toHaveValue(null);
    expect(screen.getByText(/0 l/)).toBeInTheDocument();
  });

  it('displays custom display value when provided', () => {
    renderComponent({ displayValue: 'Custom Value' });

    expect(screen.getByText(/Custom Value l/)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    renderComponent();

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('overflow-hidden');

    const header = screen.getByTestId('card-header');
    expect(header).toHaveClass('bg-green-700', 'pb-2');

    const title = screen.getByTestId('card-title');
    expect(title).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-lg',
      'text-black',
      'dark:text-white'
    );
  });
});
