'use server';

import { Log } from "@/lib/logger";
import { request, gql } from "graphql-request";

export async function GraphQLCaller(logPath: string[], query: string, variables: any) {
    const endpoint = `${process.env.NEXT_PUBLIC_HOST_URL}/api/graphql`;

    try {
        const data = await request(endpoint, gql`${query}`, variables, {
            "x-internal-request": process.env.INTERNAL_API_REQUEST_SECRET || "",
        });

        return { success: true, data };
    } catch (error: any) {
        let combinedErrors = "";

        if (error.response?.errors) {
            error.response.errors.forEach((err: { message: string }) => {
                Log(logPath, err.message);
                combinedErrors += `${err.message} ; `;
            });
        } else {
            Log(logPath, error.message);
            combinedErrors = error.message;
        }

        return { success: false, message: combinedErrors };
    }
}
