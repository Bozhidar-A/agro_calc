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

// Export the mock function for use in tests
export const mockUseTranslate = () => {
    return (key: keyof typeof SELECTABLE_STRINGS) => {
        return LangMap[currentLang.toUpperCase() as keyof typeof LangMap][key];
    };
};