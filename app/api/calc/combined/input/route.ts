import { Log } from "@/lib/logger";
import { GetCombinedInputData } from "@/prisma/prisma-utils";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        Log(["calc", "combined", "input", "fetch"], `GET called`);
        const res = await GetCombinedInputData()
        Log(["calc", "combined", "input", "fetch"], `GET returned count: ${JSON.stringify(res.length)}`);

        return NextResponse.json({
            success: true,
            data: res
        });
    } catch (error) {
        Log(["calc", "combined", "input", "fetch"], `GET failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}