import { ChemProtPercentHistory, User } from '@prisma/client';
import { HashPassword } from '@/lib/auth-utils';
import {
  ChemProtWorkingToSave,
  CombinedCalcDBData,
  SowingRateDBData,
  SowingRateSaveData,
} from '@/lib/interfaces';
import { Log } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function FindUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function FindUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function CreateNewUser(email: string, password: string) {
  return await prisma.user.create({
    data: {
      email,
      password: await HashPassword(password),
    },
  });
}

export async function AttachCredentialsToUser(userId: string, email: string, password: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { email, password: await HashPassword(password) },
  });
}

export async function GetAllRefreshTokensByUserId(
  userId: string,
  requesterRefreshToken: string | undefined
) {
  if (!userId) {
    Log(['prisma', 'GetAllRefreshTokensByUserId'], `No userId provided`);
    return [];
  }

  if (!requesterRefreshToken) {
    Log(['prisma', 'GetAllRefreshTokensByUserId'], `No requesterRefreshToken provided`);
    return [];
  }

  return await prisma.refreshToken.findMany({
    where: { userId, NOT: { token: requesterRefreshToken } },
    select: {
      id: true,
      //dont dox people
      token: false,
      userInfo: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function FindRefreshToken(token: string) {
  return await prisma.refreshToken.findUnique({ where: { token } });
}

export async function DeleteAllRefreshTokensByUserId(userId: string) {
  if (!userId) {
    Log(['prisma', 'DeleteAllRefreshTokensByUserId'], `No userId provided`);
    return;
  }

  return await prisma.refreshToken.deleteMany({ where: { userId } });
}

export async function DeleteRefreshTokenById(tokenId: string) {
  if (!tokenId) {
    Log(['prisma', 'DeleteRefreshTokenById'], `No tokenId provided`);
    return;
  }

  return await prisma.refreshToken.delete({ where: { id: tokenId } });
}

export async function InsertRefreshTokenByUserId(
  token: string,
  userId: string,
  refreshTokenUserInfo: string
) {
  return await prisma.refreshToken.create({
    data: {
      token,
      userId,
      userInfo: refreshTokenUserInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
}

export async function CreateResetPassword(email: string, token: string) {
  return await prisma.resetPassword.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  });
}

export async function FindResetPasswordByToken(token: string) {
  return await prisma.resetPassword.findUnique({ where: { token } });
}

export async function DeleteResetPasswordByEmail(email: string) {
  return await prisma.resetPassword.deleteMany({ where: { email } });
}

//oauth googl
export async function FindUserByGoogleId(googleId: string) {
  return await prisma.user.findUnique({
    where: {
      googleId,
    },
  });
}

export async function CreateUserGoogle(googleId: string, email: string) {
  return await prisma.user.create({
    data: {
      googleId,
      email,
    },
  });
}

export async function AttachGoogleIdToUser(userId: string, googleId: string): Promise<User> {
  return await prisma.user.update({
    where: { id: userId },
    data: { googleId },
  });
}

//oauth github
export async function FindUserByGitHubId(githubId: string) {
  return await prisma.user.findUnique({
    where: {
      githubId,
    },
  });
}

export async function CreateUserGitHub(githubId: string, email: string) {
  return await prisma.user.create({
    data: {
      githubId,
      email,
    },
  });
}

export async function AttachGitHubIdToUser(userId: string, githubId: string): Promise<User> {
  return await prisma.user.update({
    where: { id: userId },
    data: { githubId },
  });
}

export async function FindUserSettingsByUserId(userId: string) {
  return await prisma.userSettings.findUnique({
    where: { userId },
  });
}

export async function UpdateUserSettings(
  userId: string,
  theme: string,
  language: string,
  prefUnitOfMeasurement: string
) {
  return await prisma.userSettings.upsert({
    where: { userId },
    update: { theme, language, prefUnitOfMeasurement },
    create: { userId, theme, language, prefUnitOfMeasurement },
  });
}

//calc stuff

//sowing
export async function GetSowingInputData() {
  const finalData: SowingRateDBData[] = [];

  const sowingData = await prisma.sowingRatePlant.findMany({
    include: {
      plant: {
        select: {
          id: true,
          latinName: true,
        },
      },
      coefficientSecurity: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      wantedPlantsPerMeterSquared: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      massPer1000g: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      purity: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
          constValue: true,
        },
      },
      germination: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      rowSpacingCm: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
          constValue: true,
        },
      },
    },
  });

  if (!sowingData) {
    Log(['prisma', 'GetSowingInputData'], `No seeding data found`);
    throw new Error(`No seeding data found`);
  }

  for (const plant of sowingData) {
    finalData.push({
      id: plant.id,

      plant: {
        plantId: plant.plant.id,
        plantLatinName: plant.plant.latinName,
      },

      coefficientSecurity: {
        type: plant.coefficientSecurity?.type ?? 'slider',
        step: plant.coefficientSecurity?.step ?? 1,
        unit: plant.coefficientSecurity?.unit ?? '',
        minSliderVal: plant.coefficientSecurity?.minSliderVal ?? 0,
        maxSliderVal: plant.coefficientSecurity?.maxSliderVal ?? 0,
      },

      wantedPlantsPerMeterSquared: {
        type: plant.wantedPlantsPerMeterSquared?.type ?? 'slider',
        step: plant.wantedPlantsPerMeterSquared?.step ?? 1,
        unit: plant.wantedPlantsPerMeterSquared?.unit ?? 'plants/m²',
        minSliderVal: plant.wantedPlantsPerMeterSquared?.minSliderVal ?? 0,
        maxSliderVal: plant.wantedPlantsPerMeterSquared?.maxSliderVal ?? 0,
      },

      massPer1000g: {
        type: plant.massPer1000g?.type ?? 'slider',
        step: plant.massPer1000g?.step ?? 1,
        unit: plant.massPer1000g?.unit ?? 'g',
        minSliderVal: plant.massPer1000g?.minSliderVal ?? 0,
        maxSliderVal: plant.massPer1000g?.maxSliderVal ?? 0,
      },

      purity: {
        type: plant.purity?.type ?? 'slider',
        unit: plant.purity?.unit ?? '%',
        step: plant.purity?.step ?? undefined,
        minSliderVal: plant.purity?.minSliderVal ?? undefined,
        maxSliderVal: plant.purity?.maxSliderVal ?? undefined,
        constValue: plant.purity?.constValue ?? undefined,
      },

      germination: {
        type: plant.germination?.type ?? 'slider',
        step: plant.germination?.step ?? 1,
        unit: plant.germination?.unit ?? '%',
        minSliderVal: plant.germination?.minSliderVal ?? 0,
        maxSliderVal: plant.germination?.maxSliderVal ?? 0,
      },

      rowSpacing: {
        type: plant.rowSpacingCm?.type ?? 'slider',
        unit: plant.rowSpacingCm?.unit ?? 'cm',
        step: plant.rowSpacingCm?.step ?? undefined,
        minSliderVal: plant.rowSpacingCm?.minSliderVal ?? undefined,
        maxSliderVal: plant.rowSpacingCm?.maxSliderVal ?? undefined,
        constValue: plant.rowSpacingCm?.constValue ?? undefined,
      },
    });
  }

  return finalData;
}

export async function GetSowingHistory(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  return await prisma.sowingRateHistory.findMany({
    where: { userId },
    select: {
      id: true,
      sowingRateSafeSeedsPerMeterSquared: true,
      sowingRatePlantsPerAcre: true,
      usedSeedsKgPerAcre: true,
      internalRowHeightCm: true,
      totalArea: true,
      isDataValid: true,
      createdAt: true,
      plant: {
        select: {
          latinName: true,
          id: true,
        },
      },
    },
  });
}

//combined
export async function GetCombinedInputData() {
  const finalData = [];

  const combinedSeedingData = await prisma.seedingDataCombination.findMany();

  if (!combinedSeedingData) {
    Log(['prisma', 'GetCombinedInputData'], `No seeding data found`);
    throw new Error(`No seeding data found`);
  }

  for (const data of combinedSeedingData) {
    const basePlant = await prisma.plant.findFirst({
      where: {
        id: data.plantId,
      },
    });

    if (!basePlant) {
      Log(['prisma', 'GetCombinedInputData'], `No plant found with id: ${data.plantId}`);
      throw new Error(`No plant found with id: ${data.plantId}`);
    }

    finalData.push({
      id: basePlant?.id,
      latinName: basePlant?.latinName,
      plantType: data.plantType,
      minSeedingRate: data.minSeedingRate,
      maxSeedingRate: data.maxSeedingRate,
      priceFor1kgSeedsBGN: data.priceFor1kgSeedsBGN,
    });
  }

  return finalData;
}

export async function InsertCombinedHistoryEntry(combinedData: CombinedCalcDBData) {
  const combinedCalcHistoryEntry = await prisma.seedingDataCombinationHistory.create({
    data: {
      userId: combinedData.userId,
      totalPrice: combinedData.totalPrice,
      isDataValid: combinedData.isDataValid,
      plants: {
        create: combinedData.plants.map((plant) => ({
          plantId: plant.plantId,
          plantType: plant.plantType,
          seedingRate: plant.seedingRate,
          participation: plant.participation,
          combinedRate: plant.combinedRate,
          pricePerAcreBGN: plant.pricePerAcreBGN, // Ensure this matches the DB schema
        })),
      },
    },
    include: {
      plants: true, // Include related plants in the response
    },
  });

  return combinedCalcHistoryEntry;
}

export async function InsertSowingHistoryEntry(data: SowingRateSaveData) {
  return await prisma.sowingRateHistory.create({
    data: {
      userId: data.userId,
      plantId: data.plantId,
      sowingRateSafeSeedsPerMeterSquared: data.sowingRateSafeSeedsPerMeterSquared,
      sowingRatePlantsPerAcre: data.sowingRatePlantsPerAcre,
      usedSeedsKgPerAcre: data.usedSeedsKgPerAcre,
      internalRowHeightCm: data.internalRowHeightCm,
      totalArea: data.totalArea,
      isDataValid: data.isDataValid,
    },
  });
}

export async function GetCombinedHistory(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  return await prisma.seedingDataCombinationHistory.findMany({
    where: { userId },
    select: {
      id: true,
      totalPrice: true,
      isDataValid: true,
      createdAt: true,
      plants: {
        select: {
          plantType: true,
          seedingRate: true,
          participation: true,
          combinedRate: true,
          pricePerAcreBGN: true,
          plant: {
            select: {
              latinName: true,
            },
          },
        },
      },
    },
  });
}

//chem protection percent solution
export async function GetChemProtWorkingSolutionInputPlantChems() {
  return await prisma.plantChemical.findMany({
    select: {
      id: true,
      plant: {
        select: {
          id: true,
          latinName: true,
        },
      },
      chemical: {
        select: {
          id: true,
          nameKey: true,
          dosage: true,
          dosageUnit: true,
        },
      },
    },
  });
}

export async function GetChemProtWorkingSolutionHistory(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  return await prisma.chemProtWorkingSolutionHistory.findMany({
    where: { userId },
    select: {
      id: true,
      totalChemicalForAreaLiters: true,
      totalWorkingSolutionForAreaLiters: true,
      roughSprayerCount: true,
      chemicalPerSprayerML: true,
      createdAt: true,
      plant: {
        select: {
          id: true,
          latinName: true,
        },
      },
      chemical: {
        select: {
          id: true,
          nameKey: true,
        },
      },
    },
  });
}

export async function InsertChemProtWorkingSolutionHistoryEntry(data: ChemProtWorkingToSave) {
  return await prisma.chemProtWorkingSolutionHistory.create({
    data,
  });
}

export async function GetChemProtPercentHistory(userId: string) {
  return await prisma.chemProtPercentHistory.findMany({
    where: { userId },
  });
}

export async function InsertChemProtPercentHistoryEntry(data: ChemProtPercentHistory) {
  return await prisma.chemProtPercentHistory.create({
    data,
  });
}

//wiki stuff
export function GetAllSowingPlants() {
  return prisma.sowingRatePlant.findMany({
    select: {
      plant: {
        select: {
          id: true,
          latinName: true,
        },
      },
    },
  });
}

export async function GetSowingPlantData(id: string) {
  const sowingData = await prisma.sowingRatePlant.findUnique({
    where: {
      plantId: id,
    },
    select: {
      id: true,
      plant: {
        select: {
          id: true,
          latinName: true,
        },
      },
      coefficientSecurity: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      wantedPlantsPerMeterSquared: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      massPer1000g: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      purity: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
          constValue: true,
        },
      },
      germination: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
        },
      },
      rowSpacingCm: {
        select: {
          type: true,
          step: true,
          unit: true,
          minSliderVal: true,
          maxSliderVal: true,
          constValue: true,
        },
      },
    },
  });

  if (!sowingData) {
    Log(['prisma', 'GetSowingInputData'], `No seeding data found`);
    throw new Error(`No seeding data found`);
  }

  const finalData = {
    id: sowingData.plant.id,

    plant: {
      id: sowingData.plant.id,
      latinName: sowingData.plant.latinName,
    },

    coefficientSecurity: {
      type: sowingData.coefficientSecurity?.type ?? 'slider',
      step: sowingData.coefficientSecurity?.step ?? 1,
      unit: sowingData.coefficientSecurity?.unit ?? '',
      minSliderVal: sowingData.coefficientSecurity?.minSliderVal ?? 0,
      maxSliderVal: sowingData.coefficientSecurity?.maxSliderVal ?? 0,
    },

    wantedPlantsPerMeterSquared: {
      type: sowingData.wantedPlantsPerMeterSquared?.type ?? 'slider',
      step: sowingData.wantedPlantsPerMeterSquared?.step ?? 1,
      unit: sowingData.wantedPlantsPerMeterSquared?.unit ?? 'plants/m²',
      minSliderVal: sowingData.wantedPlantsPerMeterSquared?.minSliderVal ?? 0,
      maxSliderVal: sowingData.wantedPlantsPerMeterSquared?.maxSliderVal ?? 0,
    },

    massPer1000g: {
      type: sowingData.massPer1000g?.type ?? 'slider',
      step: sowingData.massPer1000g?.step ?? 1,
      unit: sowingData.massPer1000g?.unit ?? 'g',
      minSliderVal: sowingData.massPer1000g?.minSliderVal ?? 0,
      maxSliderVal: sowingData.massPer1000g?.maxSliderVal ?? 0,
    },

    purity: {
      type: sowingData.purity?.type ?? 'slider',
      unit: sowingData.purity?.unit ?? '%',
      step: sowingData.purity?.step ?? undefined,
      minSliderVal: sowingData.purity?.minSliderVal ?? undefined,
      maxSliderVal: sowingData.purity?.maxSliderVal ?? undefined,
      constValue: sowingData.purity?.constValue ?? undefined,
    },

    germination: {
      type: sowingData.germination?.type ?? 'slider',
      step: sowingData.germination?.step ?? 1,
      unit: sowingData.germination?.unit ?? '%',
      minSliderVal: sowingData.germination?.minSliderVal ?? 0,
      maxSliderVal: sowingData.germination?.maxSliderVal ?? 0,
    },

    rowSpacing: {
      type: sowingData.rowSpacingCm?.type ?? 'slider',
      unit: sowingData.rowSpacingCm?.unit ?? 'cm',
      step: sowingData.rowSpacingCm?.step ?? undefined,
      minSliderVal: sowingData.rowSpacingCm?.minSliderVal ?? undefined,
      maxSliderVal: sowingData.rowSpacingCm?.maxSliderVal ?? undefined,
      constValue: sowingData.rowSpacingCm?.constValue ?? undefined,
    },
  };

  return finalData;
}

