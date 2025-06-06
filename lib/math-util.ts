export function RoundToSecondStr(num: number) {
    return num.toFixed(2);
}

//https://stackoverflow.com/a/29494612
export function ToFixedNumber(num: number, digits: number, base = 10) {
    if (num === 0) {
        return 0;
    }
    const pow = base ** digits;
    return Math.round(num * pow) / pow;
}

export function MetersSquaredToAcre(metersSquared: number): number {
    return metersSquared * 1000;
}

export function MetersSquaredToHectare(metersSquared: number): number {
    //acre * 10 = hectare
    return metersSquared * 10000;
}

export function AcresToHectares(acres: number): number {
    return acres * 10;
}

export function HectaresToAcres(hectares: number): number {
    return hectares / 10;
}

export function SowingRatePlantsPerAcreToHectare(sowingRatePlantsPerAcre: number): number {
    //acre * 10 = hectare
    return sowingRatePlantsPerAcre * 10;
}

export function KgPerAcreToKgPerHectare(kgPerAcre: number): number {
    //acre * 10 = hectare
    return kgPerAcre * 10;
}

export function LitersToMl(liters: number): number {
    return liters * 1000;
}

export function MlToLiters(ml: number): number {
    return ml / 1000;
}

export function CmToMeters(cm: number): number {
    return cm / 100;
}

export function MetersToCm(meters: number): number {
    return meters * 100;
}

export function CalculateChemProtPercentSolution(desiredPercentage: number, sprayerVolume: number): number {
    return desiredPercentage * 10 * sprayerVolume;
}

export function CalculateChemProtWorkingChemicalLiters(chemicalPerAcre: number, areaToBeSprayedAcres: number): number {
    return chemicalPerAcre * areaToBeSprayedAcres;
}

export function CalculateChemProtTotalChemicalLiters(workingSolutionPerAcreMl: number, areaToBeSprayedAcres: number): number {
    return (workingSolutionPerAcreMl * areaToBeSprayedAcres) / 1000;
}

export function CalculateChemProtTotalWorkingSolutionLiters(workingSolutionPerAcreLiters: number, areaToBeSprayedAcres: number): number {
    return workingSolutionPerAcreLiters * areaToBeSprayedAcres;
}

export function CalculateChemProtRoughSprayerCount(totalWorkingSolutionLiters: number,
    areaToBeSprayedAcres: number,
    sprayerVolumePerAcreLiters: number): number {
    return (totalWorkingSolutionLiters * areaToBeSprayedAcres) / sprayerVolumePerAcreLiters;
}

export function CalculateChemProtWorkingSolutionPerSprayerML(
    chemicalPerAcreML: number,
    workingSolutionPerAcreLiters: number,
    areaToBeSprayedAcres: number,
    sprayerVolumePerAcreLiters: number)
    : number {
    // return chemicalPerAcreML / (workingSolutionPerAcreLiters * areaToBeSprayedAcres) / sprayerVolumePerAcreLiters / 1000;
    return (chemicalPerAcreML * areaToBeSprayedAcres) / (workingSolutionPerAcreLiters * sprayerVolumePerAcreLiters) * 100;
}
