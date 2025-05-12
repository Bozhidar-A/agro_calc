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

export const enum THEMES {
  THEME_LIGHT = 'light',
  THEME_DARK = 'dark',
  THEME_SYSTEM = 'system',
}

export const enum UNIT_OF_MEASUREMENT_LENGTH {
  ACRES = 'ACRES',
  HECTARES = 'HECTARES',
}

export enum LatinNames {
  // Seeding crops
  PISUM_SATIVUM = 'Pisum sativum', // Грах (Pea)
  GLYCINE_MAX = 'Glycine max', // Соя (Soybean)
  SORGHUM_VULGARE_VAR_TEHNICUM = 'Sorghum vulgare var. tehnicum', // Сорго (Sorghum)
  ZEA_MAYS = 'Zea mays', // Царевица (Corn)

  // Legumes (бобови)
  MEDICAGO_SATIVA = 'Medicago sativa', // Люцерна (Alfalfa)
  TRIFOLIUM_STELLATUM = 'Trifolium stellatum', // Звездан (Star Clover)
  TRIFOLIUM_PRATENSE = 'Trifolium pratense', // Червена детелина (Red Clover)
  TRIFOLIUM_REPENS = 'Trifolium repens', // Бяла детелина (White Clover)

  // Cereals / Grasses (зърнени / треви)
  LOLIUM_PERENNE = 'Lolium perenne', // Пасищен райграс (Perennial Ryegrass)
  AGROPYRON_CRISTATUM = 'Agropyron cristatum', // Гребенчат житняк (Crested Wheatgrass)
  DACTYLIS_GLOMERATA = 'Dactylis glomerata', // Ежова главица (Orchard Grass)
  AVENULA_PUBESCENS = 'Avenula pubescens', // Безосилеста овсига (Downy Oatgrass)
  FESTUCA_PRATENSIS = 'Festuca pratensis', // Ливадна власатка (Meadow Fescue)
  FESTUCA_RUBRA = 'Festuca rubra', // Червена власатка (Red Fescue)

  // chemical protection enemy targets
  // Балур (Johnson Grass)
  SORGHUM_HALEPENSE = 'Sorghum halepense',
  // Кисела трева
  ACID_GRASS = 'Acid grass',
  // Кокоше просо
  ECHINOCHLOA_CRUS_GALLI = 'Echinochloa crus-galli',
  // Кръвно просо
  PANICUM_SANGUINALE = 'Panicum sanguinale',
  // Кощрява
  POLYGONUM_AVICULARE = 'Polygonum aviculare',
  // Метлица
  SETARIA_VIRIDIS = 'Setaria viridis',
  // Овчарска торбичка
  CAPSELLA_BURSA_PASTORIS = 'Capsella bursa-pastoris',
  // Тученица
  PORTULACA_OLERACEA = 'Portulaca oleracea',
  // Черно куче грозде
  SOLANUM_NIGRUM = 'Solanum nigrum',
  // Видове щир
  AMARANTHUS_SPP = 'Amaranthus spp.',
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
