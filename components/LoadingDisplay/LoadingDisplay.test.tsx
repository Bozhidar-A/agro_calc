import { screen } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import { mockTranslateFunction, initializeMockTranslate } from '@/test-utils/mocks';
import LoadingDisplay from './LoadingDisplay';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

// Mock the useTranslate hook
jest.mock('@/app/hooks/useTranslate', () => ({
    useTranslate: () => mockTranslateFunction
}));

describe('LoadingDisplay', () => {
    const preloadedState = {
        local: { lang: 'en' },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        renderWithRedux((mockProps) => <LoadingDisplay {...mockProps} />, { preloadedState, mockProps: {} });
    });

    it('renders loading indicator and text', () => {
        // Check if loading icon is present
        const loadingContainer = screen.getByTestId('loading-spinner-container');
        expect(loadingContainer).toBeInTheDocument();
        expect(loadingContainer).toHaveClass('animate-spin');

        const loadingIcon = screen.getByTestId('loading-spinner-icon');
        expect(loadingIcon).toBeInTheDocument();
        expect(loadingIcon).toHaveClass('h-8', 'w-8', 'sm:h-10', 'sm:w-10', 'text-primary');

        // Check if loading text is present with correct translation
        const loadingText = screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.LOADING));
        expect(loadingText).toBeInTheDocument();
    });

    it('has correct ARIA role for accessibility', () => {
        const progressbar = screen.getByRole('progressbar');
        expect(progressbar).toBeInTheDocument();
    });

    it('applies responsive styling classes', () => {
        const container = screen.getByRole('progressbar');
        expect(container).toHaveClass('py-4', 'sm:py-8');

        const loadingContainer = screen.getByTestId('loading-spinner-container');
        expect(loadingContainer).toHaveClass('mb-3', 'sm:mb-4');
    });
});
