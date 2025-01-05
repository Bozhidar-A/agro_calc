import { NextResponse } from "next/server";
import { VerifyTokenServer } from "./lib/auth.server";
import { ArrayContainsAndItemsStartsWith } from "./lib/util";

export async function middleware(request) {
    const routeDefinitions = {
        // public: {
        //     api: [
        //         "/api/auth/login",
        //         "/api/auth/refresh",
        //         "/api/auth/register",
        //         "/api/auth/logout",
        //     ],
        //     pages: [
        //         "/"
        //     ],
        // },
        protected: {
            api: [

            ],
            pages: [
                "/prot"
            ],
            afterAuthAPI: [
                "/api/auth/login",
            ],
            afterAuthPages: [
                "/auth/login",
            ],
        }
    }

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

    if (request.cookies.get('accessToken') === undefined) {
        //not authenticated?
        //accessing a protected route?
        //straight to jail
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }


    //try to verify the access token
    const [validToken, decoded] = await VerifyTokenServer(process.env.JWT_SECRET, request.cookies.get('accessToken')?.value, 'access');

    if (!validToken) {
        //try to refresh the access token
        const refreshFetchRes = await fetch('/api/auth/refresh');

        if (!refreshFetchRes.ok) {
            //failed to refresh the access token
            //force logout and redirect to login page
            await fetch('/api/auth/logout');
            return NextResponse.redirect(new URL('/auth/login', request.url));
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