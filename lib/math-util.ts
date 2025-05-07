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

export function MetersSquaredToHectare(metersSquared: number): number {
    return metersSquared * 0.0001; // 1 square meter = 0.0001 hectares
}

export function SowingRatePlantsPerAcreToHectare(sowingRatePlantsPerAcre: number): number {
    return sowingRatePlantsPerAcre * 0.404686; // 1 acre = 0.404686 hectares
}

export function KgPerAcreToKgPerHectare(kgPerAcre: number): number {
    return kgPerAcre / 0.404686;
}

export function CmToMeters(cm: number): number {
    return cm / 100;
}

export function MetersToCm(meters: number): number {
    return meters * 100;
}