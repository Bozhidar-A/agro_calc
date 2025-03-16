export function IsValueOutOfBounds(currVal: number, type: string, minSlide: number, maxSlide: number, constVal: number): boolean {
    if (type === "slider") {
        if (currVal < minSlide || currVal > maxSlide) {
            return true;
        }

        return false;
    }

    if (type === "const") {
        if (currVal !== constVal) {
            return true;
        }

        return false;
    }

    return false;
}