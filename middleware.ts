import { NextRequest, NextResponse } from "next/server";
import { ArrayContainsAndItemsStartsWith } from "./lib/utils";
import { BackendLogout, BackendVerifyToken, BackendRefreshAccessToken } from "./lib/auth-utils";
import { cookies } from "next/headers";
import { Log } from "./lib/logger";

export async function middleware(request: NextRequest) {
    const routeDefinitions = {
        protected: {
            api: [
                "/api/user/settings",
                "/api/user/calc-history",
                "/api/calc/chem-protection/percent-solution/history",
                "/api/calc/chem-protection/working-solution/history",
                "/api/calc/combined/history",
                "/api/calc/sowing/history",
            ],
            pages: [
                "/profile"
            ],
            afterAuthAPI: [
                "/api/auth/login",
                "/api/auth/register",
            ],
            afterAuthPages: [
                "/auth/login",
                "/auth/register",
            ],
        }
    };

    const cookieStore = await cookies();
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        Log(["middleware"], `Trying to access root route, letting through`);
        return NextResponse.next();
    }

    const isAPIRoute = pathname.startsWith("/api");

    const isProtectedRoute = ArrayContainsAndItemsStartsWith([
        ...routeDefinitions.protected.api,
        ...routeDefinitions.protected.pages,
    ], pathname);

    const isAfterAuthRoute = ArrayContainsAndItemsStartsWith([
        ...routeDefinitions.protected.afterAuthAPI,
        ...routeDefinitions.protected.afterAuthPages,
    ], pathname);

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    //check if user is trying to access protected route
    if (isProtectedRoute) {
        Log(["middleware"], `Trying to access rotected route: ${pathname}`);

        //no token?
        if (!accessToken) {
            Log(["middleware"], `No access token found, checking type of route`);
            //straight to jail

            if (isAPIRoute) {
                Log(["middleware"], `API route, returning 401`);
                return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
            }

            Log(["middleware"], `Page route, redirecting to login page`);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        //try to check if token is valid
        const [validAccessToken, decodedAccessToken] = await BackendVerifyToken(process.env.JWT_SECRET || '', accessToken, 'access');
        Log(["middleware"], `Is supplied access token valid?: ${validAccessToken}`);
        Log(["middleware"], `Decoded data from token: ${JSON.stringify(decodedAccessToken)}`);

        if (!validAccessToken) {
            Log(["middleware"], `Access token is invalid, trying to refresh`);

            try {
                if (!refreshToken) {
                    Log(["middleware"], "No refreshToken provided");
                    throw new Error("No refreshToken provided")
                }
                await BackendRefreshAccessToken(refreshToken);
            } catch (error: unknown) {
                const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
                Log(["middleware", "refresh", "error"], `BackendRefreshAccessToken threw: ${errorMessage}`);

                //try to logout user
                const logoutAction = await BackendLogout();

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
