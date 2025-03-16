import { Log } from "@/lib/logger";
import { InsertSowingHistoryEntry } from "@/prisma/prisma-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const entry = await req.json();

        Log(["calc", "sowing", "history"], `POST called with: ${JSON.stringify(entry)}`);
        const sowingCalcHistoryEntry = await InsertSowingHistoryEntry(entry);
        Log(["calc", "sowing", "history"], `POST returned: ${JSON.stringify(sowingCalcHistoryEntry)}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        Log(["calc", "sowing", "input", "fetch"], `GET failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}