import { screen } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import SowingMeasurementSwitcher from './SowingMeasurementSwitcher';
import { LocalSetUnitOfMeasurementLength } from '@/store/slices/localSettingsSlice';

// Mock the useTranslate hook
jest.mock('@/hooks/useTranslate', () => ({
    useTranslate: () => mockTranslateFunction
}));

// Mock the DisplayOutputRow component
jest.mock('@/app/calculators/sowing/page', () => ({
    DisplayOutputRow: ({ data, text, unit }: { data: number; text: string; unit: string }) => (
        <div data-testid="display-output-row">
            <span data-testid="row-data">{data}</span>
            <span data-testid="row-text">{text}</span>
            <span data-testid="row-unit">{unit}</span>
        </div>
    )
}));

describe('SowingMeasurementSwitcher', () => {
    const mockData = {
        userId: 'test-user',
        plantId: 'test-plant',
        plantLatinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
        sowingRateSafeSeedsPerMeterSquared: 100,
        sowingRatePlantsPerAcre: 200,
        usedSeedsKgPerAcre: 50,
        internalRowHeightCm: 12.5,
        totalArea: 1,
        isDataValid: true
    };

    describe('Acres Mode', () => {
        const preloadedState = {
            local: {
                lang: 'bg',
                unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES
            },
            auth: { user: null, token: null, isAuthenticated: false }
        };

        beforeEach(() => {
            initializeMockTranslate(preloadedState);
        });

        it('displays correct values and units for acres', async () => {
            renderWithRedux(
                (mockProps) => <SowingMeasurementSwitcher dataToBeSaved={mockData} {...mockProps} />,
                { preloadedState }
            );

            await screen.findByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_ACRE));
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_ACRE))).toBeInTheDocument();
            expect(screen.getByText('200')).toBeInTheDocument();
        });
    });

    describe('Hectares Mode', () => {
        const preloadedState = {
            local: {
                lang: 'bg',
                unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.HECTARES
            },
            auth: { user: null, token: null, isAuthenticated: false }
        };

        beforeEach(() => {
            initializeMockTranslate(preloadedState);
        });

        it('displays correct converted values and units for hectares', async () => {
            renderWithRedux(
                (mockProps) => <SowingMeasurementSwitcher dataToBeSaved={mockData} {...mockProps} />,
                { preloadedState }
            );

            await screen.findByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_HECTARE));
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_HECTARE))).toBeInTheDocument();
            expect(screen.getByText('2000')).toBeInTheDocument();
        });
    });

    describe('Invalid Mode', () => {
        const preloadedState = {
            local: {
                lang: 'bg',
                unitOfMeasurementLength: 'invalid'
            },
            auth: { user: null, token: null, isAuthenticated: false }
        };

        beforeEach(() => {
            initializeMockTranslate(preloadedState);
        });

        it('returns null for invalid unit of measurement', async () => {
            renderWithRedux(
                (mockProps) => <SowingMeasurementSwitcher dataToBeSaved={mockData} {...mockProps} />,
                { preloadedState }
            );

            expect(screen.queryByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_ACRE))).not.toBeInTheDocument();
        });
    });

    describe('State Changes', () => {
        it('updates display when measurement unit changes', async () => {
            // Start with hectares
            const initialState = {
                local: {
                    lang: 'bg',
                    unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.HECTARES
                },
                auth: { user: null, token: null, isAuthenticated: false }
            };

            const { store } = renderWithRedux(
                (mockProps) => <SowingMeasurementSwitcher dataToBeSaved={mockData} {...mockProps} />,
                { preloadedState: initialState }
            );

            // Verify initial hectares display
            await screen.findByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_HECTARE));
            expect(screen.getByText('2000')).toBeInTheDocument();

            // Change to acres
            store.dispatch(LocalSetUnitOfMeasurementLength(UNIT_OF_MEASUREMENT_LENGTH.ACRES));

            // Verify acres display
            await screen.findByText(mockTranslateFunction(SELECTABLE_STRINGS.PLANTS_PER_ACRE));
            expect(screen.getByText('200')).toBeInTheDocument();
        });

        it('handles invalid measurement unit gracefully', async () => {
            const initialState = {
                local: {
                    lang: 'bg',
                    unitOfMeasurementLength: 'INVALID_UNIT'
                },
                auth: { user: null, token: null, isAuthenticated: false }
            };

            renderWithRedux(
                (mockProps) => <SowingMeasurementSwitcher dataToBeSaved={mockData} {...mockProps} />,
                { preloadedState: initialState }
            );

            // Should return null for invalid unit
            expect(screen.queryByTestId('display-output-row')).not.toBeInTheDocument();
        });
    });
});
