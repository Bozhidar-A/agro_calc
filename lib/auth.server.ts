import { QUERIES } from "@/app/api/graphql/callable";
import { jwtVerify } from "jose";

export async function VerifyTokenServer(secret: string, token: string, type: string) {
    if (!token) {
        return [false, null];
    }

    // Verify refresh token

    const decoded = await jwtVerify(token, new TextEncoder().encode(secret));

    if (decoded?.payload?.type !== type) {
        console.error("Invalid token type")
        return [false, null];
    }

    if (type === "refresh") {
        const variables = {
            token
        }
        const refreshGQL = await fetch(new URL("/api/graphql", process.env.HOST_URL), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: QUERIES.REFRESH_TOKEN_TOKEN,
                variables
            })
        });
        if (!refreshGQL.ok) {
            console.log(refreshGQL.url);
        }

        const refreshData = await refreshGQL.json();

        if (refreshData.errors) {
            return [false, null];
        }
    }

    return [true, decoded];
}