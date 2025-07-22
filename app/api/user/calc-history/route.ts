import { Log } from "@/lib/logger";
import { DecodeTokenContent } from "@/lib/utils-server";
import { GetChemProtPercentHistory, GetChemProtWorkingSolutionHistory, GetCombinedHistory, GetSowingHistory } from "@/prisma/prisma-utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        Log(["user", "calc-history"], `GET called`);

        const decryptedData = await DecodeTokenContent();

        if (!decryptedData.success || !decryptedData.data || !decryptedData.data.userId) {
            Log(["user", "calc-history"], `GET - DecodeTokenContent failed: ${decryptedData.message}`);
            return NextResponse.json({ success: false, message: decryptedData.message });
        }

        const calcHistory = Promise.all([
            GetSowingHistory(decryptedData.data.userId),
            GetCombinedHistory(decryptedData.data.userId),
            GetChemProtPercentHistory(decryptedData.data.userId),
            GetChemProtWorkingSolutionHistory(decryptedData.data.userId)
        ]);

        const [sowingHistory, combinedHistory, chemProtPercentHistory, chemProtWorkingSolutionHistory] = await calcHistory;

        if (!sowingHistory || !combinedHistory || !chemProtPercentHistory || !chemProtWorkingSolutionHistory) {
            Log(["user", "calc-history"], `GET returned: No history found`);
            return NextResponse.json({ success: false, message: "No history found" });
        }

        Log(["user", "calc-history"], `GET returned: History data retrieved successfully`);
        return NextResponse.json({
            success: true,
            data: {
                sowingHistory,
                combinedHistory,
                chemProtPercentHistory,
                chemProtWorkingSolutionHistory
            }
        });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["user", "calc-history", "GET"], `GET failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}