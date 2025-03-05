'use server';

import { MUTATIONS, QUERIES } from "@/app/api/graphql/callable";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { Log } from "./logger";
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

    //also check if it exists in the db
    if (type === "refresh") {
        const graphqlData = await GraphQLCaller([
            "auth",
            "BackendVerifyToken",
            "refresh",
            "graphql"
        ], QUERIES.REFRESH_TOKEN, {
            token
        });

        if (!graphqlData.success) {
            return [false, null];
        }
    }

    return [true, decoded];
}

export async function BackendRegister(email: string, password: string) {
    try {
        const registerUserData = await GraphQLCaller([
            "auth",
            "register",
            "graphql"
        ], MUTATIONS.HANDLE_REGISTER_ATTEMPT, {
            email,
            password
        })

        if (!registerUserData.success) {
            return { success: false, message: "User already exists" };
        }

        return { success: true, user: { id: registerUserData.data.HandleRegisterAttempt.id, email: registerUserData.data.HandleRegisterAttempt.email } };
    } catch (error) {
        Log([
            "auth",
            "register"
        ], `BackendRegister failed with: ${error.message}`)
        return { success: false, message: error.message };
    }
}

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
        Log([
            "auth",
            "login"
        ], `BackendLogin failed with: ${error.message}`)
        return { success: false, message: error.message };
    }
}

export async function BackendLogout(userId: string) {
    try {
        const cookieStore = await cookies();

        const refreshTokenVal = cookieStore.get('refreshToken')?.value;

        if (!refreshTokenVal) {
            // No refresh token found
            //VERY wierd and bad
            //should never happen
            //still log em out
            //an internal error/state desync error should not cause an sao incident
            //its also bloody stupid
            Log([
                "auth",
                "logout"
            ], "No refresh token found")
        }

        const logoutUserData = await GraphQLCaller([
            "auth",
            "logout",
            "graphql"
        ], MUTATIONS.HANDLE_LOGOUT_ATTEMPT, {
            token: cookieStore.get('refreshToken')?.value || "",
            userId
        })

        if (!logoutUserData.success) {
            return { success: false, message: "Failed to logout" };
        }

        // Clear cookies
        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')
        cookieStore.delete('userId')

        return { success: true };
    }
    catch (error) {
        Log([
            "auth",
            "logout"
        ], `BackendLogout failed with: ${error.message}`)
        return { success: false, message: error.message };
    }
}

export async function BackendRefreshAccessToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
        throw new Error('No refresh token found');
    }

    const [validToken, decoded] = await BackendVerifyToken(process.env.JWT_REFRESH_SECRET || '', refreshToken, 'refresh');
    if (!validToken) {
        throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = await new SignJWT({ userId: decoded?.payload?.userId, type: 'access' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('15m')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // Set new access token cookie
    cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 900, // 15 minutes
    });
}