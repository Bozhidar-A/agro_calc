export function RoundToSecondStr(num: number) {
    return num.toFixed(2);
}

//https://stackoverflow.com/a/29494612
export function ToFixedNumber(num: number, digits: number, base = 10) {
    const pow = Math.pow(base, digits);
    return (Math.round(num * pow) / pow);
}


export function MetersSquaredToAcre(metersSquared: number): number {
    return metersSquared * 1000;
}

export function CmToMeters(cm: number): number {
    return cm / 100;
}

export function MetersToCm(meters: number): number {
    return meters * 100;
}