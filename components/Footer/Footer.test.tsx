import { screen } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import { Footer } from './Footer';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { mockTranslateFunction, initializeMockTranslate } from '@/test-utils/mocks';

// Mock the useTranslate hook
jest.mock('@/app/hooks/useTranslate', () => ({
    useTranslate: () => mockTranslateFunction
}));

describe('Footer', () => {
    const preloadedState = {
        local: { lang: 'bg' },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        renderWithRedux((mockProps) => <Footer {...mockProps} />, { preloadedState, mockProps: {} });
    });

    const translate = mockTranslateFunction;

    it('renders the footer component', () => {
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('displays the Agro-Calc title', () => {
        expect(screen.getByText('Agro-Calc')).toBeInTheDocument();
    });

    it('renders all navigation links with correct hrefs', () => {
        const expectedLinks = [
            { href: '/', text: translate(SELECTABLE_STRINGS.FOOTER_HOME) },
            { href: '/calculators/sowing', text: translate(SELECTABLE_STRINGS.FOOTER_SOWING_RATE_CALCULATOR) },
            { href: '/calculators/combined', text: translate(SELECTABLE_STRINGS.FOOTER_COMBINED_CALCULATOR) },
            { href: '/calculators/chemical-protection/working-solution', text: translate(SELECTABLE_STRINGS.FOOTER_CHEMICAL_PROTECTION_CALCULATOR) },
            { href: '/calculators/chemical-protection/percent-solution', text: translate(SELECTABLE_STRINGS.FOOTER_CHEMICAL_PROTECTION_CALCULATOR) }
        ];

        expectedLinks.forEach(({ href, text }) => {
            // Get all links with the text and find the one with matching href
            const links = screen.getAllByRole('link', { name: text });
            const link = links.find(l => l.getAttribute('href') === href);
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', href);
        });
    });

    it('renders the quick links section with correct heading', () => {
        expect(screen.getByText(translate(SELECTABLE_STRINGS.FOOTER_QUICK_LINKS))).toBeInTheDocument();
    });

    it('renders the footer description', () => {
        expect(screen.getByText(translate(SELECTABLE_STRINGS.FOOTER_DESCRIPTION))).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveClass('bg-green-700', 'text-white', 'py-12', 'w-full');
    });
});
