import { clsx, type ClassValue } from 'clsx';
import { siGithub, siGoogle } from 'simple-icons';
import { twMerge } from 'tailwind-merge';
import { ConsentCookieProps, RechartsTooltipProps, SupportedLang, SupportedOAuthProvider } from '@/lib/interfaces';
import LangMap from '@/lib/LangMap';
import { AcresToHectares, ToFixedNumber } from './math-util';

export const CREDENTIALS_PROVIDER = 'Credentials';
export const SUPPORTED_OAUTH_PROVIDERS: Record<string, SupportedOAuthProvider> = {
  GOOGLE: {
    name: 'Google',
    icon: siGoogle,
    authURL: '/api/auth/login/google',
    currLoc: null,
  },
  GITHUB: {
    name: 'GitHub',
    icon: siGithub,
    authURL: '/api/auth/login/github',
    currLoc: null,
  },
};

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
  LEGUME = 'legume',
  CEREAL = 'cereal',
}

export enum CalculatorValueTypes {
  SLIDER = 'slider',
  CONST = 'const',
  ABOVE_ZERO = 'aboveZero',
}

//const tooltip formatting in the expected format of the chart
export const tooltipProps: RechartsTooltipProps = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    color: 'hsl(var(--popover-foreground))',
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  itemStyle: { color: 'green' },
  labelStyle: { color: 'hsl(var(--muted-foreground))' },
  wrapperStyle: { outline: 'none' },
};

export const DEFAULT_CONSENT_COOKIE: ConsentCookieProps = {
  necessary: true,
  preferences: false,
  location: false,
  updatedAt: Date.now().toString(),
};

export const CONSENT_KEY = 'consent.v1';

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

export function Base64URLSafeEncode(str: string) {
  // Convert string to base64
  const base64 = btoa(unescape(encodeURIComponent(str)));

  // Make it URL-safe by replacing characters and removing padding
  return base64
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_') // Replace / with _
    .replace(/=/g, ''); // Remove padding =
}

export function Base64URLSafeDecode(str: string) {
  // Restore standard base64 characters
  let base64 = str
    .replace(/-/g, '+') // Replace - with +
    .replace(/_/g, '/'); // Replace _ with /

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
        unit: param?.unit ?? '',
        constValue: param?.constValue ?? 0,
      };
    case CalculatorValueTypes.ABOVE_ZERO:
      return {
        type,
        unit: param?.unit ?? '',
        minSliderVal: 0,
        maxSliderVal: param?.maxSliderVal ?? 0,
        step: param?.step ?? 1,
      };
    case CalculatorValueTypes.SLIDER:
    default:
      return {
        type,
        unit: param?.unit ?? '',
        step: param?.step ?? 1,
        minSliderVal: param?.minSliderVal ?? 0,
        maxSliderVal: param?.maxSliderVal ?? 0,
      };
  }
}

export function GetDisplayValue(
  value: number,
  unitOfMeasurement: UNIT_OF_MEASUREMENT_LENGTH = UNIT_OF_MEASUREMENT_LENGTH.ACRES
) {
  if (unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.HECTARES) {
    return ToFixedNumber(AcresToHectares(value), 2);
  }
  return ToFixedNumber(value, 2);
}

export function FormatInterval(min: number, max: number) {
  if (min === 0 && max === 0) {
    return 'N/A';
  }
  if (min === max) {
    return `${min} days`;
  }
  return `${min} - ${max} days`;
}

export function FormatQuarantine(days: number) {
  return days === 0 ? 'N/A' : `${days} days`;
}

export function FormatValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(1);
}
