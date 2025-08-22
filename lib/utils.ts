import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LangMap from '@/lib/LangMap';
import { siGithub, siGoogle } from 'simple-icons';
import { AuthState, SupportedLang, SupportedOAuthProvider } from '@/lib/interfaces';
import { AcresToHectares, ToFixedNumber } from './math-util';

export const CREDENTIALS_PROVIDER = "Credentials";
export const SUPPORTED_OAUTH_PROVIDERS: Record<string, SupportedOAuthProvider> = {
  GOOGLE: {
    name: 'Google',
    icon: siGoogle,
    authURL: '/api/auth/login/google',
    currLoc: null
  },
  GITHUB: {
    name: 'GitHub',
    icon: siGithub,
    authURL: '/api/auth/login/github',
    currLoc: null
  }
}

export const SUPPORTED_LANGS: Record<string, SupportedLang> = {
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
  if (!lang || !lang.trim()) {
    return str;
  }

  //return the string from the LangMap if it exists
  if (LangMap[lang]?.[str]) {
    return LangMap[lang][str];
  }

  //fallback to BG if the langCode is not found
  if (LangMap[SUPPORTED_LANGS.BG.code]?.[str]) {
    return LangMap[SUPPORTED_LANGS.BG.code][str];
  }

  //fallback to the key itself if no translation is found
  return str;
}

export function FetchUnitIfExist(data: { unit: string }) {
  return data.unit ? `${data.unit}` : '';
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

export function GetParameterData(param: any) {
  const type = param?.type ?? CalculatorValueTypes.SLIDER;

  switch (type) {
    case CalculatorValueTypes.CONST:
      return {
        type,
        unit: param?.unit ?? "",
        constValue: param?.constValue ?? 0,
      };
    case CalculatorValueTypes.ABOVE_ZERO:
      return {
        type,
        unit: param?.unit ?? "",
        minSliderVal: 0,
        maxSliderVal: param?.maxSliderVal ?? 0,
        step: param?.step ?? 1,
      };
    case CalculatorValueTypes.SLIDER:
    default:
      return {
        type,
        unit: param?.unit ?? "",
        step: param?.step ?? 1,
        minSliderVal: param?.minSliderVal ?? 0,
        maxSliderVal: param?.maxSliderVal ?? 0,
      };
  }
};

export function GetDisplayValue(value: number, unitOfMeasurement: UNIT_OF_MEASUREMENT_LENGTH = UNIT_OF_MEASUREMENT_LENGTH.ACRES) {
  if (unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.HECTARES) {
    return ToFixedNumber(AcresToHectares(value), 2);
  }
  return ToFixedNumber(value, 2);
};


export function FormatInterval(min: number, max: number) {
  if (min === 0 && max === 0) {
    return 'N/A';
  }
  if (min === max) {
    return `${min} days`;
  }
  return `${min} - ${max} days`;
};

export function FormatQuarantine(days: number) {
  return days === 0 ? 'N/A' : `${days} days`;
};

export function FormatValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(1);
};