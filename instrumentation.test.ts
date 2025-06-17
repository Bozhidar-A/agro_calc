import { SELECTABLE_STRINGS } from './lib/LangMap';
import { CalculatorValueTypes, CombinationTypes } from './lib/utils';

// Mock data for testing
// jest doesnt like const or let so we use var
// wack
// eslint-disable-next-line prefer-const, no-var
var mockDbData = {
  plants: [
    {
      latinName: SELECTABLE_STRINGS.PISUM_SATIVUM
    },
    {
      latinName: SELECTABLE_STRINGS.GLYCINE_MAX
    }
  ],
  SowingRateData: [
    {
      plantName: SELECTABLE_STRINGS.PISUM_SATIVUM,
      coefficientSecurity: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.01,
        unit: '',
        minSliderVal: 0.9,
        maxSliderVal: 0.99
      },
      wantedPlantsPerMeterSquared: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: 'plants/m²',
        minSliderVal: 300,
        maxSliderVal: 400
      },
      massPer1000g: {
        type: CalculatorValueTypes.SLIDER,
        step: 0.1,
        unit: 'g',
        minSliderVal: 170,
        maxSliderVal: 230
      },
      purity: {
        type: CalculatorValueTypes.CONST,
        unit: '%',
        val: 99.0
      },
      germination: {
        type: CalculatorValueTypes.SLIDER,
        step: 1,
        unit: '%',
        minSliderVal: 75.0,
        maxSliderVal: 100.0
      },
      rowSpacingCm: {
        type: CalculatorValueTypes.CONST,
        unit: 'cm',
        val: 12.5
      }
    }
  ],
  ChemicalProtectionData: [
    {
      plantUsages: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      nameKey: SELECTABLE_STRINGS.PISUM_SATIVUM,
      type: SELECTABLE_STRINGS.PISUM_SATIVUM,
      activeIngredients: [
        {
          nameKey: SELECTABLE_STRINGS.PISUM_SATIVUM,
          quantity: 100,
          unit: SELECTABLE_STRINGS.PISUM_SATIVUM
        }
      ],
      applicationStage: SELECTABLE_STRINGS.PISUM_SATIVUM,
      chemicalTargetEnemies: [SELECTABLE_STRINGS.PISUM_SATIVUM],
      dosage: 100,
      dosageUnit: SELECTABLE_STRINGS.PISUM_SATIVUM,
      maxApplications: 1,
      minIntervalBetweenApplicationsDays: 0,
      maxIntervalBetweenApplicationsDays: 0,
      quarantinePeriodDays: 0,
      pricePer1LiterBGN: 50,
      pricePerAcreBGN: 5,
      additionalInfo: SELECTABLE_STRINGS.PISUM_SATIVUM,
      additionalInfoNotes: SELECTABLE_STRINGS.PISUM_SATIVUM
    }
  ],
  SeedingDataCombination: [
    {
      plantName: SELECTABLE_STRINGS.PISUM_SATIVUM,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 10,
      maxSeedingRate: 20,
      priceFor1kgSeedsBGN: 5
    }
  ],
  ChemicalProtectionEnemiesData: [
    {
      latinName: SELECTABLE_STRINGS.PISUM_SATIVUM
    }
  ],
  activeIngredients: [
    {
      nameKey: 'Test Ingredient 1',
      unit: 'g/kg'
    }
  ],
  enemies: [
    {
      latinName: 'Test Enemy 1'
    }
  ],
  chemicalTargetEnemies: [
    {
      chemicalId: 'chem-1',
      enemyId: 'enemy-1'
    }
  ],
  chemicalActiveIngredients: [
    {
      chemicalId: 'chem-1',
      activeIngredientId: 'ingredient-1',
      quantity: 100
    }
  ],
  seedingDataCombinations: [
    {
      plantName: SELECTABLE_STRINGS.PISUM_SATIVUM,
      plantType: CombinationTypes.LEGUME,
      minSeedingRate: 10,
      maxSeedingRate: 20,
      priceFor1kgSeedsBGN: 5
    }
  ]
};

// Mock the module before imports
jest.doMock('./instrumentation', () => {
  const originalModule = jest.requireActual('./instrumentation');
  return {
    ...originalModule,
    dbData: mockDbData
  };
});

import { prisma } from '@/lib/prisma';
import { register } from './instrumentation';

