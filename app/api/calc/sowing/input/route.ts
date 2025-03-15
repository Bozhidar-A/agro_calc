import { Log } from "@/lib/logger";
import { GetSowingInputData } from "@/prisma/prisma-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        Log(["calc", "sowing", "input", "fetch"], `GET called`);
        const res = await GetSowingInputData()
        Log(["calc", "sowing", "input", "fetch"], `GET returned count: ${JSON.stringify(res.length)}`);

        return NextResponse.json({
            success: true,
            data: res
        });
    } catch (error) {
        Log(["calc", "sowing", "input", "fetch"], `GET failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}