import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await BackendLogout(req);

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function BackendLogout(req) {
    const cookieStore = await cookies();

    if (cookieStore.get('refreshToken')) {
        await prisma.refreshToken.deleteMany({
            where: {
                token: cookieStore.get('refreshToken')?.value || ""
            }
        });
    }

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
}