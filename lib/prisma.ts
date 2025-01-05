import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query", "info", "warn", "error"], // Optional: Enable detailed logging for debugging
    });

// Assign PrismaClient to global in development to avoid creating multiple instances
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
