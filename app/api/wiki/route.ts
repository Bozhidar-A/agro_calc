import { Log } from "@/lib/logger";
import { GetPlantDataByID } from "@/prisma/prisma-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json()

        Log(["api", "wiki", "plants", "id", "route"], `POST called with id: ${id}`);
        const res = await GetPlantDataByID(id);
        Log(["api", "wiki", "plants", "id", "route"], `POST returned: ${JSON.stringify(res)}`);

        if (!res) {
            return NextResponse.json({
                success: false,
                message: `Plant with id: ${id} not found`
            });
        }

        return NextResponse.json({
            success: true,
            data: res
        });
    } catch (error) {
        Log(["api", "wiki", "plants", "id", "route"], `POST failed with: ${error.message}`);
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
}