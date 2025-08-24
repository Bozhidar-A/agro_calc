import { NextRequest, NextResponse } from 'next/server';
import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '@/lib/oauth-utils';
import { CreateTempUserLocCookies } from '@/lib/ua-utils';

export async function GET(req: NextRequest) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email']);
  const res = NextResponse.redirect(url.toString());

  res.cookies.set('google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });
  res.cookies.set('google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });

  //OAuth location transfer
  const reqURL = new URL(req.url);
  const lat = reqURL.searchParams.get('lat') ?? '0';
  const lon = reqURL.searchParams.get('lon') ?? '0';
  CreateTempUserLocCookies(res, lat, lon);

  return res;
}
