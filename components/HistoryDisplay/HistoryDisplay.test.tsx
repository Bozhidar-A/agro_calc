import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryDisplay from './HistoryDisplay';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithRedux } from '@/test-utils/render';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';

// Mock the chart components since we don't need to test their rendering
jest.mock('../SowingCharts/SowingCharts', () => ({
    __esModule: true,
    default: () => <div data-testid="sowing-charts">Sowing Charts</div>
}));

jest.mock('../CombinedCharts/CombinedCharts', () => ({
    __esModule: true,
    default: () => <div data-testid="combined-charts">Combined Charts</div>
}));

jest.mock('../ChemWorkingSolutionCharts/ChemWorkingSolutionCharts', () => ({
    __esModule: true,
    default: () => <div data-testid="chem-working-solution-charts">Chem Working Solution Charts</div>
}));

// Mock sample data
const mockSowingRateHistory = [
    {
        id: '1',
        createdAt: new Date('2024-01-01').toISOString(),
        plant: { latinName: SELECTABLE_STRINGS.MEDICAGO_SATIVA }, // Medicago sativa (Alfalfa)
        isDataValid: true,
        sowingRateSafeSeedsPerMeterSquared: 400,
        sowingRatePlantsPerAcre: 1600000,
        usedSeedsKgPerAcre: 180,
        internalRowHeightCm: 12.5,
        totalArea: 100
    }
];

const mockCombinedDataHistory = [
    {
        id: '1',
        createdAt: new Date('2024-01-01').toISOString(),
        isDataValid: true,
        plants: [
            {
                plant: { latinName: SELECTABLE_STRINGS.MEDICAGO_SATIVA },
                plantType: SELECTABLE_STRINGS.COMBINED_PLANT,
                seedingRate: 150,
                participation: 60,
                pricePerAcreBGN: 100
            },
            {
                plant: { latinName: SELECTABLE_STRINGS.GLYCINE_MAX },
                plantType: SELECTABLE_STRINGS.COMBINED_PLANT,
                seedingRate: 100,
                participation: 40,
                pricePerAcreBGN: 80
            }
        ],
        totalPrice: 180
    }
];

const mockChemProtPercentHistory = [
    {
        id: '1',
        createdAt: new Date('2024-01-01').toISOString(),
        desiredPercentage: 0.5,
        sprayerVolume: 1000,
        calculatedAmount: 5000
    }
];

const mockChemProtWorkingSolutionHistory = [
    {
        id: '1',
        createdAt: new Date('2024-01-01').toISOString(),
        plant: {
            id: '1',
            latinName: SELECTABLE_STRINGS.MEDICAGO_SATIVA
        },
        chemical: {
            id: '1',
            nameKey: SELECTABLE_STRINGS.CHEMICAL_PROTECTION_CHEM_DUAL_GOLD_960_EC
        },
        totalChemicalForAreaLiters: 10,
        totalWorkingSolutionForAreaLiters: 1000,
        roughSprayerCount: 5,
        chemicalPerSprayerML: 2000
    }
];

const sowingTabText = mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE);
const combinedTabText = mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_CALC_TITLE);
const chemProtPercentTabText = mockTranslateFunction(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE);
const chemProtWorkingTabText = mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE);

const preloadedState = {
    local: {
        lang: 'bg',
        unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES
    },
    auth: { user: null, token: null, isAuthenticated: false }
};

