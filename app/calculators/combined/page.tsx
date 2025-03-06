'use client';

import { z } from 'zod';

const CreateZodSchemaForPlantRow = z.object({
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

function CreateDefaultValues() {
  return {
    legumes: Array(3).fill({
      active: false,
      dropdownPlant: '',
      seedingRate: 0,
      participation: 0,
      seedingRateInCombination: 0,
      priceSeedsPerDaBGN: 0,
    }),
    cereals: Array(3).fill({
      active: false,
      dropdownPlant: '',
      seedingRate: 0,
      participation: 0,
      seedingRateInCombination: 0,
      priceSeedsPerDaBGN: 0,
    }),
  };
}

function CalculateParticipation(items) {
  let totalParticipation = 0;
  for (const item of items) {
    if (item.active) {
      totalParticipation += Number(item.participation) || 0;
    }
  }
  return totalParticipation;
}

function ValidateMixBalance(data) {
  const totalLegumes = CalculateParticipation(data.legumes);
  const totalCereals = CalculateParticipation(data.cereals);
  return (
    totalLegumes <= 60 && totalCereals <= 40 && Math.abs(totalLegumes + totalCereals - 100) < 0.01
  );
}

const formSchema = z
  .object({
    legumes: z.array(CreateZodSchemaForPlantRow),
    cereals: z.array(CreateZodSchemaForPlantRow),
  })
  .refine(ValidateMixBalance, {
    message: 'Legumes max 60%, cereals max 40%, and total must be 100%',
  });

export default function Combined() {}
