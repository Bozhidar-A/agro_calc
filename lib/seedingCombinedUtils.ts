import { z } from "zod";

export const CreateZodSchemaForPlantRow = z.object({
    active: z.boolean(),
    dropdownPlant: z.string(),
    seedingRate: z.number().min(0, 'Seeding rate must be at least 0'),
    participation: z
        .number()
        .min(0, 'Participation must be at least 0%')
        .max(100, 'Participation cannot exceed 100%'),
    seedingRateInCombination: z.number().min(0, 'Seeding rate in combination must be at least 0'),
    priceSeedsPerDaBGN: z.number().min(0, 'Price must be at least 0'),
});

export function CreateDefaultValues() {
    return {
        legume: Array(3).fill({
            active: false,
            dropdownPlant: '',
            seedingRate: 0,
            participation: 0,
            seedingRateInCombination: 0,
            priceSeedsPerDaBGN: 0,
        }),
        cereal: Array(3).fill({
            active: false,
            dropdownPlant: '',
            seedingRate: 0,
            participation: 0,
            seedingRateInCombination: 0,
            priceSeedsPerDaBGN: 0,
        }),
    };
}

export function CalculateParticipation(items) {
    let totalParticipation = 0;
    for (const item of items) {
        if (item.active) {
            totalParticipation += Number(item.participation) || 0;
        }
    }
    return totalParticipation;
}

export function ValidateMixBalance(data) {
    const totalLegumes = CalculateParticipation(data.legume);
    const totalCereals = CalculateParticipation(data.cereal);
    const total = totalLegumes + totalCereals;

    if (totalLegumes > 60 || totalCereals > 40 || total !== 100) {
        return false;
    }

    return true;
}

export function UpdateSeedingComboAndPriceDA(form, name, dbData) {
    const [section, index, fieldName] = name.split('.');
    const basePath = `${section}.${index}`;
    const item = form.getValues(basePath);

    if (item.active && item.seedingRate && item.participation && item.dropdownPlant) {
        const selectedPlant = dbData.find((plant) => plant.latinName === item.dropdownPlant);
        if (selectedPlant) {
            const newSeedingRateInCombination = (item.seedingRate * item.participation) / 100;
            const newPriceSeedsPerDaBGN = newSeedingRateInCombination * selectedPlant.priceFor1kgSeedsBGN;

            // Only update if values changed to avoid infinite loop
            const prevSeedingRateInCombination = form.getValues(`${basePath}.seedingRateInCombination`);
            const prevPriceSeedsPerDaBGN = form.getValues(`${basePath}.priceSeedsPerDaBGN`);

            if (prevSeedingRateInCombination !== newSeedingRateInCombination) {
                form.setValue(`${basePath}.seedingRateInCombination`, newSeedingRateInCombination, { shouldValidate: false });
            }

            if (prevPriceSeedsPerDaBGN !== newPriceSeedsPerDaBGN) {
                form.setValue(`${basePath}.priceSeedsPerDaBGN`, ToFixedNumber(newPriceSeedsPerDaBGN, 2), { shouldValidate: false });
            }
        }
    }
}

export function RoundToSecondStr(num: number) {
    return num.toFixed(2);
}

//https://stackoverflow.com/a/29494612
function ToFixedNumber(num: number, digits: number, base = 10) {
    const pow = Math.pow(base, digits);
    return (Math.round(num * pow) / pow);
}
