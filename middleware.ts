import { NextRequest, NextResponse } from "next/server";
import { ArrayContainsAndItemsStartsWith } from "./lib/utils";
import { BackendLogout, BackendVerifyToken, BackendRefreshAccessToken } from "./lib/auth-utils";
import { cookies } from "next/headers";
import { Log } from "./lib/logger";

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
    };

    // Prefire internal requests
    if (request.headers.get('x-internal-request') === process.env.INTERNAL_API_REQUEST_SECRET) {
        Log(["middleware"], "Internal request detected, continuing");
        return NextResponse.next();
    }

    // Special GraphQL handling
    if (request.nextUrl.pathname === routeDefinitions.protected.graphql && request.headers.has('x-internal-request')) {
        Log(["middleware"], "Internal request detected for GraphQL, continuing");
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        return NextResponse.next();
    }

    const isProtectedRoute = ArrayContainsAndItemsStartsWith([
        ...routeDefinitions.protected.api,
        ...routeDefinitions.protected.pages,
    ], pathname);

    const isAfterAuthRoute = ArrayContainsAndItemsStartsWith([
        ...routeDefinitions.protected.afterAuthAPI,
        ...routeDefinitions.protected.afterAuthPages,
    ], pathname);

    const accessToken = cookieStore.get('accessToken')?.value;

    //check if user is trying to access protected route
    if (isProtectedRoute) {
        Log(["middleware"], `Trying to access rotected route: ${pathname}`);

        //no token?
        if (!accessToken) {
            Log(["middleware"], `No access token found, redirecting to login page`);
            //straight to jail
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        //try to check if token is valid
        const [validAccessToken, decodedAccessToken] = await BackendVerifyToken(process.env.JWT_SECRET || '', accessToken, 'access');
        Log(["middleware"], `Is supplied access token valid?: ${validAccessToken}`);
        Log(["middleware"], `Decoded data from token: ${JSON.stringify(decodedAccessToken)}`);

        if (!validAccessToken) {
            Log(["middleware"], `Access token is invalid, trying to refresh`);

            try {
                await BackendRefreshAccessToken();
            } catch (error) {
                Log(["middleware", "refresh", "error"], `BackendRefreshAccessToken threw: ${error.message}`);

                //try to logout user
                const logoutAction = await BackendLogout(cookieStore.get("userId")?.value ?? "UNKNOWN???");

                //this should never happen
                //if it does, log it and fix it
                //can only really happen if user crafts a malicious request
                if (!logoutAction.success) {
                    Log(["middleware", "logout", "error"], `BackendLogout failed with: ${logoutAction.message}`);
                }

                return NextResponse.redirect(new URL('/auth/login?updateAuthState=refreshTokenExpired', request.url));
            }
        }
    }

    //check if user is authenticated and trying to access protected after auth routes
    if (accessToken && isAfterAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
