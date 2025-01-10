export const typeDefs = `
    type User{
        id: ID!
        email: String!
    }
    
    type RefreshToken {
        id: ID!
        token: String!
        userId: ID!
        user: User!
    }

    type Query{
        UserID(id: ID!): User
        UserEmail(email: String!): User
        RefreshTokenToken(token: String!): RefreshToken
        
    }

    type Mutation{
        DeleteRefreshToken(token: String!, userId: ID!): RefreshToken
    }
`