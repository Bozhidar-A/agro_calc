import { fireEvent, screen } from '@testing-library/react';
import { SowingRateDBData } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { CalculatorValueTypes } from '@/lib/utils';
import { initializeMockTranslate } from '@/test-utils/mocks';
import { renderWithReduxAndForm } from '@/test-utils/render';
import { BuildSowingRateRow } from './BuildSowingRateRow';

describe('BuildSowingRateRow', () => {
  // Mock data for slider type
  const mockSliderData: SowingRateDBData = {
    id: 'test-id',
    plant: {
      plantId: 'test-plant-id',
      plantLatinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
    },
    coefficientSecurity: {
      type: CalculatorValueTypes.SLIDER,
      unit: 'kg/ha',
      step: 0.1,
      minSliderVal: 10,
      maxSliderVal: 100,
    },
    wantedPlantsPerMeterSquared: {
      type: CalculatorValueTypes.CONST,
      unit: 'PLANTS_PER_M2',
      constValue: 50,
    },
    massPer1000g: {
      type: CalculatorValueTypes.CONST,
      unit: 'g',
      constValue: 50,
    },
    purity: {
      type: CalculatorValueTypes.CONST,
      unit: '%',
      constValue: 99,
    },
    germination: {
      type: CalculatorValueTypes.CONST,
      unit: '%',
      constValue: 95,
    },
    rowSpacing: {
      type: CalculatorValueTypes.CONST,
      unit: 'cm',
      constValue: 12.5,
    },
  };

  // Mock data for constant type
  const mockConstData: SowingRateDBData = {
    ...mockSliderData,
    coefficientSecurity: {
      type: CalculatorValueTypes.CONST,
      unit: 'kg/ha',
      constValue: 50,
    },
  };

  const preloadedState = {
    local: { lang: 'bg' },
    auth: { user: null, token: null, isAuthenticated: false },
  };

  const renderSliderComponent = (defaultValues = { coefficientSecurity: 0 }) => {
    initializeMockTranslate(preloadedState);
    return renderWithReduxAndForm(
      (props) => (
        <BuildSowingRateRow
          varName="coefficientSecurity"
          displayName="Seeds per Kg"
          activePlantDbData={mockSliderData}
          form={props.form}
          icon={<span>🌱</span>}
          translator={(key: string) => key}
          tourId="test-tour"
        />
      ),
      {
        reactFormDefaultValues: defaultValues,
        preloadedState,
      }
    );
  };

  const renderConstComponent = (defaultValues = { coefficientSecurity: 0 }) => {
    initializeMockTranslate(preloadedState);
    return renderWithReduxAndForm(
      (props) => (
        <BuildSowingRateRow
          varName="coefficientSecurity"
          displayName="Seeds per Kg"
          activePlantDbData={mockConstData}
          form={props.form}
          icon={<span>🌱</span>}
          translator={(key: string) => key}
          tourId="test-tour"
        />
      ),
      {
        reactFormDefaultValues: defaultValues,
        preloadedState,
      }
    );
  };

  describe('Slider Mode', () => {
    it('renders with correct display name and icon', () => {
      renderSliderComponent();
      expect(screen.getByText('Seeds per Kg')).toBeInTheDocument();
      expect(screen.getByText('🌱')).toBeInTheDocument();
    });

    it('renders with correct suggested range text', () => {
      renderSliderComponent();
      const rangeText = `${SELECTABLE_STRINGS.SOWING_RATE_INPUT_SUGGESTED_RANGE}: 10 - 100`;
      expect(screen.getByText(rangeText)).toBeInTheDocument();
    });

    it('renders both number input and range slider', () => {
      renderSliderComponent();
      expect(screen.getAllByRole('spinbutton')).toHaveLength(1);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('updates value display when input changes', () => {
      renderSliderComponent();
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '42' } });

      expect(screen.getByText('42 kg/ha')).toBeInTheDocument();
    });

    it('shows validation styling when value is out of bounds', () => {
      renderSliderComponent({ coefficientSecurity: 150 });
      const input = screen.getByRole('spinbutton');
      const slider = screen.getByRole('slider');

      expect(input).toHaveClass('border-red-500');
      expect(slider).toHaveClass('outside-safe-range');
    });
  });

  describe('Constant Mode', () => {
    it('renders with correct display name and icon', () => {
      renderConstComponent();
      expect(screen.getByText('Seeds per Kg')).toBeInTheDocument();
      expect(screen.getByText('🌱')).toBeInTheDocument();
    });

    it('renders with correct suggested value text', () => {
      renderConstComponent();
      const valueText = `${SELECTABLE_STRINGS.SOWING_RATE_INPUT_SUGGESTED_VALUE}: 50`;
      expect(screen.getByText(valueText)).toBeInTheDocument();
    });

    it('renders only number input (no slider)', () => {
      renderConstComponent();
      expect(screen.getAllByRole('spinbutton')).toHaveLength(1);
      expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    });

    it('updates value display when input changes', () => {
      renderConstComponent();
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '42' } });

      expect(screen.getByText('42 kg/ha')).toBeInTheDocument();
    });

    it('shows validation styling when value differs from constant', () => {
      renderConstComponent({ coefficientSecurity: 42 });
      const input = screen.getByRole('spinbutton');

      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('Common Functionality', () => {
    it('sets empty input to 0', () => {
      renderSliderComponent();
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '' } });

      expect(screen.getByText('0 kg/ha')).toBeInTheDocument();
    });

    it('handles non-numeric input', () => {
      renderSliderComponent();
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: 'not-a-number' } });

      expect(screen.getByText('0 kg/ha')).toBeInTheDocument();
    });

    it('has correct tour ID', () => {
      renderSliderComponent();
      const card = screen.getByTestId('test-tour');
      expect(card).toHaveAttribute('id', 'test-tour');
    });
  });
});
