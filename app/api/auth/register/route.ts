import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { email, password } = data;

        // Check if email is already taken
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            return NextResponse.json({ message: 'Email already taken' }, { status: 400 });
        }

        // Create user
        await prisma.user.create({
            data: {
                email,
                password: await hash(password, parseInt(process.env.SALT_ROUNDS)),
            }
        });

        //the login logic is already implemented in the login route
        const loginRes = await fetch(new URL('/api/auth/login', req.url).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        const loginResJson = await loginRes.json();

        if (!loginRes.ok) {
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
        return NextResponse.json({ message: 'User created', ...loginResJson }, { status: 201 });
    } catch (error) {
        console.log("Eroor in register route");
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}