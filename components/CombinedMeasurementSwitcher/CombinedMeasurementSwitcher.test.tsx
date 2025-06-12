import { screen } from '@testing-library/react';
import { renderWithReduxAndForm } from '@/test-utils/render';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import CombinedMeasurementSwitcher from './CombinedMeasurementSwitcher';

describe('CombinedMeasurementSwitcher', () => {
    const defaultFormValues = {
        plants: [
            {
                priceSeedsPerAcreBGN: 100
            }
        ]
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

        it('renders the acres input field correctly', () => {
            renderWithReduxAndForm(
                ({ form }) => (
                    <CombinedMeasurementSwitcher
                        form={form}
                        name="plants"
                        index={0}
                    />
                ),
                {
                    preloadedState,
                    reactFormDefaultValues: defaultFormValues
                }
            );

            // Check if the correct label is displayed
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON_LABEL))).toBeInTheDocument();

            // Check if the input field is rendered with correct value
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input).toBeInTheDocument();
            expect(input).toBeDisabled();
            expect(input).toHaveValue('100');
            expect(input).toHaveClass('bg-muted');
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

        it('renders the hectares input field with converted value', () => {
            renderWithReduxAndForm(
                ({ form }) => (
                    <CombinedMeasurementSwitcher
                        form={form}
                        name="plants"
                        index={0}
                    />
                ),
                {
                    preloadedState,
                    reactFormDefaultValues: defaultFormValues
                }
            );

            // Check if the correct label is displayed
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON_LABEL))).toBeInTheDocument();

            // Check if the input field is rendered with converted value (hectares = acres * 2.47105)
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input).toBeInTheDocument();
            expect(input).toBeDisabled();
            expect(input).toHaveValue('1000'); // 100 acres * 10 = 1000 hectares
            expect(input).toHaveClass('bg-muted');
        });
    });

    describe('Invalid Unit Mode', () => {
        const preloadedState = {
            local: {
                lang: 'bg',
                unitOfMeasurementLength: 'INVALID_UNIT' as any
            },
            auth: { user: null, token: null, isAuthenticated: false }
        };

        beforeEach(() => {
            initializeMockTranslate(preloadedState);
        });

        it('renders nothing when unit is invalid', () => {
            renderWithReduxAndForm(
                ({ form }) => (
                    <CombinedMeasurementSwitcher
                        form={form}
                        name="plants"
                        index={0}
                    />
                ),
                {
                    preloadedState,
                    reactFormDefaultValues: defaultFormValues
                }
            );

            // Check that neither acres nor hectares labels are present
            expect(screen.queryByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_ACRE_COMPARISON_LABEL))).not.toBeInTheDocument();
            expect(screen.queryByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_PRICE_PER_HECTARE_COMPARISON_LABEL))).not.toBeInTheDocument();

            // Check that no input field is rendered
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
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

        it('handles undefined price value', () => {
            const formValues = {
                plants: [
                    {
                        priceSeedsPerAcreBGN: undefined
                    }
                ]
            };

            renderWithReduxAndForm(
                ({ form }) => (
                    <CombinedMeasurementSwitcher
                        form={form}
                        name="plants"
                        index={0}
                    />
                ),
                {
                    preloadedState,
                    reactFormDefaultValues: formValues
                }
            );

            // Should display 0 for undefined value
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input).toHaveValue('0');
        });

        it('handles null price value', () => {
            const formValues = {
                plants: [
                    {
                        priceSeedsPerAcreBGN: null
                    }
                ]
            };

            renderWithReduxAndForm(
                ({ form }) => (
                    <CombinedMeasurementSwitcher
                        form={form}
                        name="plants"
                        index={0}
                    />
                ),
                {
                    preloadedState,
                    reactFormDefaultValues: formValues
                }
            );

            // Should display 0 for null value
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input).toHaveValue('0');
        });
    });
}); 