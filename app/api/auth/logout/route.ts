import { NextResponse } from 'next/server';
import { BackendLogout } from '@/lib/auth-utils';
import { Log } from '@/lib/logger';

export async function GET() {
  try {
    Log(['auth', 'logout', 'route'], `GET called`);
    const res = await BackendLogout();
    Log(['auth', 'logout', 'route'], `GET returned: ${JSON.stringify(res)}`);

    return NextResponse.json(res);
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'logout', 'route'], `GET failed with: ${errorMessage}`);
    return NextResponse.json({ success: true });
  }
}
