import { Log } from "@/lib/logger";
import { InsertCombinedHistoryEntry } from "@/prisma/prisma-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const entry = await req.json();

        Log(["calc", "combined", "history"], `POST called with: ${JSON.stringify(entry)}`);
        const combinedCalcHistoryEntry = await InsertCombinedHistoryEntry(entry);
        Log(["calc", "combined", "history"], `POST returned: ${JSON.stringify(combinedCalcHistoryEntry)}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        Log(["calc", "combined", "input", "fetch"], `GET failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}