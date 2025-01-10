import { SignJWT } from 'jose';
import { cookies } from "next/headers";
import { VerifyTokenServer } from '@/lib/auth.server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await BackendRefreshAccessToken();

        return NextResponse.json({ message: 'Access token refreshed' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Internal Server Error: ${error}` }, { status: 500 });
    }
}

export async function BackendRefreshAccessToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
        // return NextResponse.json({ message: 'No refresh token found' }, { status: 401 });
        throw new Error('No refresh token found');
    }

    const [validToken, decoded] = await VerifyTokenServer(process.env.JWT_REFRESH_SECRET || '', refreshToken, 'refresh');
    if (!validToken) {
        // return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
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
        path: '/'
    });
}