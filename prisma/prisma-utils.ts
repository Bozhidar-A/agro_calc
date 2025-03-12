import { CombinedCalcDBData } from "@/app/hooks/useSeedingCombinedForm";
import { Log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function FindUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
}

export async function CreateNewUser(email: string, password: string) {
    return await prisma.user.create({
        data: {
            email,
            password: await hash(password, parseInt(process.env.SALT_ROUNDS!)),
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

//calc stuff

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
                    pricePerDa: plant.pricePerDABGN, // Ensure this matches the DB schema
                })),
            },
        },
        include: {
            plants: true, // Include related plants in the response
        },
    });

    return combinedCalcHistoryEntry;
}