import { prisma } from "@/lib/prisma";
import { GraphQLError } from "graphql";
import { GraphqlVerifyAuthedRequest, GraphqlVerifyInternalRequest } from "@/lib/utils";
import { Log } from "@/lib/logger";
import { Delete, Hand } from "lucide-react";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { CreateNewUser, DeleteAllRefreshTokensByUserId, FindUserByEmail, InsertRefreshTokenByUserId } from "@/prisma/prisma-utils";

interface ResolverContext {
    isInternalRequest: boolean;
    headers: Headers;
    resolvers: typeof resolvers;
}

export const resolvers = {
    Query: {
        UserById: async (_: never, { id }: { id: string }) => {
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new GraphQLError('User not found');
            }
            return user;
        },
        UserByEmail: async (_: never, { email }: { email: string }) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new GraphQLError('User not found');
            }
            return user;
        },
        RefreshToken: async (_: never, { token }: { token: string }) => {
            const refreshToken = await prisma.refreshToken.findUnique({ where: { token } });
            if (!refreshToken) {
                throw new GraphQLError('Refresh token not found');
            }
            return refreshToken;
        },
        SeedingCombinedAll: async () => {
            const finalData = [];

            const combinedSeedingData = await prisma.seedingDataCombination.findMany();

            if (!combinedSeedingData) {
                throw new GraphQLError('No seeding data found. Was DB seeded?');
            }

            for (const data of combinedSeedingData) {
                const basePlant = await prisma.plant.findFirst({
                    where: {
                        id: data.plantId
                    }
                })

                if (!basePlant) {
                    throw new GraphQLError(`Plant with id ${data.plantId} not found`);
                }

                finalData.push({
                    id: data.id,
                    latinName: basePlant?.latinName,
                    plantType: data.plantType,
                    minSeedingRate: data.minSeedingRate,
                    maxSeedingRate: data.maxSeedingRate,
                    priceFor1kgSeedsBGN: data.priceFor1kgSeedsBGN
                });
            }

            return finalData;
        }
    },
    Mutation: {
        InsertRefreshTokenForUser: async (
            _: never,
            { token, userId }: { token: string; userId: string },
            context: ResolverContext
        ) => {
            GraphqlVerifyInternalRequest(context, 'InsertRefreshTokenForUser');

            try {
                const refreshToken = await prisma.refreshToken.create({
                    data: {
                        token,
                        userId,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                    }
                });

                Log([
                    "GraphQL",
                    "InsertRefreshTokenForUser",
                ], refreshToken.id);

                return refreshToken;
            } catch (error) {
                Log([
                    "GaphQL",
                    "InsertRefreshTokenForUser"
                ], `Failed to insert refresh token: ${error}`);
                throw new GraphQLError(
                    'Failed to insert refresh token. Please ensure the token and userId are valid.'
                );
            }
        },
        DeleteRefreshToken: async (
            _: never,
            { token, userId }: { token: string; userId: string },
            context: ResolverContext
        ) => {
            GraphqlVerifyInternalRequest(context, 'DeleteRefreshToken');

            try {
                const result = await prisma.refreshToken.deleteMany({
                    where: { token, userId }
                });

                Log([
                    "GraphQL",
                    "DeleteRefreshToken",
                ], result.count.toString());

                return { id: token, token, userId };
            } catch (error) {
                Log([
                    "GraphQL",
                    "DeleteRefreshToken",
                ], `Failed to delete refresh token: ${error}`);
                throw new GraphQLError(
                    'Failed to delete refresh token. Please ensure the token and userId are valid.'
                );
            }
        },
        DeleteAllRefreshTokensForUser: async (
            _: never,
            { userId }: { userId: string },
            context: ResolverContext
        ) => {
            GraphqlVerifyInternalRequest(context, 'DeleteAllRefreshTokensForUser');

            try {
                const result = await prisma.refreshToken.deleteMany({
                    where: { userId }
                });

                Log([
                    "GraphQL",
                    "DeleteAllRefreshTokensForUser",
                ], result.count.toString());

                return result.count.toString();
            } catch (error) {
                Log([
                    "GraphQL",
                    "DeleteAllRefreshTokensForUser",
                ], `Failed to delete all refresh tokens for user: ${error}`);
                throw new GraphQLError(
                    'Failed to delete all refresh tokens for user. Please ensure the userId is valid.'
                );
            }
        },
        HandleLoginAttempt: async (
            _: never,
            { email, password }: { email: string; password: string },
            context: ResolverContext
        ) => {
            GraphqlVerifyInternalRequest(context, 'HandleLoginAttempt');

            try {
                //find the user
                const user = await FindUserByEmail(email);

                if (!user) {
                    Log([
                        "Auth",
                        "Login",
                        "GraphQL",
                        "HandleLoginAttempt"
                    ], "No user found");
                    throw new GraphQLError("Invalid email or password");
                }

                //compare passwords
                if (!await compare(password, user.password)) {
                    Log([
                        "Auth",
                        "Login",
                        "GraphQL",
                        "HandleLoginAttempt"
                    ], "Invalid password");
                    throw new GraphQLError("Invalid email or password");
                }

                //delete all old refresh tokens
                //just in case
                const deletedTokensCount = await DeleteAllRefreshTokensByUserId(user.id);

                Log([
                    "Auth",
                    "Login",
                    "GraphQL",
                    "HandleLoginAttempt"
                ], `Deleted ${deletedTokensCount.count} refresh tokens for user ${user.id}`);

                // Generate refresh token (long-lived)
                const refreshToken = await new SignJWT({ userId: user.id, type: 'refresh' })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('7d')
                    .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));

                Log([
                    "Auth",
                    "Login",
                    "GraphQL",
                    "HandleLoginAttempt"
                ], `Refresh token: ${refreshToken}`);

                //insert new refresh token
                const insertedToken = await InsertRefreshTokenByUserId(refreshToken, user.id);

                Log([
                    "Auth",
                    "Login",
                    "GraphQL",
                    "HandleLoginAttempt"
                ], `Refresh token: ${insertedToken.id}`);

                return {
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                    refreshToken
                }
            } catch (error) {
                Log([
                    "Auth",
                    "Login",
                    "GraphQL",
                    "HandleLoginAttempt"
                ], `Failed to handle login attempt in GraphQL: ${error.message}`);
                throw new GraphQLError("Internal server error");
            }
        },
        HandleRegisterAttempt: async (
            _: never,
            { email, password }: { email: string; password: string },
            context: ResolverContext
        ) => {
            GraphqlVerifyInternalRequest(context, 'HandleRegisterAttempt');

            try {
                //check if the user already exists
                const user = await FindUserByEmail(email);

                if (user) {
                    Log([
                        "Auth",
                        "Register",
                        "GraphQL",
                        "HandleRegisterAttempt"
                    ], "User already exists");
                    throw new GraphQLError("User already exists");
                }

                //create the user
                const newUser = await CreateNewUser(email, password);

                Log([
                    "Auth",
                    "Register",
                    "GraphQL",
                    "HandleRegisterAttempt"
                ], `User created: ${newUser.id}`);

                return newUser;
            } catch (error) {
                Log([
                    "Auth",
                    "Register",
                    "GraphQL",
                    "HandleRegisterAttempt"
                ], `Failed to handle register attempt in GraphQL: ${error.message}`);
                throw new GraphQLError("Internal server error");
            }
        },
        HandleLogoutAttempt: async (
            _: never,
            { token, userId }: { token: string; userId: string },
            context: ResolverContext
        ) => {
            GraphqlVerifyInternalRequest(context, 'HandleLogoutAttempt');

            try {
                const result = await prisma.refreshToken.deleteMany({
                    where: { token, userId }
                });

                Log([
                    "GraphQL",
                    "HandleLogoutAttempt",
                ], result.count.toString());

                return result.count.toString();
            } catch (error) {
                Log([
                    "GraphQL",
                    "HandleLogoutAttempt",
                ], `Failed to delete refresh token: ${error}`);
                throw new GraphQLError(
                    'Failed to delete refresh token. Please ensure the token and userId are valid.'
                );
            }
        },
        //calculator mutations
        InsertCombinedResult: async (
            _: never,
            { plants, totalPrice, userId, isDataValid }: { plants: any; totalPrice: number; userId: string; isDataValid: boolean },
            context: ResolverContext
        ) => {

            try {
                Log([
                    "GraphQL",
                    "InsertCombinedResult",
                    "DEBUG"
                ], `plants: ${JSON.stringify(plants)}; totalPrice: ${totalPrice}; userId: ${userId}; isDataValid: ${isDataValid}`);
            } catch (error) {
                Log([
                    "GraphQL",
                    "InsertCombinedResult",
                ], `Failed to insert combined result: ${error}`);
                throw new GraphQLError(
                    'Failed to insert combined result. Please ensure the data is valid.'
                );
            }
        }
    }
}