export function GetAllCombinedPlants() {
  return prisma.seedingDataCombination.findMany({
    include: {
      plant: true,
    },
  });
}

export async function GetCombinedPlantData(id: string) {
  const combinedData = await prisma.seedingDataCombination.findUnique({
    where: {
      plantId: id,
    },
    include: {
      plant: true,
    },
  });

  if (!combinedData) {
    Log(['prisma', 'GetCombinedPlantData'], `No combined data found`);
    throw new Error(`No combined data found`);
  }

  return combinedData;
}

export function GetAllChemProtectionPlants() {
  return prisma.plantChemical.findMany({
    select: {
      plant: {
        select: {
          id: true,
          latinName: true,
        },
      },
    },
  });
}

export function GetChemProtectionPlantData(id: string) {
  return prisma.plantChemical.findMany({
    where: {
      plantId: id,
    },
    select: {
      plant: {
        select: {
          id: true,
          latinName: true,
        },
      },
      chemical: {
        select: {
          id: true,
          nameKey: true,
          type: true,
          applicationStage: true,
          dosage: true,
          dosageUnit: true,
          maxApplications: true,
          minIntervalBetweenApplicationsDays: true,
          maxIntervalBetweenApplicationsDays: true,
          quarantinePeriodDays: true,
          pricePer1LiterBGN: true,
          pricePerAcreBGN: true,
          additionalInfo: true,
          additionalInfoNotes: true,
          activeIngredients: {
            select: {
              quantity: true,
              activeIngredient: {
                select: {
                  nameKey: true,
                  unit: true,
                },
              },
            },
          },
          chemicalTargetEnemies: {
            select: {
              enemy: {
                select: {
                  latinName: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function GetAllChemProtectionEnemies() {
  return prisma.enemy.findMany({
    select: {
      id: true,
      latinName: true,
      chemicals: {
        select: {
          chemical: {
            select: {
              id: true,
              nameKey: true,
              type: true,
              applicationStage: true,
              dosage: true,
              dosageUnit: true,
              maxApplications: true,
              minIntervalBetweenApplicationsDays: true,
              maxIntervalBetweenApplicationsDays: true,
              quarantinePeriodDays: true,
              pricePer1LiterBGN: true,
              pricePerAcreBGN: true,
              additionalInfo: true,
              additionalInfoNotes: true,
              activeIngredients: {
                select: {
                  quantity: true,
                  activeIngredient: {
                    select: {
                      nameKey: true,
                      unit: true,
                    },
                  },
                },
              },
              plantUsages: {
                select: {
                  plant: {
                    select: {
                      id: true,
                      latinName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export function GetChemProtectionEnemyData(id: string) {
  return prisma.enemy.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      latinName: true,
      chemicals: {
        select: {
          chemical: {
            select: {
              id: true,
              nameKey: true,
              type: true,
              applicationStage: true,
              dosage: true,
              dosageUnit: true,
              maxApplications: true,
              minIntervalBetweenApplicationsDays: true,
              maxIntervalBetweenApplicationsDays: true,
              quarantinePeriodDays: true,
              pricePer1LiterBGN: true,
              pricePerAcreBGN: true,
              additionalInfo: true,
              additionalInfoNotes: true,
              activeIngredients: {
                select: {
                  quantity: true,
                  activeIngredient: {
                    select: {
                      nameKey: true,
                      unit: true,
                    },
                  },
                },
              },
              plantUsages: {
                select: {
                  plant: {
                    select: {
                      id: true,
                      latinName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export function GetAllChemProtectionChemicals() {
  return prisma.chemical.findMany({
    select: {
      id: true,
      nameKey: true,
      type: true,
      applicationStage: true,
      dosage: true,
      dosageUnit: true,
      maxApplications: true,
      minIntervalBetweenApplicationsDays: true,
      maxIntervalBetweenApplicationsDays: true,
      quarantinePeriodDays: true,
      pricePer1LiterBGN: true,
      pricePerAcreBGN: true,
      additionalInfo: true,
      additionalInfoNotes: true,
      activeIngredients: {
        select: {
          quantity: true,
          activeIngredient: {
            select: {
              nameKey: true,
              unit: true,
            },
          },
        },
      },
      chemicalTargetEnemies: {
        select: {
          enemy: {
            select: {
              latinName: true,
            },
          },
        },
      },
      plantUsages: {
        select: {
          plant: {
            select: {
              id: true,
              latinName: true,
            },
          },
        },
      },
    },
  });
}

export function GetChemProtectionChemData(id: string) {
  return prisma.chemical.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nameKey: true,
      type: true,
      applicationStage: true,
      dosage: true,
      dosageUnit: true,
      maxApplications: true,
      minIntervalBetweenApplicationsDays: true,
      maxIntervalBetweenApplicationsDays: true,
      quarantinePeriodDays: true,
      pricePer1LiterBGN: true,
      pricePerAcreBGN: true,
      additionalInfo: true,
      additionalInfoNotes: true,
      activeIngredients: {
        select: {
          quantity: true,
          activeIngredient: {
            select: {
              nameKey: true,
              unit: true,
            },
          },
        },
      },
      chemicalTargetEnemies: {
        select: {
          enemy: {
            select: {
              latinName: true,
            },
          },
        },
      },
      plantUsages: {
        select: {
          plant: {
            select: {
              id: true,
              latinName: true,
            },
          },
        },
      },
    },
  });
}

export function GetAllChemProtectionActiveIngredients() {
  return prisma.activeIngredient.findMany({
    select: {
      id: true,
      nameKey: true,
      unit: true,
      chemicals: {
        select: {
          quantity: true,
          chemical: {
            select: {
              id: true,
              nameKey: true,
              type: true,
              applicationStage: true,
              dosage: true,
              dosageUnit: true,
              maxApplications: true,
              minIntervalBetweenApplicationsDays: true,
              maxIntervalBetweenApplicationsDays: true,
              quarantinePeriodDays: true,
              pricePer1LiterBGN: true,
              pricePerAcreBGN: true,
              additionalInfo: true,
              additionalInfoNotes: true,
              plantUsages: {
                select: {
                  plant: {
                    select: {
                      id: true,
                      latinName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export function GetChemProtectionActiveIngredientData(id: string) {
  return prisma.activeIngredient.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nameKey: true,
      unit: true,
      chemicals: {
        select: {
          quantity: true,
          chemical: {
            select: {
              id: true,
              nameKey: true,
              type: true,
              applicationStage: true,
              dosage: true,
              dosageUnit: true,
              maxApplications: true,
              minIntervalBetweenApplicationsDays: true,
              maxIntervalBetweenApplicationsDays: true,
              quarantinePeriodDays: true,
              pricePer1LiterBGN: true,
              pricePerAcreBGN: true,
              additionalInfo: true,
              additionalInfoNotes: true,
              plantUsages: {
                select: {
                  plant: {
                    select: {
                      id: true,
                      latinName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
