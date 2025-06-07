import { NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { GetChemProtWorkingSolutionInputPlantChems } from '@/prisma/prisma-utils';

export async function GET() {
    try {
        Log(['calc', 'chem-protection', 'working-solution', 'chemicals'], `GET called`);
        const plantsChems = await GetChemProtWorkingSolutionInputPlantChems();

        Log(
            ['calc', 'chem-protection', 'working-solution', 'chemicals'],
            `GET returned: ${JSON.stringify(plantsChems)}`
        );

        if (!plantsChems || plantsChems.length === 0) {
            return NextResponse.json({
                success: false,
                message: `No plants or chemicals found`,
            });
        }

        return NextResponse.json({
            success: true,
            data: plantsChems,
        });
    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
        Log(
            ['calc', 'chem-protection', 'working-solution', 'chemicals'],
            `GET failed with: ${errorMessage}`
        );
        return NextResponse.json({ success: false, message: `Internal Server Error` });
    }
} 