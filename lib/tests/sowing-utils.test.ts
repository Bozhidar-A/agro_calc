import { IsValueOutOfBounds } from '../sowing-utils';
import { CalculatorValueTypes } from '../utils';

describe('IsValueOutOfBounds', () => {
  it('returns false for null, undefined, or NaN', () => {
    expect(IsValueOutOfBounds(null as any, CalculatorValueTypes.ABOVE_ZERO)).toBe(false);
    expect(IsValueOutOfBounds(undefined as any, CalculatorValueTypes.ABOVE_ZERO)).toBe(false);
    expect(IsValueOutOfBounds(NaN, CalculatorValueTypes.ABOVE_ZERO)).toBe(false);
  });

  it('ABOVE_ZERO: true for 0 or less, false for >0', () => {
    expect(IsValueOutOfBounds(0, CalculatorValueTypes.ABOVE_ZERO)).toBe(true);
    expect(IsValueOutOfBounds(-1, CalculatorValueTypes.ABOVE_ZERO)).toBe(true);
    expect(IsValueOutOfBounds(1, CalculatorValueTypes.ABOVE_ZERO)).toBe(false);
  });

  it('SLIDER: true if out of [minSlide, maxSlide], false if in range', () => {
    expect(IsValueOutOfBounds(5, CalculatorValueTypes.SLIDER, 1, 10)).toBe(false);
    expect(IsValueOutOfBounds(0, CalculatorValueTypes.SLIDER, 1, 10)).toBe(true);
    expect(IsValueOutOfBounds(11, CalculatorValueTypes.SLIDER, 1, 10)).toBe(true);
  });

  it('CONST: true if not equal to constVal, false if equal', () => {
    expect(IsValueOutOfBounds(5, CalculatorValueTypes.CONST, undefined, undefined, 5)).toBe(false);
    expect(IsValueOutOfBounds(4, CalculatorValueTypes.CONST, undefined, undefined, 5)).toBe(true);
  });

  it('returns false for unknown type', () => {
    expect(IsValueOutOfBounds(123, 'UNKNOWN_TYPE')).toBe(false);
  });
});
