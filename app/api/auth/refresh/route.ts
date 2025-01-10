import { SignJWT } from 'jose';
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import { VerifyTokenServer } from '@/lib/auth.server';

export async function GET(req: any) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;
        console.log("GET -> refreshToken", refreshToken)

        if (!refreshToken) {
            return NextResponse.json({ message: 'No refresh token found' }, { status: 401 });
        }

        const [validToken, decoded] = await VerifyTokenServer(process.env.JWT_REFRESH_SECRET, refreshToken, 'refresh');
        if (!validToken) {
            return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
        }

        // Generate new access token
        const newAccessToken = await new SignJWT({ userId: decoded?.userId, type: 'access' })
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

        return NextResponse.json({ message: 'Access token refreshed' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}