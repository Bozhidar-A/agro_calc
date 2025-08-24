import { screen } from '@testing-library/react';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import { LocalSetUnitOfMeasurementLength } from '@/store/slices/localSettingsSlice';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithRedux } from '@/test-utils/render';
import CombinedCharts from './CombinedCharts';

describe('CombinedCharts', () => {
  const mockData = {
    plants: [
      {
        plantLatinName: SELECTABLE_STRINGS.MEDICAGO_SATIVA,
        plantType: SELECTABLE_STRINGS.COMBINED_PLANT,
        seedingRate: 150,
        participation: 60,
        combinedRate: 90,
        pricePerAcreBGN: 100,
      },
      {
        plantLatinName: SELECTABLE_STRINGS.GLYCINE_MAX,
        plantType: SELECTABLE_STRINGS.COMBINED_PLANT,
        seedingRate: 100,
        participation: 40,
        combinedRate: 40,
        pricePerAcreBGN: 80,
      },
    ],
    totalPrice: 180,
    userId: 'test-user',
    isDataValid: true,
  };

  describe('Rendering', () => {
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

    it('renders all chart sections when data is provided', () => {
      renderWithRedux(() => <CombinedCharts data={mockData} />, { preloadedState });

      // Check for main title and description
      expect(
        screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_TITLE))
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_DESCRIPTION)
        )
      ).toBeInTheDocument();

      // Check for chart titles
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_BY_PLANT_TYPE)
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PARTICIPATION_DISTRIBUTION)
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON)
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_COMPARISON))
      ).toBeInTheDocument();

      // Check for chart components
      expect(screen.getAllByTestId('bar-chart')).toHaveLength(2);
      expect(screen.getAllByTestId('pie-chart')).toHaveLength(1);
      expect(screen.getAllByTestId('tooltip')).toHaveLength(4);
      expect(screen.getAllByTestId('legend')).toHaveLength(4);
    });

    it('renders nothing when no data is provided', () => {
      renderWithRedux(() => <CombinedCharts data={null} />, { preloadedState });

      // Check that main title is not rendered
      expect(
        screen.queryByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_TITLE))
      ).not.toBeInTheDocument();
    });

    it('renders nothing when plants array is empty', () => {
      const emptyData = {
        ...mockData,
        plants: [],
      };

      renderWithRedux(() => <CombinedCharts data={emptyData} />, { preloadedState });

      // Check that main title is not rendered
      expect(
        screen.queryByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_VISUALIZATION_TITLE))
      ).not.toBeInTheDocument();
    });
  });

  describe('Unit Switching', () => {
    it('displays hectare units when hectares is selected', () => {
      const hectaresState = {
        local: {
          lang: 'bg',
          unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.HECTARES,
        },
        auth: { user: null, token: null, isAuthenticated: false },
      };

      renderWithRedux(() => <CombinedCharts data={mockData} />, { preloadedState: hectaresState });

      // Check that hectares title is displayed
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON)
        )
      ).toBeInTheDocument();
    });

    it('displays acre units when acres is selected', () => {
      const acresState = {
        local: {
          lang: 'bg',
          unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES,
        },
        auth: { user: null, token: null, isAuthenticated: false },
      };

      renderWithRedux(() => <CombinedCharts data={mockData} />, { preloadedState: acresState });

      // Check that acres title is displayed
      expect(
        screen.getByText(
          mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON)
        )
      ).toBeInTheDocument();
    });

    it('updates display when measurement unit changes', async () => {
      const initialState = {
        local: {
          lang: 'bg',
          unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.HECTARES,
        },
        auth: { user: null, token: null, isAuthenticated: false },
      };

      const { store } = renderWithRedux(
        (mockProps) => <CombinedCharts data={mockData} {...mockProps} />,
        { preloadedState: initialState }
      );

      //verify initial hectares display
      expect(screen.getByTestId('line')).toHaveAttribute(
        'data-name',
        mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON_LABEL)
      );

      //change to acres
      store.dispatch(LocalSetUnitOfMeasurementLength(UNIT_OF_MEASUREMENT_LENGTH.ACRES));

      //wait for it to update because redux state
      //verify acres display
      expect(await screen.getByTestId('line')).toHaveAttribute(
        'data-name',
        mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON_LABEL)
      );

      //verify hectares display is not present
      expect(await screen.queryByTestId('line')).not.toHaveAttribute(
        'data-name',
        mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON_LABEL)
      );
    });
  });

  describe('Chart Data Display', () => {
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

    it('displays correct plant names in charts', () => {
      renderWithRedux(() => <CombinedCharts data={mockData} />, { preloadedState });

      // Check for translated plant names in data attributes
      mockData.plants.forEach((plant) => {
        const translatedName = mockTranslateFunction(
          plant.plantLatinName as keyof typeof SELECTABLE_STRINGS
        );
        const elements = screen.getAllByText(translatedName);
        expect(elements.length).toBeGreaterThan(0);

        // Also check data-name attributes for chart elements
        const chartElements = screen.getAllByTestId('pie');
        chartElements.forEach((element) => {
          const nameElements = element.querySelectorAll(`[data-name="${translatedName}"]`);
          expect(nameElements.length).toBeGreaterThan(0);
        });
      });
    });

    it('displays correct chart legends', () => {
      renderWithRedux(() => <CombinedCharts data={mockData} />, { preloadedState });

      // Check for legend labels in data-name attributes
      const barElements = screen.getAllByTestId('bar');
      const barNames = barElements.map((el) => el.getAttribute('data-name'));

      expect(barNames).toContain(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_SOWING_RATE));
      expect(barNames).toContain(
        mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_SINGLE_PLANT)
      );
      expect(barNames).toContain(
        mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_SOWING_RATE_MIX_PLANT)
      );
    });
  });
});
