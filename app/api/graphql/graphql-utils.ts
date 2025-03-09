'use server';

import { Log } from "@/lib/logger";
import { cookies } from "next/headers";

export async function GraphQLCaller(logPath: string[], query: string, variables: any, isInternalRequest: boolean = true) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

    const headers = {
        "Content-Type": "application/json",
        "Cookie": cookieHeader,
    };

    if (isInternalRequest) {
        headers["x-internal-request"] = process.env.INTERNAL_API_REQUEST_SECRET;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/graphql`, {
        method: "POST",
        credentials: 'include', //all this cookie stuff because this cant be bothered to work
        headers,
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    // console.log(response);

    // if (!response.ok) {
    //     Log(logPath, `GraphQL fetch error: ${response.statusText}`);
    //     const responseText = await response.text();
    //     Log(logPath, `GraphQLCaller: Response Status → ${response.status}`);
    //     Log(logPath, `GraphQLCaller: Response Body → ${responseText}`);
    //     return {
    //         success: false,
    //         message: "Internal Server Error - GraphQL fetch error",
    //     }
    // }

    const data = await response.json();

    if (data.errors) {
        let combinedErrors = "";
        data.errors.forEach((error: { message: string }) => {
            Log(logPath, error.message);
            combinedErrors += `${error.message} ; `;
        });

        return {
            success: false,
            message: combinedErrors,
        }
    }

    return {
        success: true,
        data: data.data,
    }
}