export function ArrayContainsAndItemsStartsWith(array: string[], item: any) {
    return array.some((i) => i.startsWith(item));
}