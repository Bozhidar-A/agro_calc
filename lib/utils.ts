import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import latinNamesMap from "./latinNamesMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ArrayContainsAndItemsStartsWith(array: string[], item: any) {
  return array.some((i) => i.startsWith(item));
}

export function GetLangNameFromMap(lang: string, str: string) {
  if (latinNamesMap[lang][str]) {
    return latinNamesMap[lang][str];
  }

  return str;
}
