import { screen, fireEvent } from '@testing-library/react';
import { renderWithReduxAndForm } from '@/test-utils/render';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { SeedCombinedRow } from './SeedCombinedRow';

// Mock the useTranslate hook
jest.mock('@/hooks/useTranslate', () => ({
    useTranslate: () => mockTranslateFunction
}));

// Mock CombinedMeasurementSwitcher component
jest.mock('../CombinedMeasurementSwitcher/CombinedMeasurementSwitcher', () => ({
    __esModule: true,
    default: () => <div data-testid="measurement-switcher">Measurement Switcher</div>
}));

describe('SeedCombinedRow', () => {
    const mockDbData = [
        {
            id: 'plant1',
            latinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
            plantType: 'legumes',
            minSeedingRate: 50,
            maxSeedingRate: 150
        },
        {
            id: 'plant2',
            latinName: SELECTABLE_STRINGS.GLYCINE_MAX,
            plantType: 'legumes',
            minSeedingRate: 40,
            maxSeedingRate: 120
        }
    ];

    const defaultFormValues = {
        legumes: [
            {
                active: true,
                id: '',
                dropdownPlant: '',
                seedingRate: 0,
                participation: 0,
                seedingRateInCombination: 0
            }
        ]
    };

    const preloadedState = {
        local: {
            lang: 'bg'
        },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
    });

    it('renders all form fields correctly', () => {
        renderWithReduxAndForm(
            ({ form }) => (
                <SeedCombinedRow
                    form={form}
                    name="legumes"
                    index={0}
                    dbData={mockDbData}
                />
            ),
            {
                preloadedState,
                reactFormDefaultValues: defaultFormValues
            }
        );

        // Check for presence of all form elements
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        // Check for input fields (seeding rate and participation)
        expect(screen.getAllByRole('spinbutton')).toHaveLength(2);
        expect(screen.getByTestId('measurement-switcher')).toBeInTheDocument();
    });

    it('handles active/inactive state correctly', () => {
        const { container } = renderWithReduxAndForm(
            ({ form }) => (
                <SeedCombinedRow
                    form={form}
                    name="legumes"
                    index={0}
                    dbData={mockDbData}
                />
            ),
            {
                preloadedState,
                reactFormDefaultValues: {
                    legumes: [{ ...defaultFormValues.legumes[0], active: false }]
                }
            }
        );

        // Find the main container div with grid class
        const mainContainer = container.querySelector('.grid');
        expect(mainContainer).toHaveClass('opacity-50');

        // Fields should be disabled when inactive
        expect(screen.getByRole('combobox')).toBeDisabled();
        expect(screen.getAllByRole('spinbutton')[0]).toBeDisabled();
        expect(screen.getAllByRole('spinbutton')[1]).toBeDisabled();
    });

    it('displays plant selection dropdown with correct options', () => {
        renderWithReduxAndForm(
            ({ form }) => (
                <SeedCombinedRow
                    form={form}
                    name="legumes"
                    index={0}
                    dbData={mockDbData}
                />
            ),
            {
                preloadedState,
                reactFormDefaultValues: defaultFormValues
            }
        );

        const select = screen.getByRole('combobox');
        fireEvent.click(select);

        // Check if plant options are rendered - using the translated values
        const plant1 = mockTranslateFunction(mockDbData[0].latinName as keyof typeof SELECTABLE_STRINGS);
        const plant2 = mockTranslateFunction(mockDbData[1].latinName as keyof typeof SELECTABLE_STRINGS);
        expect(screen.getByText(plant1)).toBeInTheDocument();
        expect(screen.getByText(plant2)).toBeInTheDocument();
    });

    it('shows seeding rate validation hints when value is out of range', () => {
        renderWithReduxAndForm(
            ({ form }) => (
                <SeedCombinedRow
                    form={form}
                    name="legumes"
                    index={0}
                    dbData={mockDbData}
                />
            ),
            {
                preloadedState,
                reactFormDefaultValues: {
                    legumes: [{
                        active: true,
                        id: 'plant1',
                        dropdownPlant: mockDbData[0].latinName,
                        seedingRate: 200, // Above max
                        participation: 50,
                        seedingRateInCombination: 100
                    }]
                }
            }
        );

        // Check if min/max hints are displayed
        expect(screen.getByText('Min: 50 | Max: 150')).toHaveClass('text-yellow-500');
    });

    it('disables input fields when no plant is selected', () => {
        renderWithReduxAndForm(
            ({ form }) => (
                <SeedCombinedRow
                    form={form}
                    name="legumes"
                    index={0}
                    dbData={mockDbData}
                />
            ),
            {
                preloadedState,
                reactFormDefaultValues: defaultFormValues
            }
        );

        // Check if input fields are disabled
        const [seedingRateInput, participationInput] = screen.getAllByRole('spinbutton');
        expect(seedingRateInput).toBeDisabled();
        expect(participationInput).toBeDisabled();
    });
}); 