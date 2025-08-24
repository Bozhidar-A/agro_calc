import { NextRequest, NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { GetCombinedInputData } from '@/prisma/prisma-utils';

export async function GET(req: NextRequest) {
  try {
    Log(['calc', 'combined', 'input', 'fetch'], `GET called`);
    const res = await GetCombinedInputData();
    Log(
      ['calc', 'combined', 'input', 'fetch'],
      `GET returned count: ${JSON.stringify(res.length)}`
    );

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['calc', 'combined', 'input', 'fetch'], `GET failed with: ${errorMessage}`);
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
