import { Log } from "@/lib/logger";
import { GetChemProtPercentHistory, InsertChemProtPercentHistoryEntry } from "@/prisma/prisma-utils";
import { NextRequest, NextResponse } from "next/server";
import { DecodeTokenContent } from "@/lib/utils-server";

export async function POST(req: NextRequest) {
    try {
        const entry = await req.json();

        Log(["calc", "chem-protection", "percent-solution", "history"], `POST called with: ${JSON.stringify(entry)}`);
        const chemProtPercentHistoryEntry = await InsertChemProtPercentHistoryEntry(entry);
        Log(["calc", "chem-protection", "percent-solution", "history"], `POST returned: ${JSON.stringify(chemProtPercentHistoryEntry)}`);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["calc", "chem-protection", "percent-solution", "history", "POST"], `POST failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}

export async function GET() {
    try {
        Log(["calc", "chem-protection", "percent-solution", "history"], `GET called`);
        const decryptedData = await DecodeTokenContent();
        if (!decryptedData.success || !decryptedData.data || !decryptedData.data.userId) {
            Log(["calc", "chem-protection", "percent-solution", "history"], `GET - DecodeTokenContent failed: ${decryptedData.message}`);
            return NextResponse.json({ success: false, message: decryptedData.message });
        }
        const history = await GetChemProtPercentHistory(decryptedData.data.userId);
        Log(["calc", "chem-protection", "percent-solution", "history"], `GET returned: ${JSON.stringify(history)}`);
        return NextResponse.json({ success: true, data: history });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["calc", "chem-protection", "percent-solution", "history", "GET"], `GET failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}