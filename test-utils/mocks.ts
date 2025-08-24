import { LangMap, SELECTABLE_STRINGS } from '@/lib/LangMap';

let currentLang = 'bg';

export const mockTranslateFunction = (key: keyof typeof SELECTABLE_STRINGS) => {
  return LangMap[currentLang.toUpperCase() as keyof typeof LangMap][key];
};

export const setMockLanguage = (lang: string) => {
  currentLang = lang;
};

// Initialize mock with preloadedState - call this in beforeEach
export const initializeMockTranslate = (preloadedState?: { local: { lang: string } }) => {
  if (preloadedState?.local?.lang) {
    setMockLanguage(preloadedState.local.lang);
  }
};

export const mockGetStrFromLangMapKey = jest.fn((langCode: string, key: string) => {
  //fallback if langCode is not provided
  if (!langCode || !langCode.trim()) {
    return `mock-${key}`;
  }

  const upperLangCode = langCode.toUpperCase() as keyof typeof LangMap;

  if (LangMap[upperLangCode] && LangMap[upperLangCode][key]) {
    return LangMap[upperLangCode][key];
  }

  //return key if no translation found
  if (!LangMap[upperLangCode]) {
    return `mock-${key}`;
  }

  //fallback to BG
  if (LangMap.BG?.[key]) {
    return LangMap.BG[key];
  }

  //fallback 2 key
  return `mock-${key}`;
});
