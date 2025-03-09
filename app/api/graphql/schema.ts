export const typeDefs = `    
    type LoginResponse {
        user: User
        refreshToken: String
    }

    type User {
        id: ID!
        email: String!
        password: String!
    }
    
    type RefreshToken {
        id: ID!
        token: String!
        userId: ID!
        user: User!
    }
    
    type SeedingCombined {
        id: ID!
        latinName: String!
        plantType: String!
        minSeedingRate: Float!
        maxSeedingRate: Float!
        priceFor1kgSeedsBGN: Float!
    }

    input SeedingCombinedPlantCalcData {
        plantId: ID!
        seedingRate: Float!
        participation: Float!
        combinedRate: Float!
        pricePerDA: Float!
    }

    type Query{
        UserById(id: ID!): User
        UserByEmail(email: String!): User
        RefreshToken(token: String!): RefreshToken
        SeedingCombinedAll: [SeedingCombined]
    }

    type Mutation{
        InsertRefreshTokenForUser(token: String!, userId: ID!): RefreshToken
        DeleteRefreshToken(token: String!, userId: ID!): RefreshToken
        DeleteAllRefreshTokensForUser(userId: ID!): String
        HandleLoginAttempt(email: String!, password: String!): LoginResponse
        HandleRegisterAttempt(email: String!, password: String!): User
        HandleLogoutAttempt(token: String!, userId: ID!): String

        InsertCombinedResult(
            plants: [SeedingCombinedPlantCalcData!]
            totalPrice: Float!
            userId: ID!
            isDataValid: Boolean!
        ): Boolean
    }
`