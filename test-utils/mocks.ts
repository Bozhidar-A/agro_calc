import { LangMap, SELECTABLE_STRINGS } from '@/lib/LangMap';

export const mockUseTranslate = (lang: string = 'bg') => {
    return (key: keyof typeof SELECTABLE_STRINGS) => {
        return LangMap[lang.toUpperCase() as keyof typeof LangMap][key];
    };
};