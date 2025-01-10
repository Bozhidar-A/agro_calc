import { QUERIES } from "@/app/api/graphql/callable";
import { jwtVerify } from "jose";

export async function VerifyTokenServer(secret: string, token: string, type: string) {
    if (!token) {
        return [false, null];
    }

    // Verify refresh token
    console.log("VerifyTokenServer -> token", token)
    console.log("VerifyTokenServer -> secret", secret)
    const decoded = await jwtVerify(token, new TextEncoder().encode(secret));

    console.log("VerifyTokenServer -> decoded", decoded)


    console.log("VerifyTokenServer -> type", type)
    if (decoded?.payload?.type !== type) {
        console.log("Invalid token type")
        return [false, null];
    }

    if (type === "refresh") {
        const variables = {
            query: QUERIES.REFRESH_TOKEN_TOKEN,
            token
        }
        const refreshGQL = await fetch("http://localhost:3000/api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(variables)
        });
        const refreshData = await refreshGQL.json();
        console.log("VerifyTokenServer -> refreshData", refreshData)

        if (refreshData.errors) {
            return [false, null];
        }
    }

    return [true, decoded];
}