import { act, renderHook, waitFor } from '@testing-library/react';
import { useTranslate } from '@/hooks/useTranslate';
// jest.spyOn(utils, 'GetStrFromLangMapKey').mockImplementation((lang, key) => `${lang}:${key}`);
import * as utils from '@/lib/utils';
import { SUPPORTED_LANGS } from '@/lib/utils';
import { LocalSetLang } from '@/store/slices/localSettingsSlice';
import { renderWithReduxHookWrapper } from '@/test-utils/render';

//unmock the useTranslate hook for this specific test file
jest.unmock('@/hooks/useTranslate');

jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  GetStrFromLangMapKey: jest.fn().mockImplementation((lang, key) => `${lang}:${key}`),
}));

describe('useTranslate', () => {
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

  it('should return the correct string', () => {
    const { wrapper } = renderWithReduxHookWrapper(preloadedState);
    const { result } = renderHook(() => useTranslate(), {
      wrapper,
    });

    const translate = result.current;
    const output = translate('HELLO');

    expect(output).toBe('BG:HELLO');
    expect(utils.GetStrFromLangMapKey).toHaveBeenCalledWith(SUPPORTED_LANGS.BG.code, 'HELLO');
  });

  it('should return the correct string after changing the language', async () => {
    const { wrapper, store } = renderWithReduxHookWrapper(preloadedState);

    const { result } = renderHook(() => useTranslate(), {
      wrapper,
    });

    let translate = result.current;
    const bgStr = translate('HELLO');
    expect(bgStr).toBe('BG:HELLO');

    await act(async () => {
      store.dispatch(LocalSetLang(SUPPORTED_LANGS.EN.code));
    });

    await waitFor(() => {
      translate = result.current;
      const enStr = translate('HELLO');
      expect(enStr).toBe('EN:HELLO');
      expect(utils.GetStrFromLangMapKey).toHaveBeenCalledWith(SUPPORTED_LANGS.EN.code, 'HELLO');
    });

    expect(store.getState().local.lang).toBe(SUPPORTED_LANGS.EN.code);
  });
});
