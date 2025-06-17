import { fireEvent, screen } from '@testing-library/react';
import { ChemProtPercentFormValues } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithReduxAndForm } from '@/test-utils/render';
import { ChemProtPSBuildInputRow } from './ChemProtPSBuildInputRow';

describe('ChemProtPSBuildInputRow', () => {
  const defaultValues = {
    desiredPercentage: 0,
    sprayerVolume: 0,
    calculatedAmount: 0,
  };

  beforeEach(() => {
    initializeMockTranslate({ local: { lang: 'bg' } });
    renderWithReduxAndForm<ChemProtPercentFormValues>(
      (props) => (
        <ChemProtPSBuildInputRow
          varName="desiredPercentage"
          displayName="Test Display"
          form={props.form}
          icon={<span>icon</span>}
          unit={mockTranslateFunction(SELECTABLE_STRINGS.LITER)}
          tourId="test-tour"
        />
      ),
      { reactFormDefaultValues: defaultValues }
    );
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct display name', () => {
      expect(screen.getByText('Test Display')).toBeInTheDocument();
    });

    it('renders with correct unit', () => {
      expect(screen.getByText('0 l')).toBeInTheDocument();
    });

    it('renders with correct tour ID', () => {
      const card = screen.getByTestId('test-tour');
      expect(card).toHaveAttribute('id', 'test-tour');
    });

    it('renders the icon', () => {
      expect(screen.getByText('icon')).toBeInTheDocument();
    });

    it('has correct styling classes', () => {
      const header = screen.getByTestId('test-tour').querySelector('.bg-green-700');
      expect(header).toHaveClass('bg-green-700', 'pb-2');
    });
  });

  describe('Input Handling', () => {
    it('updates input value and display when changed', () => {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '42' } });
      expect(input).toHaveValue(42);
      expect(screen.getByText('42 l')).toBeInTheDocument();
    });

    it('sets value to 0 when input is empty', () => {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '' } });
      expect(input).toHaveValue(0);
      expect(screen.getByText('0 l')).toBeInTheDocument();
    });

    it('sets value to 0 when input is not a number', () => {
      const input = screen.getByRole('spinbutton');
      // Note: type="number" inputs typically prevent non-numeric input,
      // but we test the handler logic anyway
      fireEvent.change(input, { target: { value: 'not-a-number' } });
      expect(input).toHaveValue(0);
      expect(screen.getByText('0 l')).toBeInTheDocument();
    });

    it('handles negative numbers by setting to 0', () => {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '-42' } });
      expect(input).toHaveValue(0);
      expect(screen.getByText('0 l')).toBeInTheDocument();
    });

    it('handles decimal numbers correctly', () => {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '42.5' } });
      expect(input).toHaveValue(42.5);
      expect(screen.getByText('42.5 l')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('updates form value when input changes', () => {
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '42' } });
      expect(input).toHaveValue(42);
    });

    it('initializes with form default value', () => {
      renderWithReduxAndForm<ChemProtPercentFormValues>(
        (props) => (
          <ChemProtPSBuildInputRow
            varName="desiredPercentage"
            displayName="Test Display"
            form={props.form}
            icon={<span>icon</span>}
            unit={mockTranslateFunction(SELECTABLE_STRINGS.LITER)}
            tourId="test-tour"
          />
        ),
        { reactFormDefaultValues: { ...defaultValues, desiredPercentage: 10 } }
      );
      expect(screen.getByText('10 l')).toBeInTheDocument();
    });
  });
});
