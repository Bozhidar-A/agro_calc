import { screen } from '@testing-library/react';
import OAuthButtonsGrid from './OAuthButtonsGrid';
import { renderWithRedux } from '@/test-utils/render';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/utils';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { mockTranslateFunction, initializeMockTranslate } from '@/test-utils/mocks';

describe('OAuthButtonsGrid', () => {
    const preloadedState = {
        local: { lang: 'bg' },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
    });

    it('renders the OR text', () => {
        renderWithRedux(() => <OAuthButtonsGrid />, { preloadedState });
        const orText = screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.OR));
        expect(orText).toBeInTheDocument();
    });

    it('renders all OAuth provider buttons with location prop', () => {
        renderWithRedux(() => <OAuthButtonsGrid />, { preloadedState });
        // Each OAuthButton should receive currLoc prop, but we only check rendering and hrefs here
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(Object.keys(SUPPORTED_OAUTH_PROVIDERS).length);
        Object.values(SUPPORTED_OAUTH_PROVIDERS).forEach(provider => {
            const link = links.find(l => l.getAttribute('href') === provider.authURL);
            expect(link).toBeInTheDocument();
        });
    });

    it('renders with correct layout classes', () => {
        renderWithRedux(() => <OAuthButtonsGrid />, { preloadedState });
        const container = screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.OR)).parentElement;
        expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'gap-2');
        const buttonsGrid = container?.querySelector('.flex.flex-wrap');
        expect(buttonsGrid).toHaveClass('flex', 'flex-wrap', 'justify-center', 'gap-2');
    });

    it('renders OR text with correct styling', () => {
        renderWithRedux(() => <OAuthButtonsGrid />, { preloadedState });
        const orText = screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.OR));
        expect(orText).toHaveClass('text-center', 'text-sm', 'text-black', 'dark:text-white');
    });
}); 