export const QUERIES = {
  USER_BY_ID: `
    query UserById($id: ID!) {
      UserById(id: $id) {
        id
        email
      }
    }
  `,
  USER_BY_EMAIL: `
    query UserByEmail($email: String!) {
      UserByEmail(email: $email) {
        id
        email
        password
      }
    }
  `,
  REFRESH_TOKEN: `
    query RefreshToken($token: String!) {
      RefreshToken(token: $token) {
        id
        token
        userId
      }
    }
  `,
  SEEDING_COMBINED_ALL: `
    query SeedingCombinedAll {
      SeedingCombinedAll {
        latinName
        plantType
        minSeedingRate
        maxSeedingRate
        priceFor1kgSeedsBGN
      }
    }
  `,
} as const;

export const MUTATIONS = {
  INSERT_REFRESH_TOKEN_FOR_USER: `
    mutation InsertRefreshTokenForUser($token: String!, $userId: ID!) {
      InsertRefreshTokenForUser(token: $token, userId: $userId) {
        id
        token
        userId
      }
    }
  `,
  DELETE_REFRESH_TOKEN: `
    mutation DeleteRefreshToken($token: String!, $userId: ID!) {
      DeleteRefreshToken(token: $token, userId: $userId) {
        id
        token
        userId
      }
    }
  `,
  DELETE_ALL_REFRESH_TOKENS_FOR_USER: `
    mutation DeleteAllRefreshTokensForUser($userId: ID!) {
      DeleteAllRefreshTokensForUser(userId: $userId)
    }
  `,
  HANDLE_LOGIN_ATTEMPT: `
   mutation HandleLoginAttempt($email: String!, $password: String!) {
    HandleLoginAttempt(email: $email, password: $password) {
      user {
        id
        email
      }
      refreshToken
    }
  }
  `,
  HANDLE_REGISTER_ATTEMPT: `
    mutation HandleRegisterAttempt($email: String!, $password: String!) {
      HandleRegisterAttempt(email: $email, password: $password) {
        id
        email
      }
    }
  `,
  HANDLE_LOGOUT_ATTEMPT: `
    mutation HandleLogoutAttempt($token: String!, $userId: ID!) {
      HandleLogoutAttempt(token: $token, userId: $userId)
    }
  `
} as const;