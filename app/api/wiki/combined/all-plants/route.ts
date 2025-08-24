import { NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { GetAllCombinedPlants } from '@/prisma/prisma-utils';

export async function GET() {
  try {
    Log(['api', 'wiki', 'combined', 'all-plants', 'route'], `GET called`);
    const res = await GetAllCombinedPlants();
    Log(['api', 'wiki', 'combined', 'all-plants', 'route'], `GET returned: ${JSON.stringify(res)}`);

    if (!res) {
      return NextResponse.json({
        success: false,
        message: `No plants found`,
      });
    }

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['api', 'wiki', 'combined', 'all-plants', 'route'], `GET failed with: ${errorMessage}`);
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
