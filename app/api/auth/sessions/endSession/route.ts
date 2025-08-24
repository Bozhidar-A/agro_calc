import { NextRequest, NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { DecodeTokenContent } from '@/lib/utils-server';
import { DeleteRefreshTokenById } from '@/prisma/prisma-utils';

export async function POST(req: NextRequest) {
  try {
    const { tokenId } = await req.json();
    Log(['auth', 'sessions', 'endSession'], `POST received - tokenId: ${tokenId}`);

    const decodedData = await DecodeTokenContent();

    if (!decodedData || !decodedData.success) {
      Log(['auth', 'sessions', 'endSession'], `POST failed: decodedData is null`);
      return NextResponse.json({ success: false, message: 'Invalid token data' });
    }
    const res = await DeleteRefreshTokenById(tokenId);
    Log(['auth', 'sessions', 'endSession'], `POST returned: ${JSON.stringify(res)}`);

    return NextResponse.json({ success: true, data: res });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'sessions', 'endSession'], `POST failed with: ${errorMessage}`);
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
