import { NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { GetAllChemProtectionActiveIngredients } from '@/prisma/prisma-utils';

export async function GET() {
  try {
    Log(['api', 'wiki', 'chem protection', 'all-active-ingredients', 'route'], `GET called`);
    const res = await GetAllChemProtectionActiveIngredients();
    Log(
      ['api', 'wiki', 'chem protection', 'all-active-ingredients', 'route'],
      `GET returned: ${JSON.stringify(res)}`
    );

    if (!res) {
      return NextResponse.json({
        success: false,
        message: `No active ingredients found`,
      });
    }

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(
      ['api', 'wiki', 'chem protection', 'all-active-ingredients', 'route'],
      `GET failed with: ${errorMessage}`
    );
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
