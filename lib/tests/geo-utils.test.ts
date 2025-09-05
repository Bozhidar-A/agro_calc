import { TryGetUserLocation } from "@/lib/geo-utils";
import { UserGPSLoc } from "@/lib/interfaces";

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

    it('returns null if geolocation is not available', async () => {
        (global as any).navigator = {};
        const result = await TryGetUserLocation();
        expect(result).toBeNull();
    });

    it('returns coordinates if geolocation is available and succeeds', async () => {
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

    it('returns null if geolocation fails/denied', async () => {
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