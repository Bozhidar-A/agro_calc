import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { GraphQLError } from "graphql";
import { Log } from "./logger";
import latinNamesMap from "./latinNamesMap";

export function ArrayContainsAndItemsStartsWith(array: string[], item: any) {
  return array.some((i) => i.startsWith(item));
}

export function GraphqlVerifyInternalRequest(context, location) {
  Log(["GraphQL", "Internal Verifyer"], `isInternalRequest value: ${context.isInternalRequest}`);

  if (!context.isInternalRequest) {
    console.error(`Unauthorized GraphQL request in ${location}`);
    throw new GraphQLError("Unauthorized GraphQL request");
  }
}

export function GetBGNameFromMap(lang: string, str: string) {
  console.log("GetBGNameFromMap", lang, str);
  console.log("res", latinNamesMap[lang][str]);
  if (latinNamesMap[lang][str]) {
    return latinNamesMap[lang][str];
  }

  return str;
}
