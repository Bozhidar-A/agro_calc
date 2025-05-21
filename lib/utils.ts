import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LangMap from '@/lib/LangMap';

export const SUPPORTED_LANGS = {
  BG: {
    code: 'BG',
    name: 'Български',
    flag: '🇧🇬',
  },
  EN: {
    code: 'EN',
    name: 'English',
    flag: '🇬🇧',
  },
};

export const enum UNIT_OF_MEASUREMENT_LENGTH {
  ACRES = 'ACRES',
  HECTARES = 'HECTARES',
}

export enum CombinationTypes {
  LEGUME = "legume",
  CEREAL = "cereal"
}

export enum CalculatorValueTypes {
  SLIDER = "slider",
  CONST = "const",
  ABOVE_ZERO = "aboveZero"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ArrayContainsAndItemsStartsWith(array: string[], item: any) {
  return array.some((i) => i.startsWith(item));
}

export function GetStrFromLangMapKey(lang: string, str: string) {
  if (LangMap[lang]?.[str]) {
    return LangMap[lang][str];
  }

  if (LangMap[SUPPORTED_LANGS.BG.code]?.[str]) {
    return LangMap[SUPPORTED_LANGS.BG.code][str];
  }

  return str;
}
