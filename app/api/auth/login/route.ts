import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers'
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const data = await req.json();
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !await compare(password, user.password)) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Generate access token (short-lived)
        const accessToken = sign(
            { userId: user.id, type: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate refresh token (long-lived)
        const refreshToken = sign(
            { userId: user.id, type: 'refresh' },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Store refresh token in database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        // Set cookies
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 900, // 15 minutes
            path: '/'
        })

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        })

        // Return user data (but not tokens)
        return NextResponse.json({ user: { id: user.id, email: user.email } }, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}