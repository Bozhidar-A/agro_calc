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

export function Base64URLSafeEncode(str: string) {
  // Convert string to base64
  const base64 = btoa(unescape(encodeURIComponent(str)));

  // Make it URL-safe by replacing characters and removing padding
  return base64
    .replace(/\+/g, '-')    // Replace + with -
    .replace(/\//g, '_')    // Replace / with _
    .replace(/=/g, '');     // Remove padding =
}

export function Base64URLSafeDecode(str: string) {
  // Restore standard base64 characters
  let base64 = str
    .replace(/-/g, '+')     // Replace - with +
    .replace(/_/g, '/');    // Replace _ with /

  // Add padding if necessary
  const padLength = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(padLength);

  // Decode from base64
  return decodeURIComponent(escape(atob(base64)));
}
