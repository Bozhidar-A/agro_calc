describe('useConsent helpers', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('GetClientConsent returns default when local storage has no consent', () => {
    // use the real module implementation
    const useConsentModule = jest.requireActual('@/hooks/useConsent');
    const ls = require('@/lib/localstorage-util');
    ls.GetLocalStorageItem.mockReturnValue(null);

    const result = useConsentModule.GetClientConsent();

    expect(result).toBeDefined();
    expect(result.necessary).toBe(true);
    expect(result.preferences).toBe(false);
    expect(result.location).toBe(false);
    expect(typeof result.updatedAt).toBe('string');
    expect(result.updatedAt).toMatch(/^\d+$/);
  });

  test('GetClientConsent returns parsed values when local storage contains consent', () => {
    const useConsentModule = jest.requireActual('@/hooks/useConsent');
    const ls = require('@/lib/localstorage-util');
    // simulate stored object with various truthy/falsey values
    ls.GetLocalStorageItem.mockReturnValue({ preferences: '1', location: 0, updatedAt: '123' });

    const result = useConsentModule.GetClientConsent();

    expect(result.preferences).toBe(true); // Boolean('1') -> true
    expect(result.location).toBe(false); // Boolean(0) -> false
    expect(result.updatedAt).toBe('123');
  });

  test('SetClientConsent normalizes input and writes to local storage', () => {
    const useConsentModule = jest.requireActual('@/hooks/useConsent');
    const ls = require('@/lib/localstorage-util');
    ls.SetLocalStorageItem.mockClear();

    const returned = useConsentModule.SetClientConsent({ preferences: 'yes', location: undefined });

    expect(ls.SetLocalStorageItem).toHaveBeenCalledTimes(1);
    const call = ls.SetLocalStorageItem.mock.calls[0];
    const keyArg = call[0];
    const valueArg = call[1];

    const utils = require('@/lib/utils');
    expect(keyArg).toBe(utils.CONSENT_KEY);
    expect(valueArg.necessary).toBe(true);
    expect(valueArg.preferences).toBe(true);
    expect(valueArg.location).toBe(false);
    expect(typeof valueArg.updatedAt).toBe('string');

    // function returns the normalized object
    expect(returned).toEqual(valueArg);
  });
});
