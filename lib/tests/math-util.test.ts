import * as mathUtil from '../math-util';

describe('math-util', () => {
    test('RoundToSecondStr', () => {
        expect(mathUtil.RoundToSecondStr(1.2345)).toBe('1.23');
        expect(mathUtil.RoundToSecondStr(1)).toBe('1.00');
    });

    test('ToFixedNumber', () => {
        expect(mathUtil.ToFixedNumber(1.2345, 2)).toBe(1.23);
        expect(mathUtil.ToFixedNumber(0, 2)).toBe(0);
        expect(mathUtil.ToFixedNumber(1.235, 2)).toBe(1.24);
    });

    test('MetersSquaredToAcre', () => {
        expect(mathUtil.MetersSquaredToAcre(2)).toBe(2000);
    });

    test('MetersSquaredToHectare', () => {
        expect(mathUtil.MetersSquaredToHectare(3)).toBe(30000);
    });

    test('AcresToHectares', () => {
        expect(mathUtil.AcresToHectares(5)).toBe(50);
    });

    test('HectaresToAcres', () => {
        expect(mathUtil.HectaresToAcres(20)).toBe(2);
    });

    test('SowingRatePlantsPerAcreToHectare', () => {
        expect(mathUtil.SowingRatePlantsPerAcreToHectare(7)).toBe(70);
    });

    test('KgPerAcreToKgPerHectare', () => {
        expect(mathUtil.KgPerAcreToKgPerHectare(4)).toBe(40);
    });

    test('LitersToMl', () => {
        expect(mathUtil.LitersToMl(2)).toBe(2000);
    });

    test('MlToLiters', () => {
        expect(mathUtil.MlToLiters(5000)).toBe(5);
    });

    test('CmToMeters', () => {
        expect(mathUtil.CmToMeters(250)).toBe(2.5);
    });

    test('MetersToCm', () => {
        expect(mathUtil.MetersToCm(3.5)).toBe(350);
    });

    test('CalculateChemProtPercentSolution', () => {
        expect(mathUtil.CalculateChemProtPercentSolution(2, 5)).toBe(100);
    });

    test('CalculateChemProtWorkingChemicalLiters', () => {
        expect(mathUtil.CalculateChemProtWorkingChemicalLiters(3, 4)).toBe(12);
    });

    test('CalculateChemProtTotalChemicalLiters', () => {
        expect(mathUtil.CalculateChemProtTotalChemicalLiters(2000, 3)).toBe(6);
    });

    test('CalculateChemProtTotalWorkingSolutionLiters', () => {
        expect(mathUtil.CalculateChemProtTotalWorkingSolutionLiters(2, 4)).toBe(8);
    });

    test('CalculateChemProtRoughSprayerCount', () => {
        expect(mathUtil.CalculateChemProtRoughSprayerCount(10, 2, 4)).toBe(5);
    });

    test('CalculateChemProtWorkingSolutionPerSprayerML', () => {
        expect(mathUtil.CalculateChemProtWorkingSolutionPerSprayerML(100, 2, 5, 10)).toBe(2500);
    });
}); 