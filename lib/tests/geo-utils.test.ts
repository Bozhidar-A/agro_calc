import * as useConsentModule from '@/hooks/useConsent';
import { TryGetUserLocation } from '@/lib/geo-utils';
import { UserGPSLoc } from '@/lib/interfaces';

jest.unmock('@/lib/geo-utils');

describe('TryGetUserLocation', () => {
  let originalNavigator: Navigator;

  beforeEach(() => {
    originalNavigator = global.navigator;

    // force navigator to be writable
    Object.defineProperty(global, 'navigator', {
      value: {},
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('returns null if geolocation is not available and location consent is false', async () => {
    jest
      .spyOn(useConsentModule, 'GetClientConsent')
      .mockReturnValue({ necessary: true, preferences: false, location: false } as any);
    (global as any).navigator = {};
    const result = await TryGetUserLocation();
    expect(result).toBeNull();
  });

  it('returns null if location consent is false even if geolocation is available', async () => {
    jest
      .spyOn(useConsentModule, 'GetClientConsent')
      .mockReturnValue({ necessary: true, preferences: false, location: false } as any);
    (global as any).navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
      },
    };
    const result = await TryGetUserLocation();
    expect(result).toBeNull();
  });

  it('returns coordinates if geolocation is available, succeeds, and location consent is true', async () => {
    jest
      .spyOn(useConsentModule, 'GetClientConsent')
      .mockReturnValue({ necessary: true, preferences: false, location: true } as any);
    const mockGetCurrentPosition = jest.fn((success: PositionCallback) => {
      setTimeout(() => {
        success({
          coords: {
            latitude: 42,
            longitude: 24,
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      }, 0);
    });

    (global as any).navigator = {
      geolocation: { getCurrentPosition: mockGetCurrentPosition },
    };

    const result = await TryGetUserLocation();
    expect(result).toEqual<UserGPSLoc>({ lat: 42, lon: 24 });
  });

  it('returns null if geolocation fails/denied and location consent is true', async () => {
    jest
      .spyOn(useConsentModule, 'GetClientConsent')
      .mockReturnValue({ necessary: true, preferences: false, location: true } as any);
    const mockGetCurrentPosition = jest.fn(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        setTimeout(() => {
          error(new Error('Permission denied') as any);
        }, 0);
      }
    );

    (global as any).navigator = {
      geolocation: { getCurrentPosition: mockGetCurrentPosition },
    };

    const result = await TryGetUserLocation();
    expect(result).toBeNull();
  });
});