// Mock SELECTABLE_STRINGS and CalculatorValueTypes
jest.mock('./lib/LangMap', () => ({
  SELECTABLE_STRINGS: {
    PISUM_SATIVUM: 'Pisum sativum',
    GLYCINE_MAX: 'Glycine max',
    SORGHUM_VULGARE_VAR_TEHNICUM: 'Sorghum vulgare var. tehnicum',
    ZEA_MAYS: 'Zea mays',
    MEDICAGO_SATIVA: 'Medicago sativa',
    TRIFOLIUM_STELLATUM: 'Trifolium stellatum',
    TRIFOLIUM_PRATENSE: 'Trifolium pratense',
    TRIFOLIUM_REPENS: 'Trifolium repens',
    LOLIUM_PERENNE: 'Lolium perenne',
    AGROPYRON_CRISTATUM: 'Agropyron cristatum',
    DACTYLIS_GLOMERATA: 'Dactylis glomerata',
    AVENULA_PUBESCENS: 'Avenula pubescens',
    FESTUCA_PRATENSIS: 'Festuca pratensis',
    FESTUCA_RUBRA: 'Festuca rubra'
  }
}));

jest.mock('./lib/utils', () => ({
  CalculatorValueTypes: {
    SLIDER: 'slider',
    CONST: 'const'
  },
  CombinationTypes: {
    LEGUMES: 'legumes',
    CEREALS: 'cereals'
  }
}));

interface Plant {
  latinName: string;
  [key: string]: any;
}

interface SowingRateData {
  plantName: string;
  [key: string]: any;
}

interface ChemProtectionData {
  plantUsages: string[];
  nameKey: string;
  type: string;
  activeIngredients: {
    nameKey: string;
    quantity: number;
    unit: string;
  }[];
  applicationStage: string;
  chemicalTargetEnemies: string[];
  dosage: number;
  dosageUnit: string;
  maxApplications: number;
  minIntervalBetweenApplicationsDays: number;
  maxIntervalBetweenApplicationsDays: number;
  quarantinePeriodDays: number;
  pricePer1LiterBGN: number;
  pricePerAcreBGN: number;
  additionalInfo: string;
  additionalInfoNotes: string;
  [key: string]: any;
}

interface SeedingDataCombination {
  plantName: string;
  plantType: string;
  minSeedingRate: number;
  maxSeedingRate: number;
  priceFor1kgSeedsBGN: number;
  [key: string]: any;
}

// Mock prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    plant: {
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn()
    },
    sowingRatePlant: {
      create: jest.fn()
    },
    plantChemical: {
      create: jest.fn(),
      upsert: jest.fn(),
    },
    chemical: {
      create: jest.fn()
    },
    activeIngredient: {
      create: jest.fn()
    },
    enemy: {
      create: jest.fn()
    },
    chemicalToEnemy: {
      create: jest.fn()
    },
    chemicalActiveIngredient: {
      create: jest.fn()
    },
    seedingDataCombination: {
      create: jest.fn()
    },
    sowingRateCoefficientSecurity: {
      create: jest.fn()
    },
    sowingRateWantedPlantsPerMeterSquared: {
      create: jest.fn()
    },
    sowingRateMassPer1000g: {
      create: jest.fn()
    },
    sowingRatePurity: {
      create: jest.fn()
    },
    sowingRateGermination: {
      create: jest.fn()
    },
    sowingRateRowSpacingCm: {
      create: jest.fn()
    }
  }
}));

// Mock environment variables
const originalEnv = process.env;

