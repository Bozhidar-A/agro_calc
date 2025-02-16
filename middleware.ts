import { NextRequest, NextResponse } from "next/server";
import { ArrayContainsAndItemsStartsWith } from "./lib/utils";
import { BackendLogout } from "./app/api/auth/logout/route";
import { cookies } from "next/headers";
import { BackendRefreshAccessToken } from "./app/api/auth/refreshAccess/route";


export async function middleware(request: NextRequest) {
    const routeDefinitions = {
        protected: {
            api: [
                "/api/graphql",
            ],
            pages: [
                "/prot"
            ],
            afterAuthAPI: [
                "/api/auth/login",
                "/api/auth/register",
            ],
            afterAuthPages: [
                "/auth/login",
                "/auth/register",
            ],
            graphql: "/api/graphql"
        }
    }

    //prefire internal requests
    //if the request is internal, continue
    if (request.headers.get('x-internal-request') === process.env.INTERNAL_API_REQUEST_SECRET) {
        console.log("internal request");
        return NextResponse.next();
    }

    //graphql breaks my setup a bit
    //its one POST route and you pass the query in the body
    //some stuff like DeleteRefreshToken is something only the backend should be able to do
    //there is no easy way to check WHAT is being requested
    //so I have to use the yoga context to pass a flag to the resolvers
    //if there is no SET VALUE to the internal header, the request is trying to be internal
    //but it is not
    //throw error
    if (request.nextUrl.pathname === routeDefinitions.protected.graphql && request.headers.has('x-internal-request')) {
        //we dont know the value of the internal header
        //but it is trying to go to the graphql endpoint
        //try it
        //let the yoga context handle it
        //handle the fail in the fetch
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        //if the route is the home page, continue
        return NextResponse.next();
    }

    if (
        !ArrayContainsAndItemsStartsWith([
            ...routeDefinitions.protected.api,
            ...routeDefinitions.protected.pages,
        ], pathname)
    ) {
        // If the route is not in any of the protected arrays, continue
        return NextResponse.next();
    }

    if (cookieStore.get("accessToken") === undefined) {
        //not authenticated?
        //accessing a protected route?
        //straight to jail
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }


    //try to verify the access token
    const validationFetch = await fetch(new URL('/api/auth/verifyToken', request.url), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            secret: process.env.JWT_SECRET,
            token: cookieStore.get("accessToken"),
            type: 'access'
        })
    });
    // const { validToken, decoded } = await validationFetch.json();
    const { validToken } = await validationFetch.json();

    //decoded has the user id in payload.userId
    //can pass to logout instead of cookie

    if (!validToken) {

        console.log("refreshing token");
        //try to refresh the access token
        try {
            await BackendRefreshAccessToken();
        } catch (error) {
            console.error("BackendRefreshToken threw: ", error);
            //failed to refresh the access token
            //force logout and redirect to login page
            try {
                await BackendLogout(request);
            } catch (error) {
                //this means that something IS VERY WRONG
                //or there is no .env file
                console.log("Failed to logout user. Is there a .env file?");
                console.error("BackendLogout threw: ", error);
            }
            return NextResponse.redirect(new URL('/auth/login?updateAuthState=refreshTokenExpired', request.url));
        }
    }

    if (ArrayContainsAndItemsStartsWith(routeDefinitions.protected.afterAuthAPI, pathname) || ArrayContainsAndItemsStartsWith(routeDefinitions.protected.afterAuthPages, pathname)) {
        //user shouldn't be able to access this route if they are authenticated
        return NextResponse.redirect('/');
    }

    return NextResponse.next(); //if the route is protected and the user is authenticated, continue
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};