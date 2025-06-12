import { screen } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import ChemWorkingSolutionCharts from './ChemWorkingSolutionCharts';

describe('ChemWorkingSolutionCharts', () => {
    const mockData = {
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
    };

    const preloadedState = {
        local: {
            lang: 'bg',
            unitOfMeasurementLength: 'acres'
        },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
    });

    describe('Rendering', () => {
        it('renders all chart sections when data is provided', () => {
            renderWithRedux(
                () => <ChemWorkingSolutionCharts data={mockData} />,
                { preloadedState }
            );

            // Check for main title and description
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_GENERAL))).toBeInTheDocument();

            // Check for chart titles
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_ALL_ELEMENTS))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_ELEMENTS_RELATIONSHIP))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_COMPARE_CALCED_PARAMS))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_PARTICIPATION))).toBeInTheDocument();

            // Check for chart components
            expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
            expect(screen.getAllByTestId('bar-chart')).toHaveLength(2);
            expect(screen.getAllByTestId('tooltip')).toHaveLength(3);
            expect(screen.getAllByTestId('legend')).toHaveLength(2);
        });

        it('renders nothing when no data is provided', () => {
            renderWithRedux(
                () => <ChemWorkingSolutionCharts data={null as any} />,
                { preloadedState }
            );

            // Check that main title is not rendered
            expect(screen.queryByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ))).not.toBeInTheDocument();
        });
    });

    describe('Chart Data Display', () => {
        it('displays correct metric values', () => {
            renderWithRedux(
                () => <ChemWorkingSolutionCharts data={mockData} />,
                { preloadedState }
            );

            // Check for metric values
            expect(screen.getByText('10.00')).toBeInTheDocument(); // totalChemicalForAreaLiters
            expect(screen.getByText('1.0K')).toBeInTheDocument(); // totalWorkingSolutionForAreaLiters
            expect(screen.getByText('5.00')).toBeInTheDocument(); // roughSprayerCount
            expect(screen.getByText('2000.0K')).toBeInTheDocument(); // chemicalPerSprayerML * 1000 (scaled for visualization)
        });

        it('displays correct chart legends', () => {
            renderWithRedux(
                () => <ChemWorkingSolutionCharts data={mockData} />,
                { preloadedState }
            );

            // Check for legend labels
            const barElements = screen.getAllByTestId('bar');
            const barNames = barElements.map(el => el.getAttribute('data-name'));

            expect(barNames).toContain(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_PARTICIPATION_PERCENTAGE));
        });

        it('displays correct efficiency metrics', () => {
            renderWithRedux(
                () => <ChemWorkingSolutionCharts data={mockData} />,
                { preloadedState }
            );

            // Check for efficiency section labels
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_CHEMICAL))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_TOTAL_SOLUTION))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_SPRAYER_COUNT))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CHEMICAL_PER_SPRAYER))).toBeInTheDocument();

            // Check for participation label in chart
            const barElements = screen.getAllByTestId('bar');
            expect(barElements[barElements.length - 1]).toHaveAttribute('data-name', mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_VIZ_PARTICIPATION_PERCENTAGE));
        });
    });
}); 