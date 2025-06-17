import { screen } from '@testing-library/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { renderWithRedux } from '@/test-utils/render';
import { initializeMockTranslate } from '@/test-utils/mocks';
import userEvent from '@testing-library/user-event';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';


// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
    ...jest.requireActual('next-themes'),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useTheme: () => ({
        theme: 'light',
        setTheme: mockSetTheme
    })
}));

describe('ThemeSwitcher', () => {
    const preloadedState = {
        local: { lang: 'bg', theme: 'light' },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
    });

    it('renders theme button with correct icon', () => {
        renderWithRedux((mockProps) => <ThemeSwitcher {...mockProps} />, { preloadedState, mockProps: {} });

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        //check if Sun icon is rendered for light theme
        const sunIcon = screen.getByLabelText('Sun');
        expect(sunIcon).toBeInTheDocument();
    });

    it('opens dropdown menu on click', async () => {
        const user = userEvent.setup();
        renderWithRedux((mockProps) => <ThemeSwitcher {...mockProps} />, { preloadedState, mockProps: {} });

        //click button to open dropdown
        const button = screen.getByRole('button');
        await user.click(button);

        //verify dropdown is open
        expect(button).toHaveAttribute('aria-expanded', 'true');

        //verify menu items
        const items = screen.getAllByRole('menuitem');
        expect(items).toHaveLength(3);
    });

    it('changes theme when clicking options', async () => {
        const user = userEvent.setup();
        renderWithRedux((mockProps) => <ThemeSwitcher {...mockProps} />, { preloadedState, mockProps: {} });

        //open dropdown
        const button = screen.getByRole('button');
        await user.click(button);

        //click dark theme option
        const items = screen.getAllByRole('menuitem');
        await user.click(items[1]); // Dark theme is second item

        //verify theme was changed
        expect(mockSetTheme).toHaveBeenCalledWith('dark');

        //click system theme option
        await user.click(button);
        const systemItems = screen.getAllByRole('menuitem');
        await user.click(systemItems[2]); // System theme is third item

        //verify theme was changed
        expect(mockSetTheme).toHaveBeenCalledWith('system');

        //click light theme option
        await user.click(button);
        const lightItems = screen.getAllByRole('menuitem');
        await user.click(lightItems[0]); // Light theme is first item

        //verify theme was changed
        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('dispatches theme change action to Redux', async () => {
        const user = userEvent.setup();
        const { store } = renderWithRedux((mockProps) => <ThemeSwitcher {...mockProps} />, { preloadedState, mockProps: {} });

        //open dropdown and click dark theme
        const button = screen.getByRole('button');
        await user.click(button);

        const items = screen.getAllByRole('menuitem');
        await user.click(items[1]); // Dark theme is second item

        //verify Redux state was updated
        expect(store.getState().local.theme).toBe(SELECTABLE_STRINGS.THEME_DARK);
    });
}); 
