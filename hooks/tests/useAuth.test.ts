import { renderHook, act, waitFor } from "@testing-library/react";
import { renderWithReduxHookWrapper } from "@/test-utils/render";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_LANGS } from "@/lib/utils";

//unmock the useTranslate hook for this specific test file
jest.unmock('@/hooks/useAuth');

describe('useAuth', () => {
    const preloadedState = {
        local: { lang: SUPPORTED_LANGS.BG.code },
        auth: { user: null, token: null, isAuthenticated: false },
    };

    beforeEach(async () => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns unauthenticated state when no user', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: renderWithReduxHookWrapper(preloadedState).wrapper
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.userId).toBe('');
        expect(result.current.email).toBe('');
    });

    it('returns authenticated state with user info', () => {
        const authState = {
            ...preloadedState,
            auth: { user: { id: 'u1', email: 'user@example.com' }, token: 't', isAuthenticated: true }
        };

        const { result } = renderHook(() => useAuth(), {
            wrapper: renderWithReduxHookWrapper(authState).wrapper
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual({ id: 'u1', email: 'user@example.com' });
        expect(result.current.userId).toBe('u1');
        expect(result.current.email).toBe('user@example.com');
    });

    it('returns empty userId and email when user fields missing', () => {
        const authState = {
            ...preloadedState,
            auth: { user: {}, token: null, isAuthenticated: true }
        };

        const { result } = renderHook(() => useAuth(), {
            wrapper: renderWithReduxHookWrapper(authState).wrapper
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual({});
        expect(result.current.userId).toBe('');
        expect(result.current.email).toBe('');
    });
});