import { renderHook, act, waitFor } from '@testing-library/react';
import { renderWithReduxHookWrapper } from '@/test-utils/render';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { AuthState, PlantCombinedDBData } from '@/lib/interfaces';

import useSeedingCombinedForm from '@/hooks/useSeedingCombinedForm';
import { APICaller } from '@/lib/api-util';
import { toast } from 'sonner';

jest.unmock('@/hooks/useWarnings');
let authMock = { isAuthenticated: true, userId: 'test-user-id' };
jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => authMock
}));

describe('useSeedingCombinedForm', () => {
    const mockAuthState: AuthState = {
        user: { id: 'test-user-id' },
        isAuthenticated: true,
        loading: false,
        error: null,
        authType: 'local'
    };

    const mockDbData: PlantCombinedDBData[] = [
        {
            id: 'legume-1',
            latinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
            plantType: 'legume',
            minSeedingRate: 10,
            maxSeedingRate: 100,
            priceFor1kgSeedsBGN: 5
        },
        {
            id: 'cereal-1',
            latinName: SELECTABLE_STRINGS.LOLIUM_PERENNE,
            plantType: 'cereal',
            minSeedingRate: 20,
            maxSeedingRate: 200,
            priceFor1kgSeedsBGN: 3
        }
    ];

    const preloadedState = {
        local: { lang: 'bg' },
        auth: mockAuthState
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
        authMock = { isAuthenticated: true, userId: 'test-user-id' };
    });

    it('initializes with default values', () => {
        const { result } = renderHook(
            () => useSeedingCombinedForm(mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        const formValues = result.current.form.getValues();
        expect(formValues.legume).toBeDefined();
        expect(formValues.cereal).toBeDefined();
        expect(formValues.legume[0].active).toBe(false);
        expect(formValues.cereal[0].active).toBe(false);
    });

    it('updates form values when plant is selected', async () => {
        const { result } = renderHook(
            () => useSeedingCombinedForm(mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            result.current.form.setValue('legume.0.active', true);
            result.current.form.setValue('legume.0.dropdownPlant', SELECTABLE_STRINGS.PISUM_SATIVUM);
        });

        await waitFor(() => {
            const formValues = result.current.form.getValues();
            expect(formValues.legume[0].id).toBe('legume-1');
            expect(formValues.legume[0].plantType).toBe('legume');
        });
    });

    it('validates seeding rate bounds', async () => {
        const { result } = renderHook(
            () => useSeedingCombinedForm(mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            result.current.form.setValue('legume.0.active', true);
            result.current.form.setValue('legume.0.dropdownPlant', SELECTABLE_STRINGS.PISUM_SATIVUM);
            result.current.form.setValue('legume.0.seedingRate', 5); // Below min
        });

        await waitFor(() => {
            expect(result.current.warnings).toEqual({ 'legume.0.seedingRate': 'Seeding rate out of bounds' });
        });

        await act(async () => {
            result.current.form.setValue('legume.0.seedingRate', 50); // Within bounds
        });

        await waitFor(() => {
            expect(result.current.warnings).not.toHaveProperty('legume.0.seedingRate');
        });
    });

    it('calculates total price correctly', async () => {
        const { result } = renderHook(
            () => useSeedingCombinedForm(mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            // Set up legume
            result.current.form.setValue('legume.0.active', true);
            result.current.form.setValue('legume.0.dropdownPlant', SELECTABLE_STRINGS.PISUM_SATIVUM);
            result.current.form.setValue('legume.0.seedingRate', 50);
            result.current.form.setValue('legume.0.participation', 60);

            // Set up cereal
            result.current.form.setValue('cereal.0.active', true);
            result.current.form.setValue('cereal.0.dropdownPlant', SELECTABLE_STRINGS.LOLIUM_PERENNE);
            result.current.form.setValue('cereal.0.seedingRate', 100);
            result.current.form.setValue('cereal.0.participation', 40);
        });

        await waitFor(() => {
            expect(result.current.finalData).toBeTruthy();
            expect(result.current.finalData?.totalPrice).toBeGreaterThan(0);
        });
    });

    it('handles successful form submission', async () => {
        (APICaller as jest.Mock).mockResolvedValue({ success: true });
        authMock = { isAuthenticated: true, userId: 'test-user-id' };
        const { result } = renderHook(
            () => useSeedingCombinedForm(mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            // Set up valid form data
            result.current.form.setValue('legume.0.active', true);
            result.current.form.setValue('legume.0.dropdownPlant', SELECTABLE_STRINGS.PISUM_SATIVUM);
            result.current.form.setValue('legume.0.seedingRate', 50);
            result.current.form.setValue('legume.0.participation', 60);
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(APICaller).toHaveBeenCalledWith(
            ['calc', 'combined', 'page', 'save history'],
            '/api/calc/combined/history',
            'POST',
            expect.objectContaining({
                userId: 'test-user-id',
                plants: expect.any(Array)
            })
        );
        expect(toast.success).toHaveBeenCalled();
    });

    it('handles failed form submission', async () => {
        const errorMessage = 'API Error';
        (APICaller as jest.Mock).mockResolvedValue({
            success: false,
            message: errorMessage
        });
        authMock = { isAuthenticated: true, userId: 'test-user-id' };
        const { result } = renderHook(
            () => useSeedingCombinedForm(mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(APICaller).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
    });

    it('prevents submission when not authenticated', async () => {
        authMock = { isAuthenticated: false, userId: null };
        const { result } = renderHook(
            () => useSeedingCombinedForm(mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(APICaller).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining(mockTranslateFunction(SELECTABLE_STRINGS.TOAST_ERROR_NOT_LOGGED_IN))
        );
    });
}); 