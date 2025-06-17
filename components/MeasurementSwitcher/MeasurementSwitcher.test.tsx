import { screen, waitFor } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import MeasurementSwitcher from './MeasurementSwitcher';
import userEvent from '@testing-library/user-event';

describe('MeasurementSwitcher', () => {
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

    it('renders with correct initial measurement unit', () => {
        renderWithRedux(
            () => <MeasurementSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button', {
            name: mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES)
        });

        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(button).toHaveAttribute('aria-haspopup', 'menu');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveClass(
            'inline-flex',
            'items-center',
            'justify-center',
            'rounded-md',
            'border',
            'border-input',
            'bg-background',
            'shadow-sm'
        );
    });

    it('shows dropdown menu with all measurement options when clicked', async () => {
        const user = userEvent.setup();

        renderWithRedux(
            () => <MeasurementSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-state', 'closed');

        await user.click(button);

        // Check dropdown items
        const acresOption = await screen.findByRole('menuitem', {
            name: mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES)
        });
        const hectaresOption = await screen.findByRole('menuitem', {
            name: mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES)
        });

        expect(acresOption).toBeInTheDocument();
        expect(hectaresOption).toBeInTheDocument();
    });

    it('updates measurement unit when a new option is selected', async () => {
        const user = userEvent.setup();
        const { store } = renderWithRedux(
            () => <MeasurementSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button');
        await user.click(button);

        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'open');
        });

        const acresOption = screen.getByRole('menuitem', {
            name: mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES)
        });
        await user.click(acresOption);

        // Check if the store was updated
        expect(store.getState().local.unitOfMeasurementLength).toBe(UNIT_OF_MEASUREMENT_LENGTH.ACRES);

        // Check if the button was updated
        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'closed');
            expect(button).toHaveTextContent(
                mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES)
            );
        });
    });

    it('handles switching between measurement units', async () => {
        const user = userEvent.setup();
        const { store } = renderWithRedux(
            () => <MeasurementSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(
            mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES)
        );

        // Switch to acres
        await user.click(button);
        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'open');
        });

        await user.click(screen.getByRole('menuitem', {
            name: mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES)
        }));
        expect(store.getState().local.unitOfMeasurementLength).toBe(UNIT_OF_MEASUREMENT_LENGTH.ACRES);

        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'closed');
        });

        // Switch back to hectares
        await user.click(button);
        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'open');
        });

        await user.click(screen.getByRole('menuitem', {
            name: mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES)
        }));
        expect(store.getState().local.unitOfMeasurementLength).toBe(UNIT_OF_MEASUREMENT_LENGTH.HECTARES);

        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'closed');
        });
    });

    it('renders with acres as default when no unit is specified', () => {
        const stateWithoutUnit = {
            ...preloadedState,
            local: {
                ...preloadedState.local,
                unitOfMeasurementLength: undefined
            }
        };

        renderWithRedux(
            () => <MeasurementSwitcher />,
            { preloadedState: stateWithoutUnit }
        );

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(
            mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES)
        );
        expect(button).toHaveAttribute('data-state', 'closed');
    });
});