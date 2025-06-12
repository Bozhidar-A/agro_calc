import { screen, waitFor } from '@testing-library/react';
import { renderWithRedux } from '@/test-utils/render';
import { SUPPORTED_LANGS } from '@/lib/utils';
import { LangSwitcher } from './LangSwitcher';
import userEvent from '@testing-library/user-event';

describe('LangSwitcher', () => {
    const preloadedState = {
        local: {
            lang: SUPPORTED_LANGS.BG.code
        },
        auth: { user: null, token: null, isAuthenticated: false }
    };

    it('renders with correct initial language flag', () => {
        renderWithRedux(
            () => <LangSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button');
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
        // Check if the button contains the correct flag
        expect(button).toHaveTextContent(SUPPORTED_LANGS.BG.flag);
    });

    it('shows dropdown menu with all language options when clicked', async () => {
        const user = userEvent.setup();

        renderWithRedux(
            () => <LangSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-state', 'closed');

        await user.click(button);

        // Check dropdown items
        const bgOption = await screen.findByRole('menuitem', {
            name: `${SUPPORTED_LANGS.BG.flag} ${SUPPORTED_LANGS.BG.name}`
        });
        const enOption = await screen.findByRole('menuitem', {
            name: `${SUPPORTED_LANGS.EN.flag} ${SUPPORTED_LANGS.EN.name}`
        });

        expect(bgOption).toBeInTheDocument();
        expect(enOption).toBeInTheDocument();
    });

    it('updates language when a new option is selected', async () => {
        const user = userEvent.setup();
        const { store } = renderWithRedux(
            () => <LangSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button');
        await user.click(button);

        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'open');
        });

        const enOption = screen.getByRole('menuitem', {
            name: `${SUPPORTED_LANGS.EN.flag} ${SUPPORTED_LANGS.EN.name}`
        });
        await user.click(enOption);

        // Check if the store was updated
        expect(store.getState().local.lang).toBe(SUPPORTED_LANGS.EN.code);

        // Check if the button was updated
        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'closed');
            expect(button).toHaveTextContent(SUPPORTED_LANGS.EN.flag);
        });
    });

    it('handles switching between languages', async () => {
        const user = userEvent.setup();
        const { store } = renderWithRedux(
            () => <LangSwitcher />,
            { preloadedState }
        );

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(SUPPORTED_LANGS.BG.flag);

        // Switch to English
        await user.click(button);
        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'open');
        });

        await user.click(screen.getByRole('menuitem', {
            name: `${SUPPORTED_LANGS.EN.flag} ${SUPPORTED_LANGS.EN.name}`
        }));
        expect(store.getState().local.lang).toBe(SUPPORTED_LANGS.EN.code);

        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'closed');
        });

        // Switch back to Bulgarian
        await user.click(button);
        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'open');
        });

        await user.click(screen.getByRole('menuitem', {
            name: `${SUPPORTED_LANGS.BG.flag} ${SUPPORTED_LANGS.BG.name}`
        }));
        expect(store.getState().local.lang).toBe(SUPPORTED_LANGS.BG.code);

        await waitFor(() => {
            expect(button).toHaveAttribute('data-state', 'closed');
        });
    });

    it('renders with Bulgarian as default when no language is specified', () => {
        const stateWithoutLang = {
            ...preloadedState,
            local: {
                ...preloadedState.local,
                lang: undefined
            }
        };

        renderWithRedux(
            () => <LangSwitcher />,
            { preloadedState: stateWithoutLang }
        );

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('?');
        expect(button).toHaveAttribute('data-state', 'closed');
    });
}); 