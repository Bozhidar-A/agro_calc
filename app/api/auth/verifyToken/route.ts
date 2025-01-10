import { VerifyTokenServer } from "@/lib/auth.server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { secret, token, type } = await req.json();

        const [validToken, decoded] = await VerifyTokenServer(secret, token.value, type);

        return NextResponse.json({
            validToken,
            decoded
        });
    } catch (error) {
        const alwaysReturnUsableData = {
            validToken: false,
            decoded: null
        }
        return NextResponse.json(alwaysReturnUsableData);
    }

}