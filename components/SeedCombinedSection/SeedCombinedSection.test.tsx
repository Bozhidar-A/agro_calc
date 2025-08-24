import { screen } from '@testing-library/react';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithReduxAndForm } from '@/test-utils/render';
import { SeedCombinedSection } from './SeedCombinedSection';

// Mock the SeedCombinedRow component
jest.mock('@/components/SeedCombinedRow/SeedCombinedRow', () => ({
  SeedCombinedRow: () => <div data-testid="seed-combined-row">Seed Combined Row</div>,
}));

describe('SeedCombinedSection', () => {
  const mockDbData = [
    {
      id: 'plant1',
      latinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
      plantType: 'legumes',
      minSeedingRate: 50,
      maxSeedingRate: 150,
    },
    {
      id: 'plant2',
      latinName: SELECTABLE_STRINGS.GLYCINE_MAX,
      plantType: 'legumes',
      minSeedingRate: 40,
      maxSeedingRate: 120,
    },
  ];

  const defaultFormValues = {
    legumes: [
      {
        active: true,
        id: '',
        dropdownPlant: '',
        seedingRate: 0,
        participation: 0,
        seedingRateInCombination: 0,
      },
    ],
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
  });

  it('renders section with correct title and icons', () => {
    renderWithReduxAndForm(
      ({ form }) => (
        <SeedCombinedSection
          form={form}
          name="legumes"
          title="Test Section"
          maxPercentage={60}
          dbData={mockDbData}
        />
      ),
      {
        preloadedState,
        reactFormDefaultValues: defaultFormValues,
      }
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_TOTAL_PARTICIPATION_LABEL)}: 0.0%`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_MAX_PARTICIPATION)}: 60%`
      )
    ).toHaveClass('text-green-500');
  });

  it('shows warning when participation exceeds max percentage', () => {
    const formValuesWithHighParticipation = {
      legumes: [
        {
          active: true,
          id: 'plant1',
          dropdownPlant: SELECTABLE_STRINGS.PISUM_SATIVUM,
          seedingRate: 100,
          participation: 70, // Exceeds maxPercentage of 60
          seedingRateInCombination: 70,
        },
      ],
    };

    renderWithReduxAndForm(
      ({ form }) => (
        <SeedCombinedSection
          form={form}
          name="legumes"
          title="Test Section"
          maxPercentage={60}
          dbData={mockDbData}
        />
      ),
      {
        preloadedState,
        reactFormDefaultValues: formValuesWithHighParticipation,
      }
    );

    expect(
      screen.getByText(
        `${mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_MAX_PARTICIPATION)}: 60%`
      )
    ).toHaveClass('text-red-500');
    expect(
      screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_VALUES_OUTSIDE_LIMIT))
    ).toBeInTheDocument();
  });

  it('renders correct column headers based on unit of measurement', () => {
    renderWithReduxAndForm(
      ({ form }) => (
        <SeedCombinedSection
          form={form}
          name="legumes"
          title="Test Section"
          maxPercentage={60}
          dbData={mockDbData}
        />
      ),
      {
        preloadedState: {
          ...preloadedState,
          local: {
            ...preloadedState.local,
            unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES,
          },
        },
        reactFormDefaultValues: defaultFormValues,
      }
    );

    expect(
      screen.getByText(
        mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON_LABEL)
      )
    ).toBeInTheDocument();
  });

  it('renders correct number of SeedCombinedRow components', () => {
    const formValuesWithMultipleRows = {
      legumes: [
        defaultFormValues.legumes[0],
        { ...defaultFormValues.legumes[0] },
        { ...defaultFormValues.legumes[0] },
      ],
    };

    renderWithReduxAndForm(
      ({ form }) => (
        <SeedCombinedSection
          form={form}
          name="legumes"
          title="Test Section"
          maxPercentage={60}
          dbData={mockDbData}
        />
      ),
      {
        preloadedState,
        reactFormDefaultValues: formValuesWithMultipleRows,
      }
    );

    const rows = screen.getAllByTestId('seed-combined-row');
    expect(rows).toHaveLength(3);
  });

  it('renders mobile view headers correctly', () => {
    renderWithReduxAndForm(
      ({ form }) => (
        <SeedCombinedSection
          form={form}
          name="legumes"
          title="Test Section"
          maxPercentage={60}
          dbData={mockDbData}
        />
      ),
      {
        preloadedState,
        reactFormDefaultValues: defaultFormValues,
      }
    );

    // Check mobile view header
    const mobileHeaders = screen.getAllByText(
      mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PLANT)
    );
    // The mobile header is the one inside the md:hidden container
    const mobileHeader = mobileHeaders.find((header) => header.closest('.md\\:hidden'));
    expect(mobileHeader).toBeInTheDocument();
  });
});