describe('HistoryDisplay', () => {
    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
    });

    it('should show loading state initially', () => {
        (APICaller as jest.Mock).mockImplementation(() => new Promise(() => { }));
        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        expect(screen.getByTestId('loading-spinner-container')).toBeInTheDocument();
    });

    it('should show error state when API calls fail', async () => {
        (APICaller as jest.Mock).mockResolvedValue({ success: false });
        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(screen.getByTestId('error-component')).toBeInTheDocument();
        });
    });

    it('should show "no history" message when all histories are empty', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: [],
                combinedHistory: [],
                chemProtPercentHistory: [],
                chemProtWorkingSolutionHistory: []
            }
        });
        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.NO_HISTORY))).toBeInTheDocument();
            expect(screen.getByTestId('calculators-grid')).toBeInTheDocument();
        });
    });

    it('should render all history tabs when data is available', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: mockSowingRateHistory,
                combinedHistory: mockCombinedDataHistory,
                chemProtPercentHistory: mockChemProtPercentHistory,
                chemProtWorkingSolutionHistory: mockChemProtWorkingSolutionHistory
            }
        });
        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        const user = userEvent.setup();

        await waitFor(async () => {
            const sowingRateTab = screen.getByRole('tab', { name: sowingTabText });
            const chemProtPercentTab = screen.getByRole('tab', { name: chemProtPercentTabText });
            const chemProtWorkingTab = screen.getByRole('tab', { name: chemProtWorkingTabText });

            await user.click(sowingRateTab);
            expect(screen.getByText(mockTranslateFunction(mockSowingRateHistory[0].plant.latinName as keyof typeof SELECTABLE_STRINGS))).toBeInTheDocument();

            await user.click(chemProtPercentTab);
            expect(screen.getByText(`${mockChemProtPercentHistory[0].desiredPercentage.toFixed(2)}%`)).toBeInTheDocument();

            await user.click(chemProtWorkingTab);
            expect(screen.getByText(`${mockChemProtWorkingSolutionHistory[0].totalChemicalForAreaLiters.toFixed(2)} L`)).toBeInTheDocument();
        });
    });

    it('should filter sowing rate history by search query', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: mockSowingRateHistory,
                combinedHistory: mockCombinedDataHistory,
                chemProtPercentHistory: mockChemProtPercentHistory,
                chemProtWorkingSolutionHistory: mockChemProtWorkingSolutionHistory
            }
        });
        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByText(mockTranslateFunction(mockSowingRateHistory[0].plant.latinName as keyof typeof SELECTABLE_STRINGS))).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(mockTranslateFunction(SELECTABLE_STRINGS.SEARCH_PLACEHOLDER));
        await user.type(searchInput, mockTranslateFunction(mockSowingRateHistory[0].plant.latinName as keyof typeof SELECTABLE_STRINGS));

        expect(screen.getByText(mockTranslateFunction(mockSowingRateHistory[0].plant.latinName as keyof typeof SELECTABLE_STRINGS))).toBeInTheDocument();
        //grab Glycine max from the second plant
        expect(screen.queryByText(mockTranslateFunction(mockCombinedDataHistory[0].plants[1].plant.latinName as keyof typeof SELECTABLE_STRINGS))).not.toBeInTheDocument();
    });

    it('should display warning banner for invalid data', async () => {
        const invalidSowingRateHistory = [{
            ...mockSowingRateHistory[0],
            isDataValid: false
        }];

        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: invalidSowingRateHistory,
                combinedHistory: [],
                chemProtPercentHistory: [],
                chemProtWorkingSolutionHistory: []
            }
        });

        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );

        await waitFor(() => {
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.WARNING_OUTSIDE_SUGGESTED_PARAMS))).toBeInTheDocument();
        });
    });

    it('should display all data fields for sowing rate history', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: mockSowingRateHistory,
                combinedHistory: [],
                chemProtPercentHistory: [],
                chemProtWorkingSolutionHistory: []
            }
        });

        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );

        await waitFor(() => {
            expect(screen.getByText('400.00')).toBeInTheDocument(); // sowingRateSafeSeedsPerMeterSquared
            expect(screen.getByText('1600000.00')).toBeInTheDocument(); // sowingRatePlantsPerAcre
            expect(screen.getByText('180.00')).toBeInTheDocument(); // usedSeedsKgPerAcre
            expect(screen.getByText('12.50')).toBeInTheDocument(); // internalRowHeightCm
            expect(screen.getByText('100.00')).toBeInTheDocument(); // totalArea
        });
    });

    it('should display all data fields for combined data history', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: [],
                combinedHistory: mockCombinedDataHistory,
                chemProtPercentHistory: [],
                chemProtWorkingSolutionHistory: []
            }
        });

        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        const user = userEvent.setup();

        await waitFor(async () => {
            const combinedTab = screen.getByRole('tab', { name: combinedTabText });
            await user.click(combinedTab);

            expect(screen.getByText(mockTranslateFunction(mockCombinedDataHistory[0].plants[0].plant.latinName as keyof typeof SELECTABLE_STRINGS))).toBeInTheDocument();
            expect(screen.getByText(`${mockCombinedDataHistory[0].plants[0].seedingRate.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText(`${mockCombinedDataHistory[0].plants[0].participation.toFixed(2)}%`)).toBeInTheDocument();
            expect(screen.getByText(`${mockCombinedDataHistory[0].plants[0].pricePerAcreBGN.toFixed(2)} ${mockTranslateFunction(SELECTABLE_STRINGS.BGN)}`)).toBeInTheDocument();
            expect(screen.getByText(`${mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_FINAL_PRICE)}: ${mockCombinedDataHistory[0].totalPrice.toFixed(2)} ${mockTranslateFunction(SELECTABLE_STRINGS.BGN)}`)).toBeInTheDocument();
        });
    });

    it('should display all data fields for chemical protection percent solution history', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: [],
                combinedHistory: [],
                chemProtPercentHistory: mockChemProtPercentHistory,
                chemProtWorkingSolutionHistory: []
            }
        });

        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        const user = userEvent.setup();

        await waitFor(async () => {
            const chemProtPercentTab = screen.getByRole('tab', { name: chemProtPercentTabText });
            await user.click(chemProtPercentTab);

            expect(screen.getByText(`${mockChemProtPercentHistory[0].desiredPercentage.toFixed(2)}%`)).toBeInTheDocument(); // desiredPercentage
            expect(screen.getByText(`${mockChemProtPercentHistory[0].sprayerVolume.toFixed(2)} L`)).toBeInTheDocument(); // sprayerVolume
            expect(screen.getByText(`${mockChemProtPercentHistory[0].calculatedAmount.toFixed(2)} ml/g`)).toBeInTheDocument(); // calculatedAmount
        });
    });

    it('should display all data fields for chemical protection working solution history', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: [],
                combinedHistory: [],
                chemProtPercentHistory: [],
                chemProtWorkingSolutionHistory: mockChemProtWorkingSolutionHistory
            }
        });

        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        const user = userEvent.setup();

        await waitFor(async () => {
            const chemProtWorkingTab = screen.getByRole('tab', { name: chemProtWorkingTabText });
            await user.click(chemProtWorkingTab);

            const plantName = mockTranslateFunction(mockChemProtWorkingSolutionHistory[0].plant.latinName as keyof typeof SELECTABLE_STRINGS);
            const chemicalName = mockTranslateFunction(mockChemProtWorkingSolutionHistory[0].chemical.nameKey as keyof typeof SELECTABLE_STRINGS);

            expect(screen.getByText(plantName)).toBeInTheDocument();
            expect(screen.getByText(chemicalName)).toBeInTheDocument();
            expect(screen.getByText(`${mockChemProtWorkingSolutionHistory[0].totalChemicalForAreaLiters.toFixed(2)} L`)).toBeInTheDocument(); // totalChemicalForAreaLiters
            expect(screen.getByText(`${mockChemProtWorkingSolutionHistory[0].totalWorkingSolutionForAreaLiters.toFixed(2)} L`)).toBeInTheDocument(); // totalWorkingSolutionForAreaLiters
            expect(screen.getByText(`${mockChemProtWorkingSolutionHistory[0].roughSprayerCount.toFixed(2)}`)).toBeInTheDocument(); // roughSprayerCount
            expect(screen.getByText(`${mockChemProtWorkingSolutionHistory[0].chemicalPerSprayerML.toFixed(2)} ml`)).toBeInTheDocument(); // chemicalPerSprayerML
        });
    });

    it('should render all charts for each tab', async () => {
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                sowingRateHistory: mockSowingRateHistory,
                combinedHistory: mockCombinedDataHistory,
                chemProtPercentHistory: mockChemProtPercentHistory,
                chemProtWorkingSolutionHistory: mockChemProtWorkingSolutionHistory
            }
        });

        renderWithRedux(
            () => <HistoryDisplay />,
            { preloadedState }
        );
        const user = userEvent.setup();

        await waitFor(async () => {
            const sowingRateTab = screen.getByRole('tab', { name: sowingTabText });
            const combinedTab = screen.getByRole('tab', { name: combinedTabText });
            const chemProtWorkingTab = screen.getByRole('tab', { name: chemProtWorkingTabText });

            await user.click(sowingRateTab);
            expect(screen.getByTestId('sowing-charts')).toBeInTheDocument();

            await user.click(combinedTab);
            expect(screen.getByTestId('combined-charts')).toBeInTheDocument();

            await user.click(chemProtWorkingTab);
            expect(screen.getByTestId('chem-working-solution-charts')).toBeInTheDocument();
        });
    });
});