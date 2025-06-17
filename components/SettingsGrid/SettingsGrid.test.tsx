import { screen } from '@testing-library/react';
import SettingsGrid from './SettingsGrid';
import { renderWithRedux } from '@/test-utils/render';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { mockTranslateFunction, initializeMockTranslate } from '@/test-utils/mocks';

// Mock the components
jest.mock('@/components/ThemeSwitcher/ThemeSwitcher', () => ({
    ThemeSwitcher: () => <div data-testid="mock-theme-switcher">Theme Switcher</div>
}));

jest.mock('@/components/LangSwitcher/LangSwitcher', () => ({
    LangSwitcher: () => <div data-testid="mock-lang-switcher">Language Switcher</div>
}));

jest.mock('@/components/MeasurementSwitcher/MeasurementSwitcher', () => {
    return function MockMeasurementSwitcher() {
        return <div data-testid="mock-measurement-switcher">Measurement Switcher</div>;
    };
});

describe('SettingsGrid', () => {
    const preloadedState = {
        local: { lang: 'bg' },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
    });

    it('renders all setting labels with correct translations', () => {
        renderWithRedux(() => <SettingsGrid />, { preloadedState });

        //check theme label
        const themeLabel = screen.getByText(`${mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_THEME)}:`);
        expect(themeLabel).toBeInTheDocument();
        expect(themeLabel).toHaveClass('font-medium', 'text-sm', 'sm:text-base');

        //check language label
        const langLabel = screen.getByText(`${mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_LANGUAGE)}:`);
        expect(langLabel).toBeInTheDocument();
        expect(langLabel).toHaveClass('font-medium', 'text-sm', 'sm:text-base');

        //check measurement label
        const measureLabel = screen.getByText(`${mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT)}:`);
        expect(measureLabel).toBeInTheDocument();
        expect(measureLabel).toHaveClass('font-medium', 'text-sm', 'sm:text-base');
    });

    it('renders all switcher components', () => {
        renderWithRedux(() => <SettingsGrid />, { preloadedState });

        expect(screen.getByTestId('mock-theme-switcher')).toBeInTheDocument();
        expect(screen.getByTestId('mock-lang-switcher')).toBeInTheDocument();
        expect(screen.getByTestId('mock-measurement-switcher')).toBeInTheDocument();
    });

    it('renders with correct layout classes', () => {
        renderWithRedux(() => <SettingsGrid />, { preloadedState });

        //check main container
        const mainContainer = screen.getByTestId('mock-theme-switcher').closest('.max-w-2xl');
        expect(mainContainer).toHaveClass('max-w-2xl', 'mx-auto');

        //check settings container
        const settingsContainer = screen.getByTestId('mock-theme-switcher').closest('.space-y-6');
        expect(settingsContainer).toHaveClass('space-y-6', 'p-4', 'sm:p-6', 'bg-card', 'rounded-lg', 'shadow-sm');

        //check setting rows
        const settingRows = screen.getAllByText(/.*:/);
        settingRows.forEach(row => {
            const container = row.closest('.flex');
            expect(container).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'gap-3', 'sm:gap-6');
        });
    });

    it('renders labels with correct htmlFor attributes', () => {
        renderWithRedux(() => <SettingsGrid />, { preloadedState });

        const themeLabel = screen.getByText(`${mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_THEME)}:`);
        expect(themeLabel).toHaveAttribute('for', 'theme');

        const langLabel = screen.getByText(`${mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_LANGUAGE)}:`);
        expect(langLabel).toHaveAttribute('for', 'language');

        const measureLabel = screen.getByText(`${mockTranslateFunction(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT)}:`);
        expect(measureLabel).toHaveAttribute('for', 'unit');
    });
}); 