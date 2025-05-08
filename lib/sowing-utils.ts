import { CalculatorValueTypes } from "@/lib/utils";

export function IsValueOutOfBounds(currVal: number, type: string, minSlide?: number, maxSlide?: number, constVal?: number): boolean {
    if (type === CalculatorValueTypes.ABOVE_ZERO) {
        if (currVal <= 0) {
            return true;
        }

        return false;
    }

    if (type === CalculatorValueTypes.SLIDER) {
        if (currVal < minSlide! || currVal > maxSlide!) {
            return true;
        }

        return false;
    }

    if (type === CalculatorValueTypes.CONST) {
        if (currVal !== constVal) {
            return true;
        }

        return false;
    }

    return false;
}