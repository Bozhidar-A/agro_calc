import { APICaller } from '@/lib/api-util';
import { Log } from '@/lib/logger';

jest.unmock('@/lib/api-util');

// Mock fetch at module level
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the Log function
jest.mock('@/lib/logger', () => ({
  Log: jest.fn(),
}));

describe('APICaller', () => {
  const { GetClientConsent } = require('@/hooks/useConsent');
  const { TryGetUserLocation } = require('@/lib/geo-utils');

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should set cache to no-store if opts.noCache is true', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await APICaller(['test'], '/api/test', 'GET', undefined, { noCache: true });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      cache: 'no-store',
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it('should include location headers if consent is true and location is available', async () => {
    GetClientConsent.mockReturnValue({ necessary: true, preferences: false, location: true });
    TryGetUserLocation.mockResolvedValue({ lat: 10, lon: 20 });
    const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await APICaller(['test'], '/api/test', 'POST', {}, { includeLocation: true });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      headers: expect.objectContaining({
        'x-user-lat': '10',
        'x-user-lon': '20',
      }),
    }));
  });

  it('should NOT include location headers if consent is false', async () => {
    GetClientConsent.mockReturnValue({ necessary: true, preferences: false, location: false });
    TryGetUserLocation.mockResolvedValue({ lat: 10, lon: 20 });
    const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await APICaller(['test'], '/api/test', 'POST', {}, { includeLocation: true });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.not.objectContaining({
      headers: expect.objectContaining({
        'x-user-lat': '10',
        'x-user-lon': '20',
      }),
    }));
  });

  it('should NOT include location headers if TryGetUserLocation returns null', async () => {
    GetClientConsent.mockReturnValue({ necessary: true, preferences: false, location: true });
    TryGetUserLocation.mockResolvedValue(null);
    const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await APICaller(['test'], '/api/test', 'POST', {}, { includeLocation: true });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.not.objectContaining({
      headers: expect.objectContaining({
        'x-user-lat': expect.any(String),
        'x-user-lon': expect.any(String),
      }),
    }));
  });

  it('should make a successful GET request', async () => {
    const mockResponse = { data: 'test data' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await APICaller(['test'], '/api/test', 'GET');

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      cache: 'default',
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
      cache: 'default',
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
      cache: 'default',
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
