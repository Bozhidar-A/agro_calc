import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function VerifyTokenServer(secret: string, token: string, type: string) {
    if (!token) {
        return [false, null];
    }

    // Verify refresh token
    const decoded = verify(token, secret);


    if (decoded.type !== type) {
        return [false, null];
    }

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findFirst({
        where: {
            token: token,
            userId: decoded.userId,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    if (!storedToken) {
        return [false, null];
    }

    return [true, decoded];
}