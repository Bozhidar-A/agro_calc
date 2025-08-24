import { NextRequest, NextResponse } from 'next/server';
import { Log } from '@/lib/logger';
import { FindUserSettingsByUserId, UpdateUserSettings } from '@/prisma/prisma-utils';

export async function GET(request: NextRequest) {
  try {
    Log(['api', 'user', 'settings', 'get'], 'GET request received');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      Log(['api', 'user', 'settings', 'get'], 'User ID is required');
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const userSettings = await FindUserSettingsByUserId(userId);

    if (!userSettings) {
      Log(['api', 'user', 'settings', 'get'], 'User settings not found');
      return NextResponse.json(
        { success: false, error: 'User settings not found' },
        { status: 404 }
      );
    }

    Log(['api', 'user', 'settings', 'get'], 'User settings found');
    return NextResponse.json({ success: true, userSettings }, { status: 200 });
  } catch {
    Log(['api', 'user', 'settings', 'get'], 'Error getting user settings');
  }
}

export async function POST(request: NextRequest) {
  try {
    Log(['api', 'user', 'settings', 'post'], 'POST request received');
    const body = await request.json();
    const { userId, theme, language, prefUnitOfMeasurement } = body;

    if (!userId) {
      Log(['api', 'user', 'settings', 'post'], 'User ID is required');
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const userSettings = await UpdateUserSettings(userId, theme, language, prefUnitOfMeasurement);

    if (!userSettings) {
      Log(['api', 'user', 'settings', 'post'], 'User settings not found');
      return NextResponse.json(
        { success: false, error: 'User settings not found' },
        { status: 404 }
      );
    }

    Log(['api', 'user', 'settings', 'post'], 'User settings updated');
    return NextResponse.json({ success: true, userSettings }, { status: 200 });
  } catch {
    Log(['api', 'user', 'settings', 'post'], 'Error updating user settings');
    return NextResponse.json(
      { success: false, error: 'Error updating user settings' },
      { status: 500 }
    );
  }
}
