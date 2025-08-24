import { NextRequest, NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { DecodeTokenContent } from '@/lib/utils-server';
import { GetSowingHistory, InsertSowingHistoryEntry } from '@/prisma/prisma-utils';

export async function POST(req: NextRequest) {
  try {
    const entry = await req.json();

    Log(['calc', 'sowing', 'history'], `POST called with: ${JSON.stringify(entry)}`);
    const sowingCalcHistoryEntry = await InsertSowingHistoryEntry(entry);
    Log(['calc', 'sowing', 'history'], `POST returned: ${JSON.stringify(sowingCalcHistoryEntry)}`);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['calc', 'sowing', 'history', 'POST'], `POST failed with: ${errorMessage}`);
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}

export async function GET() {
  try {
    Log(['calc', 'sowing', 'history'], `GET called`);
    const decryptedData = await DecodeTokenContent();
    if (!decryptedData.success || !decryptedData.data || !decryptedData.data.userId) {
      Log(
        ['calc', 'sowing', 'history'],
        `GET - DecodeTokenContent failed: ${decryptedData.message}`
      );
      return NextResponse.json({ success: false, message: decryptedData.message });
    }
    const history = await GetSowingHistory(decryptedData.data.userId);
    Log(['calc', 'sowing', 'history'], `GET returned: ${JSON.stringify(history)}`);
    return NextResponse.json({ success: true, data: history });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['calc', 'sowing', 'history', 'GET'], `GET failed with: ${errorMessage}`);
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
