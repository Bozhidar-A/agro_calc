import { z } from 'zod';
import { CombinedHistoryData, CombinedHistoryDataPlant } from '@/lib/interfaces';
import { ToFixedNumber } from './math-util';
import { Plant } from '@prisma/client';

export const CreateZodSchemaForPlantRow = z.object({
  active: z.boolean(),
  id: z.string(),
  plantType: z.string(),
  dropdownPlant: z.string(),
  seedingRate: z.number().min(0, 'Seeding rate must be at least 0'),
  participation: z
    .number()
    .min(0, 'Participation must be at least 0%')
    .max(100, 'Participation cannot exceed 100%'),
  seedingRateInCombination: z.number().min(0, 'Seeding rate in combination must be at least 0'),
  priceSeedsPerAcreBGN: z.number().min(0, 'Price must be at least 0'),
});

export function CreateDefaultValues() {
  return {
    legume: Array(3).fill({
      active: false,
      id: '',
      plantType: '',
      dropdownPlant: '',
      seedingRate: 0,
      participation: 0,
      seedingRateInCombination: 0,
      priceSeedsPerAcreBGN: 0,
    }),
    cereal: Array(3).fill({
      active: false,
      id: '',
      plantType: '',
      dropdownPlant: '',
      seedingRate: 0,
      participation: 0,
      seedingRateInCombination: 0,
      priceSeedsPerAcreBGN: 0,
    }),
  };
}

//@ts-ignore
export function CalculateParticipation(items) {
  let totalParticipation = 0;
  for (const item of items) {
    if (item.active) {
      totalParticipation += Number(item.participation) || 0;
    }
  }
  return totalParticipation;
}

//@ts-ignore
export function ValidateMixBalance(data) {
  const totalLegumes = CalculateParticipation(data.legume);
  const totalCereals = CalculateParticipation(data.cereal);
  const total = totalLegumes + totalCereals;

  if (totalLegumes > 60 || totalCereals > 40 || total !== 100) {
    return false;
  }

  return true;
}

//@ts-ignore
export function UpdateSeedingComboAndPriceDA(form, name, dbData) {
  const [section, index, _fieldName] = name.split('.');
  const basePath = `${section}.${index}`;
  const item = form.getValues(basePath);

  if (item.active && item.seedingRate && item.participation && item.dropdownPlant) {
    const selectedPlant = dbData.find((plant: Plant) => plant.id === item.id);
    if (selectedPlant) {
      const newSeedingRateInCombination = (item.seedingRate * item.participation) / 100;
      const newpriceSeedsPerAcreBGN =
        newSeedingRateInCombination * selectedPlant.priceFor1kgSeedsBGN;

      // Only update if values changed to avoid infinite loop
      const prevSeedingRateInCombination = form.getValues(`${basePath}.seedingRateInCombination`);
      const prevpriceSeedsPerAcreBGN = form.getValues(`${basePath}.priceSeedsPerAcreBGN`);

      if (prevSeedingRateInCombination !== newSeedingRateInCombination) {
        form.setValue(`${basePath}.seedingRateInCombination`, newSeedingRateInCombination, {
          shouldValidate: false,
        });
      }

      if (prevpriceSeedsPerAcreBGN !== newpriceSeedsPerAcreBGN) {
        form.setValue(
          `${basePath}.priceSeedsPerAcreBGN`,
          ToFixedNumber(newpriceSeedsPerAcreBGN, 2),
          { shouldValidate: false }
        );
      }
    }
  }
}

//func to format the saved data to a format easy to use in graph display in the form itself
//avoids fetches to the db
//a bit hacky
//@ts-ignore
export function FormatCombinedFormSavedToGraphDisplay(submitedData, dbData) {
  const finalData: CombinedHistoryData = {
    plants: [] as CombinedHistoryDataPlant[],
    totalPrice: 0,
    userId: '',
    isDataValid: false,
  };

  finalData.userId = submitedData.userId;
  finalData.totalPrice = submitedData.totalPrice;
  finalData.isDataValid = submitedData.isDataValid;

  for (const submitedPlant of submitedData.plants) {
    const dbPlant = dbData.find((plant: Plant) => plant.id === submitedPlant.plantId);
    if (dbPlant) {
      finalData.plants.push({
        plantLatinName: dbPlant.latinName,
        ...submitedPlant,
      });
    }
  }

  return finalData;
}
