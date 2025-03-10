import { Log } from "./logger";

export async function APICaller(logPath: string[], route: string, variables: any) {
    const headers = {
        "Content-Type": "application/json",
    };

    Log(logPath, `Calling ${route} with ${JSON.stringify(variables)}`);

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}${route}`, {
        method: "POST",
        credentials: 'include',
        headers,
        body: JSON.stringify(variables),
    });

    if (!res.ok) {
        Log(logPath, `API call failed with: ${res.statusText}`);
        return { success: false, message: res.statusText };
    }

    const data = await res.json();
    Log(logPath, `API call returned: ${JSON.stringify(data)}`);

    return data;
}