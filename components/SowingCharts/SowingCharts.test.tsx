import { screen } from '@testing-library/react';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { SUPPORTED_LANGS, UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import { LocalSetUnitOfMeasurementLength } from '@/store/slices/localSettingsSlice';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithRedux } from '@/test-utils/render';
import SowingCharts from './SowingCharts';

describe('SowingCharts', () => {
  const mockData = {
    userId: 'test-user',
    plantId: 'test-plant',
    plantLatinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
    sowingRateSafeSeedsPerMeterSquared: 100,
    sowingRatePlantsPerAcre: 200,
    usedSeedsKgPerAcre: 50,
    internalRowHeightCm: 12.5,
    totalArea: 1,
    isDataValid: true,
  };

  describe('Acres Mode', () => {
    const preloadedState = {
      local: {
        lang: SUPPORTED_LANGS.BG.code,
        unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES,
      },
      auth: { user: null, token: null, isAuthenticated: false },
    };

    beforeEach(() => {
      initializeMockTranslate(preloadedState);
    });

    it('renders all chart sections', () => {
      renderWithRedux(() => <SowingCharts data={mockData} />, { preloadedState });

      // Check for main sections using translated strings
      expect(
        screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_VIZ))
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_VIZ_ALL_ELEMENTS))
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_VIZ_ELEMENTS_RELATIONSHIP)
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          mockTranslateFunction(
            SELECTABLE_STRINGS.SOWING_RATE_VIZ_COMPARE_CALCED_PARAMS as keyof typeof SELECTABLE_STRINGS
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_VIZ_PLANTING_EFFICIENCY)
        )
      ).toBeInTheDocument();
    });

    it('renders all charts with correct data', () => {
      renderWithRedux(() => <SowingCharts data={mockData} />, { preloadedState });

      // Check for chart components
      expect(screen.getAllByTestId('pie-chart')).toHaveLength(1);
      expect(screen.getAllByTestId('bar-chart')).toHaveLength(2);
      expect(screen.getAllByTestId('tooltip')).toHaveLength(3);
      expect(screen.getAllByTestId('bar')).toHaveLength(2);
      expect(screen.getAllByTestId('pie')).toHaveLength(1);
    });

    it('displays correct units for acres mode', () => {
      renderWithRedux(() => <SowingCharts data={mockData} />, { preloadedState });

      const kgAcreText = mockTranslateFunction(SELECTABLE_STRINGS.KG_ACRE);
      const plantsPerAcreText = mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_ACRE);

      // Use queryAllByText to handle multiple instances
      expect(screen.queryAllByText(kgAcreText).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(plantsPerAcreText).length).toBeGreaterThan(0);
    });

    it('updates display when measurement unit changes', async () => {
      // Start with hectares
      const initialState = {
        local: {
          lang: 'bg',
          unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.HECTARES,
        },
        auth: { user: null, token: null, isAuthenticated: false },
      };

      const { store } = renderWithRedux(
        (mockProps) => <SowingCharts data={mockData} {...mockProps} />,
        { preloadedState: initialState }
      );

      // Verify initial hectares display
      await screen.findByText(/брой растения\/декар/i);

      // Change to acres
      store.dispatch(LocalSetUnitOfMeasurementLength(UNIT_OF_MEASUREMENT_LENGTH.ACRES));

      // Verify acres display
      await screen.findByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_ACRE));
    });
  });

  describe('Hectares Mode', () => {
    const preloadedState = {
      local: {
        lang: 'bg',
        unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.HECTARES,
      },
      auth: { user: null, token: null, isAuthenticated: false },
    };

    beforeEach(() => {
      initializeMockTranslate(preloadedState);
    });

    it('displays correct units for hectares mode', () => {
      renderWithRedux(() => <SowingCharts data={mockData} />, { preloadedState });

      // Use queryAllByText to handle multiple instances
      expect(screen.queryAllByText(/кг\/декар/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/брой растения\/декар/i).length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    const preloadedState = {
      local: {
        lang: 'bg',
        unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES,
      },
      auth: { user: null, token: null, isAuthenticated: false },
    };

    beforeEach(() => {
      initializeMockTranslate(preloadedState);
    });

    it('returns null when no data is provided', () => {
      const { container } = renderWithRedux(() => <SowingCharts data={null as any} />, {
        preloadedState,
      });

      // Check if the main chart container is not rendered
      expect(container.querySelector('.mt-8')).toBeNull();
    });

    it('handles zero values correctly', () => {
      const zeroData = {
        ...mockData,
        sowingRateSafeSeedsPerMeterSquared: 0,
        sowingRatePlantsPerAcre: 0,
        usedSeedsKgPerAcre: 0,
        internalRowHeightCm: 0,
      };

      renderWithRedux(() => <SowingCharts data={zeroData} />, { preloadedState });

      // Check if charts are still rendered
      expect(screen.getAllByTestId('pie-chart')).toHaveLength(1);
      expect(screen.getAllByTestId('bar-chart')).toHaveLength(2);
    });

    it('displays correct plant name in description', () => {
      renderWithRedux(() => <SowingCharts data={mockData} />, { preloadedState });

      const plantName = mockTranslateFunction(
        mockData.plantLatinName as keyof typeof SELECTABLE_STRINGS
      );
      const vizText = mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_VIZ_GENERAL);
      expect(screen.getByText(`${vizText} ${plantName}`)).toBeInTheDocument();
    });
  });
});