describe('Instrumentation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('register', () => {
    it('should exit if INTERNAL_API_REQUEST_SECRET is not set', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      delete process.env.INTERNAL_API_REQUEST_SECRET;

      await register();

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith('INTERNAL_API_REQUEST_SECRET not set');
    });

    it('should exit if RESEND_API_KEY is not set', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      process.env.INTERNAL_API_REQUEST_SECRET = 'test-secret';
      delete process.env.RESEND_API_KEY;

      await register();

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith('RESEND_API_KEY not set');
    });

    it('should not seed database if plants already exist', async () => {
      process.env.INTERNAL_API_REQUEST_SECRET = 'test-secret';
      process.env.RESEND_API_KEY = 'test-key';
      process.env.NEXT_RUNTIME = 'nodejs';
      (prisma.plant.count as jest.Mock).mockResolvedValue(1);

      await register();

      expect(prisma.plant.create).not.toHaveBeenCalled();
      expect(prisma.sowingRatePlant.create).not.toHaveBeenCalled();
    });

    it('should seed database if no plants exist', async () => {
      process.env.INTERNAL_API_REQUEST_SECRET = 'test-secret';
      process.env.RESEND_API_KEY = 'test-key';
      process.env.NEXT_RUNTIME = 'nodejs';
      (prisma.plant.count as jest.Mock).mockResolvedValue(0);
      (prisma.plant.findUnique as jest.Mock).mockResolvedValue({ id: 'test-plant-id' });
      (prisma.plant.create as jest.Mock).mockResolvedValue({ id: 'test-plant-id' });
      (prisma.sowingRatePlant.create as jest.Mock).mockResolvedValue({ id: 'test-sowing-plant-id' });
      (prisma.chemical.create as jest.Mock).mockResolvedValue({ id: 'test-chemical-id' });
      (prisma.plantChemical.upsert as jest.Mock).mockResolvedValue({ id: 'test-plant-chemical-id' });

      await register(mockDbData);

      //verify plants were created
      expect(prisma.plant.create).toHaveBeenCalledTimes(mockDbData.plants.length);
      mockDbData.plants.forEach((plant: Plant, index: number) => {
        expect(prisma.plant.create).toHaveBeenNthCalledWith(index + 1, {
          data: plant
        });
      });

      //verify chemicals were created
      expect(prisma.chemical.create).toHaveBeenCalledTimes(1);
      mockDbData.ChemicalProtectionData.forEach((chemicalData: ChemProtectionData, index: number) => {
        expect(prisma.chemical.create).toHaveBeenNthCalledWith(index + 1, {
          data: expect.objectContaining({
            nameKey: chemicalData.nameKey,
            type: chemicalData.type,
            applicationStage: chemicalData.applicationStage,
            dosage: chemicalData.dosage,
            dosageUnit: chemicalData.dosageUnit,
            maxApplications: chemicalData.maxApplications,
            minIntervalBetweenApplicationsDays: chemicalData.minIntervalBetweenApplicationsDays,
            maxIntervalBetweenApplicationsDays: chemicalData.maxIntervalBetweenApplicationsDays,
            quarantinePeriodDays: chemicalData.quarantinePeriodDays,
            pricePer1LiterBGN: chemicalData.pricePer1LiterBGN,
            pricePerAcreBGN: chemicalData.pricePerAcreBGN,
            additionalInfo: chemicalData.additionalInfo,
            additionalInfoNotes: chemicalData.additionalInfoNotes,
            activeIngredients: {
              create: chemicalData.activeIngredients.map(ingredient => ({
                quantity: ingredient.quantity,
                activeIngredient: {
                  connectOrCreate: {
                    where: { nameKey: ingredient.nameKey },
                    create: {
                      nameKey: ingredient.nameKey,
                      unit: ingredient.unit
                    }
                  }
                }
              }))
            },
            chemicalTargetEnemies: {
              create: chemicalData.chemicalTargetEnemies.map(enemyName => ({
                enemy: {
                  connectOrCreate: {
                    where: { latinName: enemyName },
                    create: { latinName: enemyName }
                  }
                }
              }))
            }
          })
        });
      });

      //verify sowing rate data was created
      expect(prisma.sowingRatePlant.create).toHaveBeenCalledTimes(mockDbData.SowingRateData.length);
      mockDbData.SowingRateData.forEach((_sowingRate: SowingRateData, index: number) => {
        expect(prisma.sowingRatePlant.create).toHaveBeenNthCalledWith(index + 1, {
          data: expect.objectContaining({
            plant: {
              connect: {
                id: 'test-plant-id'
              }
            }
          })
        });
      });

      //verify chemical protection data was created
      expect(prisma.plantChemical.upsert).toHaveBeenCalledTimes(mockDbData.ChemicalProtectionData.length);
      mockDbData.ChemicalProtectionData.forEach((_chemProtection: ChemProtectionData, index: number) => {
        expect(prisma.plantChemical.upsert).toHaveBeenNthCalledWith(index + 1, {
          where: {
            plantId_chemicalId: {
              plantId: expect.any(String),
              chemicalId: expect.any(String)
            }
          },
          update: {},
          create: {
            plantId: expect.any(String),
            chemicalId: expect.any(String)
          }
        });
      });

      //verify seeding data combinations were created
      expect(prisma.seedingDataCombination.create).toHaveBeenCalledTimes(mockDbData.seedingDataCombinations.length);
      mockDbData.seedingDataCombinations.forEach((combination: SeedingDataCombination, index: number) => {
        expect(prisma.seedingDataCombination.create).toHaveBeenNthCalledWith(index + 1, {
          data: {
            plant: {
              connect: {
                id: 'test-plant-id'
              }
            },
            plantType: combination.plantType,
            minSeedingRate: combination.minSeedingRate,
            maxSeedingRate: combination.maxSeedingRate,
            priceFor1kgSeedsBGN: combination.priceFor1kgSeedsBGN
          }
        });
      });


      //connectOrCreate is not checked in the test
    });

    it('should not seed database if not in nodejs runtime', async () => {
      process.env.INTERNAL_API_REQUEST_SECRET = 'test-secret';
      process.env.RESEND_API_KEY = 'test-key';
      process.env.NEXT_RUNTIME = 'edge';
      (prisma.plant.count as jest.Mock).mockResolvedValue(0);

      await register();

      expect(prisma.plant.create).not.toHaveBeenCalled();
      expect(prisma.sowingRatePlant.create).not.toHaveBeenCalled();
    });
  });
});