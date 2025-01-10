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

    const variables = {
        //null check for ts to be happy
        token: cookieStore.get('refreshToken')?.value || "",
        userId: cookieStore.get('userId')?.value || ""
    }

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userId');

    //all tokens are deleted on login
    //let it be a silent fail

    //delete the refresh token from the database
    try {
        if (variables.token && variables.userId) {

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
                throw new Error(`Failed to delete refresh token: ${deletedToken.statusText}`);
            }

            const data = await deletedToken.json();

            if (data.errors) {
                throw new Error(`Failed to delete refresh token: ${data.errors[0].message}`);
            }
        }
    } catch (error) {
        //silent fail
        console.error("Failed to delete refresh token: ", error);
    }

}