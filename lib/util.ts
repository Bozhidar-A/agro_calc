import { GraphQLError } from "graphql";

export function ArrayContainsAndItemsStartsWith(array: string[], item: any) {
    return array.some((i) => i.startsWith(item));
}

export function GraphQLUnauthorizedError(context, location) {
    if (!context.isInternalRequest) {
        console.error(`Unauthorized GraphQL request in ${location}`);
        throw new GraphQLError("Unauthorized GraphQL request");
    }
}