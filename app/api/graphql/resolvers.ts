import { prisma } from "@/lib/prisma";
import { GraphQLError } from "graphql";
import { GraphqlVerifyInternalRequest } from "@/lib/utils";
import { Log } from "@/lib/logger";
import { Delete, Hand } from "lucide-react";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { DeleteAllRefreshTokensByUserId, FindUserByEmail, InsertRefreshTokenByUserId } from "@/prisma/prisma-utils";

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
        // HandleLoginAttempt: async (
        //     _: never,
        //     { email, password }: { email: string; password: string },
        //     context: ResolverContext
        // ) => {
        //     try {
        //         //find the user
        //         const userRes = await context.resolvers.Query.UserByEmail(_, { email });

        //         if (!userRes) {
        //             Log([
        //                 "Auth",
        //                 "Login",
        //                 "GraphQL",
        //                 "HandleLoginAttempt"
        //             ], "No user found");
        //             throw new GraphQLError("Invalid email or password");
        //         }

        //         //compare passwords
        //         if (!await compare(password, userRes.password)) {
        //             Log([
        //                 "Auth",
        //                 "Login",
        //                 "GraphQL",
        //                 "HandleLoginAttempt"
        //             ], "Invalid password");
        //             throw new GraphQLError("Invalid email or password");
        //         }

        //         //delete all old refresh tokens
        //         //just in case
        //         await context.resolvers.Mutation.DeleteAllRefreshTokensForUser(_, { userId: userRes.id }, context);

        //         // Generate refresh token (long-lived)
        //         const refreshToken = await new SignJWT({ userId: userRes.id, type: 'refresh' })
        //             .setProtectedHeader({ alg: 'HS256' })
        //             .setExpirationTime('7d')
        //             .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));

        //         //insert new refresh token
        //         await context.resolvers.Mutation.InsertRefreshTokenForUser(_, { token: refreshToken, userId: userRes.id }, context);

        //         Log([
        //             "Auth",
        //             "Login",
        //             "GraphQL",
        //             "HandleLoginAttempt"
        //         ], `Refresh token: ${refreshToken}`);

        //         return {
        //             user: {
        //                 id: userRes.id,
        //                 email: userRes.email,
        //             },
        //             refreshToken: "tmp"
        //         }
        //     } catch (error) {
        //         console.error(error);
        //         Log([
        //             "Auth",
        //             "Login",
        //             "GraphQL",
        //             "HandleLoginAttempt"
        //         ], error.message);
        //         throw new GraphQLError("Invalid email or password");
        //     }

        // },
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
        }
    }
}