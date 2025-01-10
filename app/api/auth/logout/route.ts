import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MUTATIONS } from "../../graphql/callable";

export async function GET(req) {
    try {
        await BackendLogout(req);

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function BackendLogout(req) {
    const cookieStore = await cookies();

    if (cookieStore.get('refreshToken')) {
        const variables = {
            //null check for ts to be happy
            token: cookieStore.get('refreshToken')?.value || "",
            userId: cookieStore.get('userId')?.value || ""
        }

        const deletedToken = await fetch(new URL('/api/graphql', req.url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-request': process.env.INTERNAL_API_REQUEST_SECRET || '',
            },
            body: JSON.stringify({
                query: MUTATIONS.DELETE_REFRESH_TOKEN,
                variables
            })
        })

        if (!deletedToken.ok) {
            throw new Error('Failed to delete refresh token');
        }

        // const data = await deletedToken.json();
        // console.log(data);

        if (!deletedToken.ok) {
            //This should never happen
            throw new Error(`Failed to delete refresh token: ${deletedToken.statusText}`);
        }

    }

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userId');
}