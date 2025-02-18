'use server';

import { Log } from "@/lib/logger";
import { s } from "framer-motion/dist/types.d-O7VGXDJe";

export async function GraphQLCaller(logPath: string[], query: string, variables: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-internal-request": process.env.INTERNAL_API_REQUEST_SECRET || "",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        Log(logPath, `GraphQL fetch error: ${response.statusText}`);
        return {
            success: false,
            message: "Internal Server Error",
        }
    }

    const data = await response.json();

    if (data.errors) {
        data.errors.forEach((error: { message: string }) => {
            Log(logPath, error.message);
        });

        return {
            success: false,
            message: "Internal Server Error",
        }
    }

    return {
        success: true,
        data: data.data,
    }
}