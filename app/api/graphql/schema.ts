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

    type Query{
        UserById(id: ID!): User
        UserByEmail(email: String!): User
        RefreshToken(token: String!): RefreshToken
    }

    type Mutation{
        InsertRefreshTokenForUser(token: String!, userId: ID!): RefreshToken
        DeleteRefreshToken(token: String!, userId: ID!): RefreshToken
        DeleteAllRefreshTokensForUser(userId: ID!): String
        HandleLoginAttempt(email: String!, password: String!): LoginResponse
        HandleRegisterAttempt(email: String!, password: String!): User
        HandleLogoutAttempt(token: String!, userId: ID!): String
    }
`