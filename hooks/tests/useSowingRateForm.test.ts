import { renderHook, act, waitFor } from '@testing-library/react';
import { renderWithReduxHookWrapper } from '@/test-utils/render';
import { initializeMockTranslate } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { CalculatorValueTypes } from '@/lib/utils';
import { SowingRateDBData } from '@/lib/interfaces';
import useSowingRateForm from '@/hooks/useSowingRateForm';
import { APICaller } from '@/lib/api-util';
import { toast } from 'sonner';

describe('useSowingRateForm', () => {
    const mockAuthState = {
        user: { id: 'test-user-id' },
        token: 'test-token',
        isAuthenticated: true,
        loading: false,
        error: null,
        authType: 'local',
        severity: 'info'
    };

    const mockDbData: SowingRateDBData[] = [{
        id: 'test-id',
        plant: {
            plantId: 'test-plant-id',
            plantLatinName: SELECTABLE_STRINGS.PISUM_SATIVUM
        },
        coefficientSecurity: {
            type: CalculatorValueTypes.SLIDER,
            unit: 'kg/ha',
            step: 0.1,
            minSliderVal: 10,
            maxSliderVal: 100,
            constValue: 50
        },
        wantedPlantsPerMeterSquared: {
            type: CalculatorValueTypes.SLIDER,
            unit: 'plants/m²',
            minSliderVal: 20,
            maxSliderVal: 200,
            constValue: 100
        },
        massPer1000g: {
            type: CalculatorValueTypes.CONST,
            unit: 'g',
            constValue: 50,
            minSliderVal: 0,
            maxSliderVal: 0
        },
        purity: {
            type: CalculatorValueTypes.CONST,
            unit: '%',
            constValue: 99,
            minSliderVal: 0,
            maxSliderVal: 0
        },
        germination: {
            type: CalculatorValueTypes.CONST,
            unit: '%',
            constValue: 95,
            minSliderVal: 0,
            maxSliderVal: 0
        },
        rowSpacing: {
            type: CalculatorValueTypes.CONST,
            unit: 'cm',
            constValue: 12.5,
            minSliderVal: 0,
            maxSliderVal: 0
        }
    }];

    const preloadedState = {
        local: { lang: 'bg' },
        auth: mockAuthState
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
    });

    it('initializes with default values', () => {
        const { result } = renderHook(
            () => useSowingRateForm(mockAuthState, mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        expect(result.current.form.getValues()).toEqual({
            cultureLatinName: '',
            coefficientSecurity: 0,
            wantedPlantsPerMeterSquared: 0,
            massPer1000g: 0,
            purity: 0,
            germination: 0,
            rowSpacing: 0,
            totalArea: 1
        });
    });

    it('updates activePlantDbData when culture is selected', async () => {
        const { result } = renderHook(
            () => useSowingRateForm(mockAuthState, mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
        });

        // Wait for the effect to process
        await waitFor(() => {
            expect(result.current.activePlantDbData).toEqual(mockDbData[0]);
        });
    });

    it('calculates sowing rate data correctly', async () => {
        const { result } = renderHook(
            () => useSowingRateForm(mockAuthState, mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
            result.current.form.setValue('coefficientSecurity', 50);
            result.current.form.setValue('wantedPlantsPerMeterSquared', 100);
            result.current.form.setValue('massPer1000g', 50);
            result.current.form.setValue('purity', 99);
            result.current.form.setValue('germination', 95);
            result.current.form.setValue('rowSpacing', 12.5);
            result.current.form.setValue('totalArea', 1);
        });

        // Wait for calculations to complete
        await waitFor(() => {
            expect(result.current.dataToBeSaved.plantId).toBe('test-plant-id');
            expect(result.current.dataToBeSaved.userId).toBe('test-user-id');
        });
    });

    it('handles successful form submission', async () => {
        (APICaller as jest.Mock).mockResolvedValue({ success: true });

        const { result } = renderHook(
            () => useSowingRateForm(mockAuthState, mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
            result.current.form.setValue('coefficientSecurity', 50);
            result.current.form.setValue('wantedPlantsPerMeterSquared', 100);
            result.current.form.setValue('massPer1000g', 50);
            result.current.form.setValue('purity', 99);
            result.current.form.setValue('germination', 95);
            result.current.form.setValue('rowSpacing', 12.5);
            result.current.form.setValue('totalArea', 1);
        });

        // Wait for data to be calculated
        await waitFor(() => {
            expect(result.current.activePlantDbData).toBeTruthy();
        });

        await act(async () => {
            await result.current.onSubmit(result.current.form.getValues());
        });

        expect(APICaller).toHaveBeenCalledWith(
            ['calc', 'combined', 'page', 'save history'],
            '/api/calc/sowing/history',
            'POST',
            expect.objectContaining({
                userId: 'test-user-id',
                plantId: 'test-plant-id'
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

        const { result } = renderHook(
            () => useSowingRateForm(mockAuthState, mockDbData),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await act(async () => {
            result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
        });

        await waitFor(() => {
            expect(result.current.activePlantDbData).toBeTruthy();
        });

        await act(async () => {
            await result.current.onSubmit(result.current.form.getValues());
        });

        expect(APICaller).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
    });
});