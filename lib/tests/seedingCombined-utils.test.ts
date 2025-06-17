import {
    CreateDefaultValues,
    CalculateParticipation,
    ValidateMixBalance,
    FormatCombinedFormSavedToGraphDisplay
} from '../seedingCombined-utils';

describe('CreateDefaultValues', () => {
    it('should return default values for legume and cereal', () => {
        const result = CreateDefaultValues();
        expect(result.legume).toHaveLength(3);
        expect(result.cereal).toHaveLength(3);
        expect(result.legume[0]).toEqual({
            active: false,
            id: '',
            plantType: '',
            dropdownPlant: '',
            seedingRate: 0,
            participation: 0,
            seedingRateInCombination: 0,
            priceSeedsPerAcreBGN: 0,
        });
    });
});

describe('CalculateParticipation', () => {
    it('should sum participation of only active items', () => {
        const items = [
            { active: true, participation: 30 },
            { active: false, participation: 50 },
            { active: true, participation: 20 },
        ];
        expect(CalculateParticipation(items)).toBe(50);
    });
    it('should return 0 if no items are active', () => {
        const items = [
            { active: false, participation: 10 },
            { active: false, participation: 20 },
        ];
        expect(CalculateParticipation(items)).toBe(0);
    });
});

describe('ValidateMixBalance', () => {
    it('should return true for valid mix', () => {
        const data = {
            legume: [{ active: true, participation: 60 }],
            cereal: [{ active: true, participation: 40 }]
        };
        expect(ValidateMixBalance(data)).toBe(true);
    });
    it('should return false if legumes > 60', () => {
        const data = {
            legume: [{ active: true, participation: 61 }],
            cereal: [{ active: true, participation: 39 }]
        };
        expect(ValidateMixBalance(data)).toBe(false);
    });
    it('should return false if cereals > 40', () => {
        const data = {
            legume: [{ active: true, participation: 60 }],
            cereal: [{ active: true, participation: 41 }]
        };
        expect(ValidateMixBalance(data)).toBe(false);
    });
    it('should return false if total != 100', () => {
        const data = {
            legume: [{ active: true, participation: 50 }],
            cereal: [{ active: true, participation: 30 }]
        };
        expect(ValidateMixBalance(data)).toBe(false);
    });
});

describe('FormatCombinedFormSavedToGraphDisplay', () => {
    it('should map submitted data to graph display format', () => {
        const submitedData = {
            userId: 'u1',
            totalPrice: 123,
            isDataValid: true,
            plants: [
                { plantId: 'p1', foo: 'bar' },
                { plantId: 'p2', foo: 'baz' },
            ]
        };
        const dbData = [
            { id: 'p1', latinName: 'Plantus Oneus' },
            { id: 'p2', latinName: 'Plantus Twous' },
        ];
        const result = FormatCombinedFormSavedToGraphDisplay(submitedData, dbData);
        expect(result.userId).toBe('u1');
        expect(result.totalPrice).toBe(123);
        expect(result.isDataValid).toBe(true);
        expect(result.plants).toEqual([
            { plantLatinName: 'Plantus Oneus', plantId: 'p1', foo: 'bar' },
            { plantLatinName: 'Plantus Twous', plantId: 'p2', foo: 'baz' },
        ]);
    });
}); 