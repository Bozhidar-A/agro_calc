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

export enum ChemicalType {
  HERBICIDE = "Herbicide",
  INSECTICIDE = "Insecticide",
  FUNGICIDE = "Fungicide"
}

export enum ChemicalApplicationStage {
  AFTER_PLANTING_BEFORE_GERMINATION = "After planting before germination",
  OUT_OF_VEGETATION = "Out of vegetation",
  VEGETATION = "Vegetation",
  SPECIAL_VEGETATION = "Special vegetation"
}

export enum ChemicalActiveIngredientDosageUnit {
  G_L = "g/L",
  G_KG = "g/kg",
}

export enum ChemicalDosageUnit {
  ML_ACRE = "ml/acre",
  G_ACRE = "g/acre",
  G_100_KG_SEEDS = "g/100kg seeds",
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
