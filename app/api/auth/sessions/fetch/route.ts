import { Log } from "@/lib/logger";
import { DecodeTokenContent } from "@/lib/utils-server";
import { GetAllRefreshTokensByUserId } from "@/prisma/prisma-utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        Log(["auth", "sessions", "fetch"], `GET received`);

        const decodedData = await DecodeTokenContent();

        if (!decodedData || !decodedData.success || !decodedData.data?.userId) {
            Log(["auth", "sessions", "fetch"], `GET failed: decodedData or userId is null`);
            return NextResponse.json({ success: false, message: "Invalid token data" });
        }
        const res = await GetAllRefreshTokensByUserId(decodedData.data.userId, decodedData.data.refreshToken);
        Log(["auth", "sessions", "fetch"], `GET returned: ${JSON.stringify(res)}`);

        return NextResponse.json({ success: true, data: res });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(["auth", "sessions", "fetch"], `GET failed with: ${errorMessage}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}