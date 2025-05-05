import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LangMap from '@/lib/LangMap';
import { SUPPORTED_LANGS } from './LocalSettingsMaps';

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
