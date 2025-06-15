import { act, renderHook } from '@testing-library/react';
import { useWarnings } from '@/hooks/useWarnings';

jest.unmock('@/hooks/useWarnings');

describe('useWarnings', () => {
  it('initializes with empty warnings', () => {
    const { result } = renderHook(() => useWarnings());
    expect(result.current.warnings).toEqual({});
    expect(result.current.CountWarnings()).toBe(0);
  });

  it('adds a warning for a field', () => {
    const { result } = renderHook(() => useWarnings());
    act(() => {
      result.current.AddWarning('field1', 'This is a warning');
    });
    expect(result.current.warnings).toEqual({ field1: 'This is a warning' });
    expect(result.current.CountWarnings()).toBe(1);
  });

  it('adds multiple warnings and counts them', () => {
    const { result } = renderHook(() => useWarnings());
    act(() => {
      result.current.AddWarning('field1', 'Warning 1');
      result.current.AddWarning('field2', 'Warning 2');
    });
    expect(result.current.warnings).toEqual({ field1: 'Warning 1', field2: 'Warning 2' });
    expect(result.current.CountWarnings()).toBe(2);
  });

  it('removes a warning for a field', () => {
    const { result } = renderHook(() => useWarnings());
    act(() => {
      result.current.AddWarning('field1', 'Warning 1');
      result.current.AddWarning('field2', 'Warning 2');
      result.current.RemoveWarning('field1');
    });
    expect(result.current.warnings).toEqual({ field2: 'Warning 2' });
    expect(result.current.CountWarnings()).toBe(1);
  });

  it('removing a non-existent warning does nothing', () => {
    const { result } = renderHook(() => useWarnings());
    act(() => {
      result.current.AddWarning('field1', 'Warning 1');
      result.current.RemoveWarning('field2');
    });
    expect(result.current.warnings).toEqual({ field1: 'Warning 1' });
    expect(result.current.CountWarnings()).toBe(1);
  });

  it('overwrites warning for the same field', () => {
    const { result } = renderHook(() => useWarnings());
    act(() => {
      result.current.AddWarning('field1', 'First warning');
      result.current.AddWarning('field1', 'Updated warning');
    });
    expect(result.current.warnings).toEqual({ field1: 'Updated warning' });
    expect(result.current.CountWarnings()).toBe(1);
  });
});
