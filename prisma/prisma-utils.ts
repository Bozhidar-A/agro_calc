import { SowingRateDBData } from "@/app/calculators/sowing/page";
import { CombinedCalcDBData } from "@/app/hooks/useSeedingCombinedForm";
import { SowingRateSaveData } from "@/app/hooks/useSowingRateForm";
import { HashPassword } from "@/lib/auth-utils";
import { Log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

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
        }
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

export async function InsertRefreshTokenByUserId(token: string, userId: string) {
    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
    });
}

export async function CreateResetPassword(email: string, token: string) {
    return await prisma.resetPassword.create({
        data: {
            email,
            token,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
    });
}

export async function FindResetPasswordByToken(token: string) {
    return await prisma.resetPassword.findUnique({ where: { token } });
}

export async function DeleteResetPasswordByEmail(email: string) {
    return await prisma.resetPassword.deleteMany({ where: { email } });
}

//calc stuff

//sowing
export async function GetSowingInputData() {
    const finalData: SowingRateDBData[] = [];

    // const sowingData = await prisma.plant.findMany({
    //     where: {
    //         coefficientSecurity: {
    //             isNot: null
    //         },
    //         wantedPlantsPerMeterSquared: {
    //             isNot: null
    //         },
    //         massPer1000g: {
    //             isNot: null
    //         },
    //         purity: {
    //             isNot: null
    //         },
    //         germination: {
    //             isNot: null
    //         },
    //         rowSpacingCm: {
    //             isNot: null
    //         }
    //     },
    //     include: {
    //         coefficientSecurity: {
    //             //sub fetch
    //             include: {
    //                 values: true,
    //             },
    //         },
    //         wantedPlantsPerMeterSquared: true,
    //         massPer1000g: true,
    //         purity: true,
    //         germination: true,
    //         rowSpacingCm: true
    //     }
    // });
    const sowingData = await prisma.sowingRatePlant.findMany({
        include: {
            plant: true,
            coefficientSecurity: true,
            wantedPlantsPerMeterSquared: true,
            massPer1000g: true,
            purity: true,
            germination: true,
            rowSpacingCm: true,
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
                type: plant.coefficientSecurity?.type ?? "slider",
                step: plant.coefficientSecurity?.step ?? 1,
                unit: plant.coefficientSecurity?.unit ?? "",
                minSliderVal: plant.coefficientSecurity?.minSliderVal ?? 0,
                maxSliderVal: plant.coefficientSecurity?.maxSliderVal ?? 0,
            },

            wantedPlantsPerMeterSquared: {
                type: plant.wantedPlantsPerMeterSquared?.type ?? "slider",
                step: plant.wantedPlantsPerMeterSquared?.step ?? 1,
                unit: plant.wantedPlantsPerMeterSquared?.unit ?? "plants/m²",
                minSliderVal: plant.wantedPlantsPerMeterSquared?.minSliderVal ?? 0,
                maxSliderVal: plant.wantedPlantsPerMeterSquared?.maxSliderVal ?? 0,
            },

            massPer1000g: {
                type: plant.massPer1000g?.type ?? "slider",
                step: plant.massPer1000g?.step ?? 1,
                unit: plant.massPer1000g?.unit ?? "g",
                minSliderVal: plant.massPer1000g?.minSliderVal ?? 0,
                maxSliderVal: plant.massPer1000g?.maxSliderVal ?? 0,
            },

            purity: {
                type: plant.purity?.type ?? "slider",
                unit: plant.purity?.unit ?? "%",
                step: plant.purity?.step ?? undefined,
                minSliderVal: plant.purity?.minSliderVal ?? undefined,
                maxSliderVal: plant.purity?.maxSliderVal ?? undefined,
                constValue: plant.purity?.constValue ?? undefined,
            },

            germination: {
                type: plant.germination?.type ?? "slider",
                step: plant.germination?.step ?? 1,
                unit: plant.germination?.unit ?? "%",
                minSliderVal: plant.germination?.minSliderVal ?? 0,
                maxSliderVal: plant.germination?.maxSliderVal ?? 0,
            },

            rowSpacing: {
                type: plant.rowSpacingCm?.type ?? "slider",
                unit: plant.rowSpacingCm?.unit ?? "cm",
                step: plant.rowSpacingCm?.step ?? undefined,
                minSliderVal: plant.rowSpacingCm?.minSliderVal ?? undefined,
                maxSliderVal: plant.rowSpacingCm?.maxSliderVal ?? undefined,
                constValue: plant.rowSpacingCm?.constValue ?? undefined,
            },
        });
    }

    return finalData;
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
                id: data.plantId
            }
        })

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
            priceFor1kgSeedsBGN: data.priceFor1kgSeedsBGN
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
    console.log(data);

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

//wiki stuff
export function GetPlantDataByID(id: string) {
    return prisma.plant.findUnique({ where: { id } });
}