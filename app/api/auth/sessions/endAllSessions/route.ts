import { Log } from "@/lib/logger";
import { DecodeTokenContent } from "@/lib/utils-server";
import { DeleteAllRefreshTokensByUserId } from "@/prisma/prisma-utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        Log(["auth", "sessions", "endAllSessions"], `GET received`);

        const decodedData = await DecodeTokenContent();

        if (!decodedData || !decodedData.success || !decodedData.data?.userId) {
            Log(["auth", "sessions", "endAllSessions"], `GET failed: decodedData or userId is null`);
            return NextResponse.json({ success: false, message: "Invalid token data" });
        }
        const res = await DeleteAllRefreshTokensByUserId(decodedData.data.userId);
        Log(["auth", "sessions", "endAllSessions"], `GET returned: ${JSON.stringify(res)}`);

        return NextResponse.json({ success: true, data: res });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "sessions", "endAllSessions"], `GET failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}