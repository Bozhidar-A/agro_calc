import { renderHook, act } from '@testing-library/react';
import { renderWithReduxHookWrapper } from '@/test-utils/render';
import { initializeMockTranslate } from '@/test-utils/mocks';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { CalculatorValueTypes } from '@/lib/utils';
import { SowingRateDBData } from '@/lib/interfaces';
import useSowingRateForm from './useSowingRateForm';
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
            maxSliderVal: 100
        },
        wantedPlantsPerMeterSquared: {
            type: CalculatorValueTypes.SLIDER,
            unit: 'plants/m²',
            minSliderVal: 20,
            maxSliderVal: 200
        },
        massPer1000g: {
            type: CalculatorValueTypes.CONST,
            unit: 'g',
            constValue: 50
        },
        purity: {
            type: CalculatorValueTypes.CONST,
            unit: '%',
            constValue: 99
        },
        germination: {
            type: CalculatorValueTypes.CONST,
            unit: '%',
            constValue: 95
        },
        rowSpacing: {
            type: CalculatorValueTypes.CONST,
            unit: 'cm',
            constValue: 12.5
        }
    }];

    const preloadedState = {
        local: { lang: 'bg' },
        auth: mockAuthState
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
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

    //fucked from here
    // it('updates activePlantDbData when culture is selected', async () => {
    //     const { result } = renderHook(
    //         () => useSowingRateForm(mockAuthState, mockDbData),
    //         { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
    //     );

    //     await act(async () => {
    //         await result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
    //     });

    //     // Wait for calculation
    //     await act(async () => {
    //         await new Promise((resolve) => setTimeout(resolve, 0));
    //     });

    //     expect(result.current.activePlantDbData).toEqual(mockDbData[0]);
    // });

    // it('calculates sowing rate data correctly', async () => {
    //     const { result } = renderHook(
    //         () => useSowingRateForm(mockAuthState, mockDbData),
    //         { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
    //     );

    //     await act(async () => {
    //         await result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
    //         await result.current.form.setValue('coefficientSecurity', 50);
    //         await result.current.form.setValue('wantedPlantsPerMeterSquared', 100);
    //         await result.current.form.setValue('massPer1000g', 50);
    //         await result.current.form.setValue('purity', 99);
    //         await result.current.form.setValue('germination', 95);
    //         await result.current.form.setValue('rowSpacing', 12.5);
    //         await result.current.form.setValue('totalArea', 1);
    //         await result.current.form.trigger();
    //         jest.runAllTimers();
    //     });

    //     expect(result.current.dataToBeSaved).toEqual({
    //         userId: 'test-user-id',
    //         plantId: 'test-plant-id',
    //         plantLatinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
    //         sowingRateSafeSeedsPerMeterSquared: 2,
    //         sowingRatePlantsPerAcre: 2105,
    //         usedSeedsKgPerAcre: 0.11,
    //         internalRowHeightCm: 380,
    //         totalArea: 1,
    //         isDataValid: true
    //     });
    // });

    // it('validates form values', async () => {
    //     const { result } = renderHook(
    //         () => useSowingRateForm(mockAuthState, mockDbData),
    //         { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
    //     );

    //     await act(async () => {
    //         await result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
    //         await result.current.form.setValue('coefficientSecurity', -1);
    //         await result.current.form.setValue('wantedPlantsPerMeterSquared', -1);
    //         const isValid = await result.current.form.trigger(['coefficientSecurity', 'wantedPlantsPerMeterSquared']);
    //         expect(isValid).toBe(false);
    //     });
    // });

    // it('handles successful form submission', async () => {
    //     (APICaller as jest.Mock).mockResolvedValue({ success: true });

    //     const { result } = renderHook(
    //         () => useSowingRateForm(mockAuthState, mockDbData),
    //         { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
    //     );

    //     await act(async () => {
    //         await result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
    //         await result.current.form.setValue('coefficientSecurity', 50);
    //         await result.current.form.setValue('wantedPlantsPerMeterSquared', 100);
    //         await result.current.form.setValue('massPer1000g', 50);
    //         await result.current.form.setValue('purity', 99);
    //         await result.current.form.setValue('germination', 95);
    //         await result.current.form.setValue('rowSpacing', 12.5);
    //         await result.current.form.setValue('totalArea', 1);
    //         await result.current.form.trigger();
    //         jest.runAllTimers();
    //     });

    //     await act(async () => {
    //         await result.current.onSubmit(result.current.form.getValues());
    //     });

    //     expect(APICaller).toHaveBeenCalledWith(
    //         ['calc', 'combined', 'page', 'save history'],
    //         '/api/calc/sowing/history',
    //         'POST',
    //         result.current.dataToBeSaved
    //     );
    //     expect(toast.success).toHaveBeenCalled();
    // });

    // it('handles failed form submission', async () => {
    //     const errorMessage = 'API Error';
    //     (APICaller as jest.Mock).mockResolvedValue({
    //         success: false,
    //         message: errorMessage
    //     });

    //     const { result } = renderHook(
    //         () => useSowingRateForm(mockAuthState, mockDbData),
    //         { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
    //     );

    //     await act(async () => {
    //         await result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
    //         await result.current.form.setValue('coefficientSecurity', 50);
    //         await result.current.form.setValue('wantedPlantsPerMeterSquared', 100);
    //         await result.current.form.setValue('massPer1000g', 50);
    //         await result.current.form.setValue('purity', 99);
    //         await result.current.form.setValue('germination', 95);
    //         await result.current.form.setValue('rowSpacing', 12.5);
    //         await result.current.form.setValue('totalArea', 1);
    //         await result.current.form.trigger();
    //         jest.runAllTimers();
    //     });

    //     await act(async () => {
    //         await result.current.onSubmit(result.current.form.getValues());
    //     });

    //     expect(APICaller).toHaveBeenCalled();
    //     expect(toast.error).toHaveBeenCalled();
    // });

    // it('handles API errors', async () => {
    //     (APICaller as jest.Mock).mockRejectedValue(new Error('Network Error'));

    //     const { result } = renderHook(
    //         () => useSowingRateForm(mockAuthState, mockDbData),
    //         { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
    //     );

    //     await act(async () => {
    //         await result.current.form.setValue('cultureLatinName', SELECTABLE_STRINGS.PISUM_SATIVUM);
    //         await result.current.form.setValue('coefficientSecurity', 50);
    //         await result.current.form.setValue('wantedPlantsPerMeterSquared', 100);
    //         await result.current.form.setValue('massPer1000g', 50);
    //         await result.current.form.setValue('purity', 99);
    //         await result.current.form.setValue('germination', 95);
    //         await result.current.form.setValue('rowSpacing', 12.5);
    //         await result.current.form.setValue('totalArea', 1);
    //         await result.current.form.trigger();
    //         jest.runAllTimers();
    //     });

    //     await act(async () => {
    //         await result.current.onSubmit(result.current.form.getValues());
    //     });

    //     expect(APICaller).toHaveBeenCalled();
    //     expect(toast.error).toHaveBeenCalled();
    // });
}); 