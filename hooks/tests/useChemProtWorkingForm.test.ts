import { renderHook, act, waitFor } from '@testing-library/react';
import { renderWithReduxHookWrapper } from '@/test-utils/render';
import { initializeMockTranslate } from '@/test-utils/mocks';
import useChemProtWorkingForm from '@/hooks/useChemProtWorkingForm';
import { APICaller } from '@/lib/api-util';
import { toast } from 'sonner';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';

jest.unmock('@/hooks/useWarnings');

describe('useChemProtWorkingForm', () => {
    const mockPlantsChems = [
        {
            plant: {
                id: 'plant-1',
                latinName: 'Test Plant'
            },
            chemical: {
                id: 'chem-1',
                name: 'Test Chemical',
                dosage: 100 // 100ml per acre
            }
        }
    ];

    const preloadedState = {
        local: {
            lang: 'bg',
            unitOfMeasurementLength: UNIT_OF_MEASUREMENT_LENGTH.ACRES
        },
        auth: {
            user: { id: 'test-user-id' },
            isAuthenticated: true,
            loading: false,
            error: null,
            authType: 'local'
        }
    };

    beforeEach(() => {
        initializeMockTranslate(preloadedState);
        jest.clearAllMocks();
        (APICaller as jest.Mock).mockResolvedValue({
            success: true,
            data: mockPlantsChems
        });
    });

    it('initializes with default values', async () => {
        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const formValues = result.current.form.getValues();
        expect(formValues.selectedPlantId).toBe('');
        expect(formValues.selectedChemicalId).toBe('');
        expect(formValues.chemicalPerAcreML).toBe(0);
        expect(formValues.workingSolutionPerAcreLiters).toBe(0);
        expect(formValues.sprayerVolumePerAcreLiters).toBe(0);
        expect(formValues.areaToBeSprayedAcres).toBe(0);
    });

    it('loads plants and chemicals data on mount', async () => {
        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.plantsChems).toEqual(mockPlantsChems);
        });

        expect(APICaller).toHaveBeenCalledWith(
            ['calc', 'chem-protection', 'working-solution', 'chemicals', "BACKGROUND"],
            '/api/calc/chem-protection/working-solution/input',
            'GET'
        );
    });

    it('updates chemical dosage when chemical is selected', async () => {
        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.plantsChems).toEqual(mockPlantsChems);
        });

        //wack
        await act(async () => {
            result.current.form.setValue('selectedPlantId', mockPlantsChems[0].plant.id);
        });

        await waitFor(() => {
            expect(result.current.form.getValues('selectedChemicalId')).toBe('');
        });

        await act(async () => {
            result.current.form.setValue('selectedChemicalId', mockPlantsChems[0].chemical.id);
        });

        await waitFor(() => {
            const formValues = result.current.form.getValues();
            expect(formValues.chemicalPerAcreML).toBe(100);
        });
    });

    it('adds warning when chemical dosage is manually changed', async () => {
        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.plantsChems).toEqual(mockPlantsChems);
        });

        //wack
        await act(async () => {
            result.current.form.setValue('selectedPlantId', mockPlantsChems[0].plant.id);
        });

        await waitFor(() => {
            expect(result.current.form.getValues('selectedChemicalId')).toBe('');
        });

        await act(async () => {
            result.current.form.setValue('selectedChemicalId', mockPlantsChems[0].chemical.id);
        });

        await waitFor(() => {
            const formValues = result.current.form.getValues();
            expect(formValues.chemicalPerAcreML).toBe(100);
        });

        await act(async () => {
            //manually change the dosage
            result.current.form.setValue('chemicalPerAcreML', 150);
        });

        await waitFor(() => {
            expect(result.current.warnings).toEqual({
                'chemicalPerAcreML': 'Value out of bounds!'
            });
        });
    });

    it('calculates data correctly when form values change', async () => {
        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            result.current.form.setValue('chemicalPerAcreML', 100);
            result.current.form.setValue('workingSolutionPerAcreLiters', 200);
            result.current.form.setValue('sprayerVolumePerAcreLiters', 300);
            result.current.form.setValue('areaToBeSprayedAcres', 10);
        });

        await waitFor(() => {
            expect(result.current.dataToBeSaved).toBeTruthy();
            expect(result.current.dataToBeSaved.totalChemicalForAreaLiters).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.totalWorkingSolutionForAreaLiters).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.roughSprayerCount).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.chemicalPerSprayerML).toBeGreaterThan(0);
        });
    });

    it('handles successful form submission', async () => {
        (APICaller as jest.Mock)
            .mockResolvedValueOnce({ success: true, data: mockPlantsChems }) // Initial chemicals fetch
            .mockResolvedValueOnce({ success: true, data: [] }) // Background sowing history fetch
            .mockResolvedValueOnce({ success: true }); // Form submission

        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            result.current.form.setValue('chemicalPerAcreML', 100);
            result.current.form.setValue('workingSolutionPerAcreLiters', 200);
            result.current.form.setValue('sprayerVolumePerAcreLiters', 300);
            result.current.form.setValue('areaToBeSprayedAcres', 10);
        });

        await waitFor(() => {
            expect(result.current.dataToBeSaved).toBeTruthy();
            expect(result.current.dataToBeSaved.totalChemicalForAreaLiters).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.totalWorkingSolutionForAreaLiters).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.roughSprayerCount).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.chemicalPerSprayerML).toBeGreaterThan(0);
            expect(result.current.CountWarnings()).toBe(0);
        });

        await act(async () => {
            await result.current.form.trigger();
        });

        await waitFor(() => {
            expect(result.current.form.formState.isValid).toBe(true);
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalled();
        });

        expect(APICaller).toHaveBeenCalledWith(
            ['calc', 'chem-protection', 'working-solution', 'history'],
            '/api/calc/chem-protection/working-solution/history',
            'POST',
            expect.objectContaining({
                userId: 'test-user-id',
                totalChemicalForAreaLiters: expect.any(Number),
                totalWorkingSolutionForAreaLiters: expect.any(Number)
            })
        );
        expect(toast.success).toHaveBeenCalled();
    });

    it('handles failed form submission', async () => {
        (APICaller as jest.Mock)
            .mockResolvedValueOnce({ success: true, data: mockPlantsChems }) // Initial chemicals fetch
            .mockResolvedValueOnce({ success: true, data: [] }) // Background sowing history fetch
            .mockResolvedValueOnce({ success: false }); // Form submission

        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            result.current.form.setValue('chemicalPerAcreML', 100);
            result.current.form.setValue('workingSolutionPerAcreLiters', 200);
            result.current.form.setValue('sprayerVolumePerAcreLiters', 300);
            result.current.form.setValue('areaToBeSprayedAcres', 10);
        });

        await waitFor(() => {
            expect(result.current.dataToBeSaved).toBeTruthy();
            expect(result.current.dataToBeSaved.totalChemicalForAreaLiters).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.totalWorkingSolutionForAreaLiters).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.roughSprayerCount).toBeGreaterThan(0);
            expect(result.current.dataToBeSaved.chemicalPerSprayerML).toBeGreaterThan(0);
            expect(result.current.CountWarnings()).toBe(0);
        });

        await act(async () => {
            await result.current.form.trigger();
        });

        await waitFor(() => {
            expect(result.current.form.formState.isValid).toBe(true);
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it('prevents submission when form is invalid', async () => {
        const { result } = renderHook(
            () => useChemProtWorkingForm(),
            { wrapper: renderWithReduxHookWrapper(preloadedState).wrapper }
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            result.current.form.setValue('chemicalPerAcreML', 0);
            result.current.form.setValue('workingSolutionPerAcreLiters', 0);
            result.current.form.setValue('sprayerVolumePerAcreLiters', 0);
            result.current.form.setValue('areaToBeSprayedAcres', 0);
        });

        await act(async () => {
            await result.current.form.trigger();
        });

        await waitFor(() => {
            expect(result.current.form.formState.isValid).toBe(false);
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        await waitFor(() => {
            expect(APICaller).not.toHaveBeenCalledWith(
                ['calc', 'chem-protection', 'working-solution', 'history'],
                '/api/calc/chem-protection/working-solution/history',
                'POST',
                expect.objectContaining({
                    userId: 'test-user-id',
                    totalChemicalForAreaLiters: expect.any(Number),
                    totalWorkingSolutionForAreaLiters: expect.any(Number)
                })
            );
        });
    });
}); 