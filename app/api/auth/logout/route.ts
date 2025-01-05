import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const cookieStore = await cookies();

        // Clear cookies
        cookieStore.set('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        });
        cookieStore.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        });

        // Delete refresh token from database
        if (req.cookies.refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: {
                    token: req.cookies.refreshToken
                }
            });
        }

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
