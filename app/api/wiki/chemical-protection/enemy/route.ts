import { NextRequest, NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { GetChemProtectionEnemyData } from '@/prisma/prisma-utils';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    Log(['api', 'wiki', 'chem protection', 'enemy', 'id', 'route'], `POST called with id: ${id}`);
    const res = await GetChemProtectionEnemyData(id);
    Log(
      ['api', 'wiki', 'chem protection', 'enemy', 'id', 'route'],
      `POST returned: ${JSON.stringify(res)}`
    );

    if (!res) {
      return NextResponse.json({
        success: false,
        message: `Plant with id: ${id} not found`,
      });
    }

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(
      ['api', 'wiki', 'chem protection', 'enemy', 'id', 'route'],
      `POST failed with: ${errorMessage}`
    );
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
