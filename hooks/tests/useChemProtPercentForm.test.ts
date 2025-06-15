import { act, renderHook } from '@testing-library/react';
import useChemProtPercentForm from '@/hooks/useChemProtPercentForm';
import { APICaller } from '@/lib/api-util';
import { CalculateChemProtPercentSolution } from '@/lib/math-util';
import { mockTranslateFunction } from '@/test-utils/mocks';

// Mock dependencies
jest.mock('@/lib/math-util');
jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => mockTranslateFunction,
}));

describe('useChemProtPercentForm', () => {
  const mockAuthObject = {
    user: { id: 'test-user-id' },
    token: 'test-token',
    isAuthenticated: true,
    loading: false,
    error: null,
    authType: 'local',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (CalculateChemProtPercentSolution as jest.Mock).mockImplementation(
      (percentage, volume) => percentage * 10 * volume
    );
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useChemProtPercentForm(mockAuthObject));

    expect(result.current.form.getValues()).toEqual({
      desiredPercentage: 0,
      sprayerVolume: 0,
    });
    expect(result.current.calculatedAmount).toBeNull();
  });

  it('calculates amount when form values change', async () => {
    const { result } = renderHook(() => useChemProtPercentForm(mockAuthObject));

    await act(async () => {
      await result.current.form.setValue('desiredPercentage', 5);
      await result.current.form.setValue('sprayerVolume', 10);
    });

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(CalculateChemProtPercentSolution).toHaveBeenCalledWith(5, 10);
    expect(result.current.calculatedAmount).toBe(500); // 5 * 10 * 10
  });

  it('validates form values', async () => {
    const { result } = renderHook(() => useChemProtPercentForm(mockAuthObject));
    let isValid = true;
    await act(async () => {
      await result.current.form.setValue('desiredPercentage', -1);
      await result.current.form.setValue('sprayerVolume', -1);
      isValid = await result.current.form.trigger(['desiredPercentage', 'sprayerVolume']);
    });
    expect(isValid).toBe(false);
  });

  it('handles successful form submission', async () => {
    (APICaller as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useChemProtPercentForm(mockAuthObject));

    await act(async () => {
      await result.current.form.setValue('desiredPercentage', 5);
      await result.current.form.setValue('sprayerVolume', 10);
    });

    // Wait for calculation
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(APICaller).toHaveBeenCalledWith(
      ['calc', 'chem-protection', 'percent-solution', 'history'],
      '/api/calc/chem-protection/percent-solution/history',
      'POST',
      {
        desiredPercentage: 5,
        sprayerVolume: 10,
        userId: 'test-user-id',
        calculatedAmount: 500,
      }
    );
  });

  it('handles failed form submission', async () => {
    const errorMessage = 'API Error';
    (APICaller as jest.Mock).mockResolvedValue({
      success: false,
      message: errorMessage,
    });

    const { result } = renderHook(() => useChemProtPercentForm(mockAuthObject));

    await act(async () => {
      await result.current.form.setValue('desiredPercentage', 5);
      await result.current.form.setValue('sprayerVolume', 10);
    });

    // Wait for calculation
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(APICaller).toHaveBeenCalled();
  });

  it('handles API errors', async () => {
    (APICaller as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useChemProtPercentForm(mockAuthObject));

    await act(async () => {
      await result.current.form.setValue('desiredPercentage', 5);
      await result.current.form.setValue('sprayerVolume', 10);
    });

    // Wait for calculation
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(APICaller).toHaveBeenCalled();
  });
});
