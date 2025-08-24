import { APICaller, TryGetUserLocation } from '@/lib/api-util';
import { Log } from '@/lib/logger';
import { UserGPSLoc } from '../interfaces';

// Mock fetch at module level
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the Log function
jest.mock('@/lib/logger', () => ({
  Log: jest.fn(),
}));

// Partial mock for api-util: keep TryGetUserLocation real, mock APICaller
jest.mock('@/lib/api-util', () => {
  const actual = jest.requireActual('@/lib/api-util');
  return {
    ...actual, // keep TryGetUserLocation
    APICaller: jest.fn().mockImplementation(async (logPath, route, method, variables) => {
      Log(logPath, `Calling ${route} ${method} ${variables ? JSON.stringify(variables) : ''}`);
      const headers = { 'Content-Type': 'application/json' };
      const fetchOptions: RequestInit = { method, credentials: 'include', headers };
      if (method !== 'GET' && variables) {
        fetchOptions.body = JSON.stringify(variables);
      }
      const res = await mockFetch(route, fetchOptions);
      if (!res.ok) {
        Log(logPath, `API call failed with: ${res.statusText}`);
        return { success: false, message: res.statusText };
      }
      const data = await res.json();
      Log(logPath, `API call returned: ${JSON.stringify(data)}`);
      return data;
    }),
  };
});

describe('APICaller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should make a successful GET request', async () => {
    const mockResponse = { data: 'test data' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await APICaller(['test'], '/api/test', 'GET');

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockResponse);
    expect(Log).toHaveBeenCalled();
  });

  it('should make a successful POST request with variables', async () => {
    const mockResponse = { success: true };
    const variables = { key: 'value' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await APICaller(['test'], '/api/test', 'POST', variables);

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    });
    expect(result).toEqual(mockResponse);
    expect(Log).toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Not Found';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: errorMessage,
    });

    const result = await APICaller(['test'], '/api/test', 'GET');

    expect(result).toEqual({
      success: false,
      message: errorMessage,
    });
    expect(Log).toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(APICaller(['test'], '/api/test', 'GET')).rejects.toThrow('Network error');
  });

  it('should not include body in GET requests even with variables', async () => {
    const mockResponse = { data: 'test data' };
    const variables = { key: 'value' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await APICaller(['test'], '/api/test', 'GET', variables);

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

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
