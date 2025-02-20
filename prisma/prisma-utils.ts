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

export async function DeleteAllRefreshTokensByUserId(userId: string) {
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