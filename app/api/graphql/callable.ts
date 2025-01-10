export const QUERIES = {
  USERS: `
  query Users {
    Users {
      id
      email
    }
  }
`,
  USER_ID: `
  query UserID($id: ID!) {
    UserID(id: $id) {
      id
      email
    }
  }
`,
  USER_EMAIL: `
  query UserEmail($email: String!) {
    UserEmail(email: $email) {
      id
      email
    }
  }
`,
  REFRESH_TOKEN_TOKEN: `
  query RefreshTokenToken($token: String!) {
    RefreshTokenToken(token: $token) {
      id
      token
      userId
    }
  }
`
}

export const MUTATIONS = {
  DELETE_REFRESH_TOKEN: `
  mutation DeleteRefreshToken($token: String!, $userId: ID!) {
    DeleteRefreshToken(token: $token, userId: $userId) {
      id
      token
      userId
    }
  }
`
}