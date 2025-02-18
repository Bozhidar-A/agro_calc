'use server';

import { MUTATIONS, QUERIES } from "@/app/api/graphql/callable";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { Log } from "./logger";
import { compare } from "bcryptjs";
import { GraphQLCaller } from "@/app/api/graphql/graphql-utils";

export async function BackendVerifyToken(secret: string, token: string, type: string) {
    if (!token) {
        return [false, null];
    }

    // Verify refresh token
    const decoded = await jwtVerify(token, new TextEncoder().encode(secret));

    if (decoded?.payload?.type !== type) {
        console.error("Invalid token type")
        return [false, null];
    }

    if (type === "refresh") {
        const variables = {
            token
        }
        const refreshGQL = await fetch(new URL("/api/graphql", process.env.HOST_URL), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-request": process.env.INTERNAL_API_REQUEST_SECRET || ""
            },
            body: JSON.stringify({
                query: QUERIES.REFRESH_TOKEN,
                variables
            })
        });
        if (!refreshGQL.ok) {
            console.log(refreshGQL.url);
        }

        const refreshData = await refreshGQL.json();

        if (refreshData.errors) {
            return [false, null];
        }
    }

    return [true, decoded];
}

// export async function BackendLogin(email: string, password: string) {
//     try {
//         const cookieStore = await cookies();

//         const variables = {
//             email
//         };

//         const testv = {
//             email,
//             password
//         }

//         const test = await fetch(new URL("/api/graphql", process.env.NEXT_PUBLIC_HOST_URL), {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-internal-request": process.env.INTERNAL_API_REQUEST_SECRET || ""
//             },
//             body: JSON.stringify({
//                 query: MUTATIONS.HANDLE_LOGIN_ATTEMPT,
//                 variables: testv
//             })
//         });

//         if (!test.ok) {
//             throw new Error("Graphql request failed");
//         }

//         const testdata = await test.json();


//         const userReq = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/graphql`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-internal-request': process.env.INTERNAL_API_REQUEST_SECRET || '',
//             },
//             body: JSON.stringify({
//                 query: QUERIES.USER_BY_EMAIL,
//                 variables
//             })
//         });

//         const userData = await userReq.json();

//         if (userData?.errors) {
//             Log([
//                 "Auth",
//                 "Login"
//             ], userData.errors[0].message);
//             throw new Error("Invalid email or password");
//         }

//         const user = userData.data.UserByEmail;

//         if (!await compare(password, user.password)) {
//             Log([
//                 "Auth",
//                 "Login"
//             ], "Invalid email or password");
//             throw new Error("Invalid email or password");
//         }

//         //delete all old refresh tokens
//         //just in case
//         const deleteTokens = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/graphql`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-internal-request': process.env.INTERNAL_API_REQUEST_SECRET || '',
//             },
//             body: JSON.stringify({
//                 query: MUTATIONS.DELETE_ALL_REFRESH_TOKENS_FOR_USER,
//                 variables: {
//                     userId: user.id
//                 }
//             })
//         });
//         const deleteTokensData = await deleteTokens.json();
//         console.log(deleteTokensData);

//         if (deleteTokensData?.errors) {
//             Log([
//                 "Auth",
//                 "Login",
//                 "GraphQL",
//                 "DeleteRefreshTokens"
//             ], `Failed to nuke old refresh tokens: ${deleteTokensData.errors[0].message}`);
//         } else {
//             Log([
//                 "Auth",
//                 "Login",
//                 "GraphQL",
//                 "DeleteRefreshTokens"
//             ], `Delete refresh tokens for user ${user.id} count: ${deleteTokensData.data.DeleteAllRefreshTokensForUser}`);
//         }



//         // Generate access token (short-lived)
//         const accessToken = await new SignJWT({ userId: user.id, type: 'access' })
//             .setProtectedHeader({ alg: 'HS256' })
//             .setExpirationTime('15m')
//             .sign(new TextEncoder().encode(process.env.JWT_SECRET));

//         // Generate refresh token (long-lived)
//         const refreshToken = await new SignJWT({ userId: user.id, type: 'refresh' })
//             .setProtectedHeader({ alg: 'HS256' })
//             .setExpirationTime('7d')
//             .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));

//         // Store refresh token in database
//         const createToken = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/graphql`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-internal-request': process.env.INTERNAL_API_REQUEST_SECRET || '',
//             },
//             body: JSON.stringify({
//                 query: MUTATIONS.INSERT_REFRESH_TOKEN_FOR_USER,
//                 variables: {
//                     token: refreshToken,
//                     userId: user.id
//                 }
//             })
//         });

//         const createTokenData = await createToken.json();
//         console.log(createTokenData);

//         if (createTokenData?.errors) {
//             Log([
//                 "Auth",
//                 "Login",
//                 "GraphQL",
//                 "CreateRefreshToken"
//             ], `Failed to create refresh token: ${createTokenData.errors[0].message}`);
//             throw new Error("Failed to login. Please try again later.");
//         } else {
//             Log([
//                 "Auth",
//                 "Login",
//                 "GraphQL",
//                 "CreateRefreshToken"
//             ], `Created refresh token for user ${user.id}`);
//         }

//         // Set cookies
//         cookieStore.set('accessToken', accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 900, // 15 minutes
//             path: '/'
//         })

//         cookieStore.set('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60, // 7 days
//             // path: '/auth/refresh'
//             // apperently it is bad paractice to set to /
//             // will do for dev
//             //TODO: figure out and fix
//             path: '/'
//         })

//         cookieStore.set('userId', user.id, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60, // 7 days
//             path: '/'
//         })

//         return { success: true, user: { id: user.id, email: user.email } };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// }

export async function BackendLogin(email: string, password: string) {
    try {
        const cookieStore = await cookies();

        const loginUserData = await GraphQLCaller([
            "auth",
            "login",
            "graphql"
        ], MUTATIONS.HANDLE_LOGIN_ATTEMPT, {
            email,
            password
        })

        if (!loginUserData.success) {
            return { success: false, message: "Invalid email or password" };
        }

        const accessToken = await new SignJWT({ userId: loginUserData.data.HandleLoginAttempt.user.id, type: 'access' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('15m')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        Log([
            "auth",
            "login"
        ], `accessToken: ${accessToken}`);

        // Set cookies
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 900, // 15 minutes
            path: '/'
        })

        cookieStore.set('refreshToken', loginUserData.data.HandleLoginAttempt.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            // path: '/auth/refresh'
            // apperently it is bad paractice to set to /
            // will do for dev
            //TODO: figure out and fix
            path: '/'
        })

        cookieStore.set('userId', loginUserData.data.HandleLoginAttempt.user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        })

        Log([
            "auth",
            "login"
        ], `Logged in user ${loginUserData.data.HandleLoginAttempt.user.id}`);

        return { success: true, user: { id: loginUserData.data.HandleLoginAttempt.user.id, email: loginUserData.data.HandleLoginAttempt.user.email } };
    } catch (error) {
        return { success: false, message: error.message };
    }
}