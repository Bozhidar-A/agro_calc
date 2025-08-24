import { NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { GetSowingInputData } from '@/prisma/prisma-utils';

export async function GET() {
  try {
    Log(['calc', 'sowing', 'input', 'fetch'], `GET called`);
    const res = await GetSowingInputData();
    Log(['calc', 'sowing', 'input', 'fetch'], `GET returned count: ${JSON.stringify(res.length)}`);

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['calc', 'sowing', 'input', 'fetch'], `GET failed with: ${errorMessage}`);
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
