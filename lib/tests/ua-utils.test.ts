import { NextRequest, NextResponse } from 'next/server';
import type { UserAgentNext } from '../interfaces';
import {
  CreateTempUserLocCookies,
  DeleteTempUserLocationCookies,
  FormatUserAccessInfo,
  FormatUserAgent,
  FromRequestFormatUserAccessInfo,
  ReadTempUserLocationCookies,
  ReadUserLocationFromQueryParams,
  ReverseGeocode,
} from '../ua-utils';

jest.mock('@/lib/api-util');

// jest provides a global `fetch` in this environment via node-fetch or similar; ensure we can mock it
declare const global: any;

describe('ua-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('FormatUserAgent renders a complete string when fields present', () => {
    const ua: UserAgentNext = {
      browser: { name: 'Chrome' },
      device: { vendor: 'Apple', model: 'iPhone', type: 'mobile' },
      engine: { name: 'WebKit' },
      os: { name: 'iOS', version: '16.4' },
      cpu: { architecture: 'arm64' },
    } as any;

    const out = FormatUserAgent(ua);
    expect(out).toContain('Chrome');
    expect(out).toContain('Apple iPhone');
    expect(out).toContain('WebKit');
    expect(out).toContain('iOS 16.4');
    expect(out).toContain('arm64');
  });

  test('FormatUserAgent falls back when missing values', () => {
    const ua: UserAgentNext = {} as any;
    const out = FormatUserAgent(ua);
    // should include several placeholders
    expect(out).toContain('?');
  });

  test('ReverseGeocode returns address on success and null on non-ok or no address', async () => {
    // Success
    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ address: { city: 'TestCity', country: 'TestCountry' } }),
    });
    const addr = await ReverseGeocode(1, 2);
    expect(addr).not.toBeNull();
    expect(addr?.city).toBe('TestCity');

    // Not ok (simulate error)
    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'oops',
    });
    const addr2 = await ReverseGeocode(1, 2);
    expect(addr2).toBeNull();

    // No address
    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    const addr3 = await ReverseGeocode(1, 2);
    expect(addr3).toBeNull();
  });

  test('FormatUserAccessInfo and FromRequestFormatUserAccessInfo use location/UA/OAuth correctly', async () => {
    // Mock ReverseGeocode to avoid network
    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ address: { city: 'C', country: 'X' } }),
    });

    const userAgent: UserAgentNext = { browser: { name: 'B' } } as any;
    const loc = { lat: 1, lon: 2 };

    const fmt = await FormatUserAccessInfo(loc, userAgent, 'github');
    expect(fmt).toContain('C, X');
    expect(fmt).toContain('B');
    expect(fmt).toContain('github');

    // FromRequestFormatUserAccessInfo reads headers x-user-lat/x-user-lon
    const fakeReq: Partial<NextRequest> = {
      headers: new Map() as any,
    } as any;
    // NextRequest headers.get exists; provide a minimal shim
    (fakeReq.headers as any).get = (k: string) =>
      k === 'x-user-lat' ? '1' : k === 'x-user-lon' ? '2' : null;

    // Ensure FormatUserAccessInfo called via FromRequestFormatUserAccessInfo; mock ReverseGeocode again
    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ address: { city: 'C', country: 'X' } }),
    });
    const out = await FromRequestFormatUserAccessInfo(
      fakeReq as NextRequest,
      userAgent as any,
      'git'
    );
    expect(out).toContain('C, X');
    expect(out).toContain('B');
    expect(out).toContain('git');
  });

  test('ReadUserLocationFromQueryParams and temp cookie helpers', () => {
    const url = new URL('https://example.com/?lat=10&lon=20');
    const fakeReq: Partial<NextRequest> = { nextUrl: { searchParams: url.searchParams } } as any;
    const loc = ReadUserLocationFromQueryParams(fakeReq as NextRequest);
    expect(loc).toEqual({ lat: 10, lon: 20 });

    // Temp cookie helpers: NextResponse has cookies.set but we can use a minimal shim backed by a Map
    const map = new Map<string, string>();
    const resp: Partial<NextResponse> = {
      cookies: {
        set: (k: string, v: string) => map.set(k, v),
        get: (k: string) => ({ value: map.get(k) }),
        delete: (k: string) => map.delete(k),
      } as any,
    } as any;

    CreateTempUserLocCookies(resp as NextResponse, '10', '20');
    // set stored in backing Map
    expect((resp.cookies as any).get('temp_user_lat')?.value).toBe('10');

    // For ReadTempUserLocationCookies use a fake NextRequest with cookies.get()
    const req: Partial<NextRequest> = {
      cookies: {
        get: (k: string) => ({
          value: k === 'temp_user_lat' ? '10' : k === 'temp_user_lon' ? '20' : undefined,
        }),
      },
    } as any;
    const tmp = ReadTempUserLocationCookies(req as NextRequest);
    expect(tmp).toEqual({ lat: 10, lon: 20 });

    // DeleteTempUserLocationCookies should call delete -- create shim
    const delReq: any = { cookies: { delete: jest.fn() } };
    DeleteTempUserLocationCookies(delReq as NextRequest);
    expect(delReq.cookies.delete).toHaveBeenCalledWith('temp_user_lat');
    expect(delReq.cookies.delete).toHaveBeenCalledWith('temp_user_lon');
  });
});
