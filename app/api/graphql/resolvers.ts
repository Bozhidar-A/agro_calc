import { prisma } from "@/lib/prisma";
import { GraphQLUnauthorizedError } from "@/lib/utils";
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        UserID: async (_: never, { id }: { id: string }) => {
            return prisma.user.findUnique({ where: { id } });
        },
        UserEmail: async (_: never, { email }: { email: string }) => {
            return prisma.user.findUnique({ where: { email } });
        },
        RefreshTokenToken: async (_: never, { token }: { token: string }) => {
            return prisma.refreshToken.findUnique({ where: { token } });
        },
    },
    Mutation: {
        DeleteRefreshToken: async (_: never, { token, userId }: { token: string, userId: string }, content) => {
            console.log("DeleteRefreshToken context: ", content);
            GraphQLUnauthorizedError(content, "DeleteRefreshToken");

            try {
                const deletedToken = await prisma.refreshToken.delete({
                    where: {
                        token_userId: {
                            token,
                            userId,
                        },
                    },
                })
                console.log("Deleted token: ", deletedToken);
                return deletedToken;
            } catch (error) {
                console.error(error);
                throw new GraphQLError("Failed to delete refresh token. Ensure the token and userId are correct.");
            }
        },
    },
}