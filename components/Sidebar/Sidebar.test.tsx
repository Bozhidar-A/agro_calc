import { screen, fireEvent } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { APICaller } from '@/lib/api-util';
import { toast } from 'sonner';
import Sidebar from './Sidebar';


describe('Sidebar', () => {
    const preloadedState = {
        local: {
            lang: 'bg'
        },
        auth: {
            user: null,
            token: null,
            isAuthenticated: false
        }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
    });

    describe('Unauthenticated State', () => {
        it('shows login and register buttons when not authenticated', async () => {
            renderWithRedux(() => <Sidebar />, { preloadedState });

            // Open sidebar
            const menuButton = screen.getByTestId('open-sheet-button');
            fireEvent.click(menuButton);

            // Check for login/register buttons
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.LOGIN))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.REGISTER))).toBeInTheDocument();
        });

        it('shows all calculator navigation links', async () => {
            renderWithRedux(() => <Sidebar />, { preloadedState });

            // Open sidebar
            const menuButton = screen.getByTestId('open-sheet-button');
            fireEvent.click(menuButton);

            // Check for navigation links
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.HOME))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.COMBINED_CALC_TITLE))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE))).toBeInTheDocument();
        });
    });

    describe('Authenticated State', () => {
        const authenticatedState = {
            ...preloadedState,
            auth: {
                user: { id: '123', email: 'test@test.com' },
                token: 'token',
                isAuthenticated: true
            }
        };

        it('shows profile and logout buttons when authenticated', async () => {
            renderWithRedux(() => <Sidebar />, { preloadedState: authenticatedState });

            // Open sidebar
            const menuButton = screen.getByTestId('open-sheet-button');
            fireEvent.click(menuButton);

            // Check for profile/logout buttons
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.PROFILE))).toBeInTheDocument();
            expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.LOGOUT))).toBeInTheDocument();
        });

        it('shows welcome message with user email', async () => {
            renderWithRedux(() => <Sidebar />, { preloadedState: authenticatedState });

            // Open sidebar
            const menuButton = screen.getByTestId('open-sheet-button');
            fireEvent.click(menuButton);

            // Check for welcome message
            expect(screen.getByText(new RegExp(authenticatedState.auth.user.email))).toBeInTheDocument();
        });

        it('handles logout successfully', async () => {
            // Mock successful API response
            (APICaller as jest.Mock).mockResolvedValueOnce({ success: true });

            renderWithRedux(() => <Sidebar />, { preloadedState: authenticatedState });

            // Open sidebar
            const menuButton = screen.getByTestId('open-sheet-button');
            fireEvent.click(menuButton);

            // Click logout
            const logoutButton = screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.LOGOUT));
            fireEvent.click(logoutButton);

            // Wait for and verify API was called
            await screen.findByTestId('open-sheet-button'); // Ensure re-render has happened

            expect(APICaller).toHaveBeenCalledWith(
                ['auth', 'logout'],
                '/api/auth/logout',
                'POST',
                { userId: authenticatedState.auth.user.id }
            );

            // Wait for and verify toast was shown
            await expect(toast.success).toHaveBeenCalledWith(mockTranslateFunction(SELECTABLE_STRINGS.TOAST_LOGOUT_SUCCESS));
        });
    });

    describe('Settings', () => {
        it('opens settings dialog when clicked', async () => {
            renderWithRedux(() => <Sidebar />, { preloadedState });

            // Open sidebar
            const menuButton = screen.getByTestId('open-sheet-button');
            fireEvent.click(menuButton);

            //click settings
            //ugly hack
            const settingsButton = screen.getByTestId('settings-button');
            fireEvent.click(settingsButton);

            // Verify settings dialog is shown
            expect(screen.getAllByText(mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS))[0]).toBeInTheDocument();
        });
    });
}); 