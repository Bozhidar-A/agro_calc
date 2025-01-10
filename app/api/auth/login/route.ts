import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers'
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { QUERIES } from '../../graphql/callable';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const data = await req.json();
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email }
        });
        const variables = {
            email
        }
        const userReq = await fetch(new URL('/api/graphql', req.url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: QUERIES.USER_EMAIL,
                variables
            })
        });
        // const user = await userReq.json();

        if (!user || !await compare(password, user.password)) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        //nuke all old refresh tokens
        await prisma.refreshToken.deleteMany({
            where: {
                userId: user.id
            }
        });

        // Generate access token (short-lived)
        const accessToken = await new SignJWT({ userId: user.id, type: 'access' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('15m')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        // Generate refresh token (long-lived)
        const refreshToken = await new SignJWT({ userId: user.id, type: 'refresh' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));


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
            // path: '/auth/refresh'
            // apperently it is bad paractice to set to /
            // will do for dev
            //TODO: figure out and fix
            path: '/'
        })

        cookieStore.set('userId', user.id, {
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
        console.log("Eroor in login route");
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}