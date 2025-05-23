import { NextRequest, NextResponse } from 'next/server';
import { BackendRegister } from '@/lib/auth-utils';
import { Log } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    Log(['auth', 'register', 'route'], `POST called with: email-${email}; pass-${password}`);
    const res = await BackendRegister(email, password);
    Log(['auth', 'register', 'route'], `POST returned: ${JSON.stringify(res)}`);

    return NextResponse.json(res);
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'register', 'route'], `POST failed with: ${errorMessage}`);
    return NextResponse.json({ success: false, message: `Internal Server Error` });
  }
}
