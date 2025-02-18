import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { GraphQLError } from "graphql";
import { Log } from "./logger";

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