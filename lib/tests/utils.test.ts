import {
  ArrayContainsAndItemsStartsWith,
  Base64URLSafeDecode,
  Base64URLSafeEncode,
  CalculatorValueTypes,
  FormatInterval,
  FormatQuarantine,
  FormatValue,
  GetDisplayValue,
  GetParameterData,
  UNIT_OF_MEASUREMENT_LENGTH,
} from '../utils';

describe('CalculatorValueTypes', () => {
  it('should have correct enum values', () => {
    expect(CalculatorValueTypes.SLIDER).toBe('slider');
    expect(CalculatorValueTypes.CONST).toBe('const');
    expect(CalculatorValueTypes.ABOVE_ZERO).toBe('aboveZero');
  });
});

describe('GetParameterData', () => {
  it('should return correct data for CONST', () => {
    const param = { type: CalculatorValueTypes.CONST, unit: 'kg', constValue: 42 };
    expect(GetParameterData(param)).toEqual({ type: 'const', unit: 'kg', constValue: 42 });
  });
  it('should return correct data for ABOVE_ZERO', () => {
    const param = { type: CalculatorValueTypes.ABOVE_ZERO, unit: 'm', maxSliderVal: 10, step: 2 };
    expect(GetParameterData(param)).toEqual({
      type: 'aboveZero',
      unit: 'm',
      minSliderVal: 0,
      maxSliderVal: 10,
      step: 2,
    });
  });
  it('should return correct data for SLIDER', () => {
    const param = {
      type: CalculatorValueTypes.SLIDER,
      unit: 'l',
      minSliderVal: 1,
      maxSliderVal: 5,
      step: 0.5,
    };
    expect(GetParameterData(param)).toEqual({
      type: 'slider',
      unit: 'l',
      step: 0.5,
      minSliderVal: 1,
      maxSliderVal: 5,
    });
  });
  it('should default to SLIDER if type is missing', () => {
    const param = { unit: 'l', minSliderVal: 1, maxSliderVal: 5, step: 0.5 };
    expect(GetParameterData(param)).toEqual({
      type: 'slider',
      unit: 'l',
      step: 0.5,
      minSliderVal: 1,
      maxSliderVal: 5,
    });
  });
});

describe('GetDisplayValue', () => {
  it('should convert to hectares if unit is HECTARES', () => {
    expect(GetDisplayValue(2, UNIT_OF_MEASUREMENT_LENGTH.HECTARES)).toBe(20.0);
  });
  it('should keep value if unit is ACRES', () => {
    expect(GetDisplayValue(2, UNIT_OF_MEASUREMENT_LENGTH.ACRES)).toBe(2.0);
  });
});

describe('FormatInterval', () => {
  it('should return N/A for 0,0', () => {
    expect(FormatInterval(0, 0)).toBe('N/A');
  });
  it('should return single value for min==max', () => {
    expect(FormatInterval(5, 5)).toBe('5 days');
  });
  it('should return range for min!=max', () => {
    expect(FormatInterval(3, 7)).toBe('3 - 7 days');
  });
});

describe('FormatQuarantine', () => {
  it('should return N/A for 0', () => {
    expect(FormatQuarantine(0)).toBe('N/A');
  });
  it('should return days for non-0', () => {
    expect(FormatQuarantine(4)).toBe('4 days');
  });
});

describe('FormatValue', () => {
  it('should format millions', () => {
    expect(FormatValue(2000000)).toBe('2.0M');
  });
  it('should format thousands', () => {
    expect(FormatValue(5000)).toBe('5.0K');
  });
  it('should format <1000', () => {
    expect(FormatValue(42)).toBe('42.0');
  });
});

describe('Base64URLSafeEncode/Base64URLSafeDecode', () => {
  it('should encode and decode a string', () => {
    const str = 'hello world!';
    const encoded = Base64URLSafeEncode(str);
    const decoded = Base64URLSafeDecode(encoded);
    expect(decoded).toBe(str);
  });
});

describe('ArrayContainsAndItemsStartsWith', () => {
  it('should return true if any item starts with given string', () => {
    expect(ArrayContainsAndItemsStartsWith(['apple', 'banana', 'carrot'], 'ban')).toBe(true);
  });
  it('should return false if no item starts with given string', () => {
    expect(ArrayContainsAndItemsStartsWith(['apple', 'banana', 'carrot'], 'dog')).toBe(false);
  });
});
