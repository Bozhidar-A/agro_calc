import { Log } from "@/lib/logger";
import { GetCombinedHistory, InsertCombinedHistoryEntry } from "@/prisma/prisma-utils";
import { NextRequest, NextResponse } from "next/server";
import { DecodeTokenContent } from "@/lib/utils-server";

export async function POST(req: NextRequest) {
    try {
        const entry = await req.json();

        Log(["calc", "combined", "history"], `POST called with: ${JSON.stringify(entry)}`);
        const combinedCalcHistoryEntry = await InsertCombinedHistoryEntry(entry);
        Log(["calc", "combined", "history"], `POST returned: ${JSON.stringify(combinedCalcHistoryEntry)}`);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["calc", "combined", "input", "fetch"], `GET failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}

export async function GET() {
    try {
        Log(["calc", "combined", "history", "GET"], `GET called`);
        const decryptedData = await DecodeTokenContent();
        if (!decryptedData.success || !decryptedData.data || !decryptedData.data.userId) {
            Log(["calc", "combined", "history", "GET"], `GET - DecodeTokenContent failed: ${decryptedData.message}`);
            return NextResponse.json({ success: false, message: decryptedData.message });
        }
        const history = await GetCombinedHistory(decryptedData.data.userId);
        Log(["calc", "combined", "history", "GET"], `GET returned: ${JSON.stringify(history)}`);
        return NextResponse.json({ success: true, data: history });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["calc", "combined", "history", "GET"], `GET failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}