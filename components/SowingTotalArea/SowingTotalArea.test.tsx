import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithReduxAndForm } from '@/test-utils/render';
import SowingTotalArea from './SowingTotalArea';

// Mock the SowingOutput component
jest.mock('../SowingOutput/SowingOutput', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-sowing-output">Mocked Output</div>,
}));

describe('SowingTotalArea', () => {
  const mockDataToBeSaved = {
    userId: 'test-user',
    plantId: 'test-plant',
    plantLatinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
    internalRowHeightCm: 12.5,
    isDataValid: true,
    sowingRateSafeSeedsPerMeterSquared: 100,
    sowingRatePlantsPerAcre: 200,
    usedSeedsKgPerAcre: 50,
    totalArea: 0,
  };

  const preloadedState = {
    local: {
      lang: 'bg',
      unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.HECTARES,
    },
    auth: { user: null, token: null, isAuthenticated: false },
  };

  beforeEach(() => {
    initializeMockTranslate(preloadedState);
    jest.clearAllMocks();
  });

  it('renders with correct initial state', () => {
    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState,
        reactFormDefaultValues: { totalArea: 0 },
      }
    );

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    const unit = mockTranslateFunction(
      SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES
    );
    expect(screen.getByText(new RegExp(`^0\\s*${unit}$`))).toBeInTheDocument();
    expect(
      screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_INPUT_TOTAL_AREA))
    ).toBeInTheDocument();
  });

  it('handles input changes correctly', async () => {
    const user = userEvent.setup();
    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState,
        reactFormDefaultValues: { totalArea: 0 },
      }
    );

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '10');

    const unit = mockTranslateFunction(
      SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES
    );
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`^10\\s*${unit}$`))).toBeInTheDocument();
      expect(screen.getByTestId('mock-sowing-output')).toBeInTheDocument();
    });
  });

  it('prevents negative values', async () => {
    const user = userEvent.setup();
    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState,
        reactFormDefaultValues: { totalArea: 0 },
      }
    );

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '-10');

    const unit = mockTranslateFunction(
      SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES
    );
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`^10\\s*${unit}$`))).toBeInTheDocument();
      expect(screen.getByTestId('mock-sowing-output')).toBeInTheDocument();
    });
  });

  it('handles empty input correctly', async () => {
    const user = userEvent.setup();
    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState,
        reactFormDefaultValues: { totalArea: 10 },
      }
    );

    const input = screen.getByRole('spinbutton');
    await user.clear(input);

    const unit = mockTranslateFunction(
      SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES
    );
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`^0\\s*${unit}$`))).toBeInTheDocument();
    });
  });

  it('shows validation styling for invalid values', () => {
    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState,
        reactFormDefaultValues: { totalArea: -1 },
      }
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass('border-red-500');
  });

  it('respects unit of measurement from Redux state', () => {
    const acresState = {
      ...preloadedState,
      local: {
        ...preloadedState.local,
        unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES,
      },
    };

    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState: acresState,
        reactFormDefaultValues: { totalArea: 10 },
      }
    );

    const unit = mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES);
    expect(screen.getByText(new RegExp(`^10\\s*${unit}$`))).toBeInTheDocument();
  });

  it('shows SowingOutput component for valid values', async () => {
    const user = userEvent.setup();
    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState,
        reactFormDefaultValues: { totalArea: 0 },
      }
    );

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '10');

    await waitFor(() => {
      expect(screen.getByTestId('mock-sowing-output')).toBeInTheDocument();
    });
  });

  it('hides SowingOutput component for invalid values', () => {
    renderWithReduxAndForm(
      ({ form }) => <SowingTotalArea form={form} dataToBeSaved={mockDataToBeSaved} />,
      {
        preloadedState,
        reactFormDefaultValues: { totalArea: -1 },
      }
    );

    expect(screen.queryByTestId('mock-sowing-output')).not.toBeInTheDocument();
  });
});
