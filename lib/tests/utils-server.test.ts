// Mock dependencies
jest.mock("next/headers", () => {
    const mockCookies = {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn()
    };
    return {
        cookies: jest.fn().mockReturnValue(mockCookies)
    };
});

jest.mock("@/lib/logger", () => ({
    Log: jest.fn()
}));

jest.mock("@/lib/auth-utils", () => ({
    BackendVerifyToken: jest.fn()
}));

import { DecodeTokenContent } from "../utils-server";
import { cookies } from "next/headers";
import { Log } from "@/lib/logger";
import { BackendVerifyToken } from "@/lib/auth-utils";

describe("DecodeTokenContent", () => {
    let mockCookies: { get: jest.Mock; set: jest.Mock; delete: jest.Mock };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "test-secret";
        process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
        mockCookies = cookies() as any;
    });

    it("returns success and data when both tokens are present and valid", async () => {
        mockCookies.get.mockImplementation((name: string) => {
            if (name === "accessToken") { return { value: "access-token" }; }
            if (name === "refreshToken") { return { value: "refresh-token" }; }
            return undefined;
        });
        (BackendVerifyToken as jest.Mock)
            .mockResolvedValueOnce([true, { payload: { userId: "user-123" } }]) // access
            .mockResolvedValueOnce([true, { payload: { userId: "user-123" } }]); // refresh

        const result = await DecodeTokenContent();
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.userId).toBe("user-123");
        expect(result.data?.accessToken).toBe("access-token");
        expect(result.data?.refreshToken).toBe("refresh-token");
        expect(result.data?.validAccessToken).toBe(true);
        expect(result.data?.validRefreshToken).toBe(true);
        expect(result.data?.decodedAccess).toEqual({ userId: "user-123" });
        expect(result.data?.decodedRefresh).toEqual({ userId: "user-123" });
    });

    it("returns success false if both tokens are missing", async () => {
        mockCookies.get.mockReturnValue(undefined);
        const result = await DecodeTokenContent();
        expect(result.success).toBe(false);
        expect(result.message).toBe("No access or refresh token found");
    });

    it("returns success false if no userId is found in tokens", async () => {
        mockCookies.get.mockImplementation((name: string) => {
            if (name === "accessToken") { return { value: "access-token" }; }
            if (name === "refreshToken") { return { value: "refresh-token" }; }
            return undefined;
        });
        (BackendVerifyToken as jest.Mock)
            .mockResolvedValueOnce([true, { payload: {} }]) // access
            .mockResolvedValueOnce([true, { payload: {} }]); // refresh
        const result = await DecodeTokenContent();
        expect(result.success).toBe(false);
        expect(result.message).toBe("No user id found");
    });

    it("returns success true and logs error if exception is thrown", async () => {
        mockCookies.get.mockImplementation(() => { throw new Error("fail!"); });
        const result = await DecodeTokenContent();
        expect(result.success).toBe(true);
        expect(result.data).toBeUndefined();
        expect(Log).toHaveBeenCalledWith(["auth", "logout", "frontend"], expect.stringContaining("DecodeTokenContent failed with: fail!"));
    });

    it("returns userId from refresh token if access token is invalid", async () => {
        mockCookies.get.mockImplementation((name: string) => {
            if (name === "accessToken") { return { value: "access-token" }; }
            if (name === "refreshToken") { return { value: "refresh-token" }; }
            return undefined;
        });
        (BackendVerifyToken as jest.Mock)
            .mockResolvedValueOnce([false, false]) // access
            .mockResolvedValueOnce([true, { payload: { userId: "user-456" } }]); // refresh
        const result = await DecodeTokenContent();
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.userId).toBe("user-456");
        expect(result.data?.validAccessToken).toBe(false);
        expect(result.data?.validRefreshToken).toBe(true);
        expect(result.data?.decodedAccess).toBeNull();
        expect(result.data?.decodedRefresh).toEqual({ userId: "user-456" });
    });

    it("decodes only access token when target='access'", async () => {
        mockCookies.get.mockImplementation((name: string) => {
            if (name === "accessToken") { return { value: "access-token" }; }
            if (name === "refreshToken") { return { value: "refresh-token" }; }
            return undefined;
        });
        (BackendVerifyToken as jest.Mock)
            .mockResolvedValueOnce([true, { payload: { userId: "only-access" } }]); // access only

        const result = await DecodeTokenContent('access');
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.userId).toBe("only-access");
        expect(result.data?.validAccessToken).toBe(true);
        // refresh was not verified, placeholder resolves to false
        expect(result.data?.validRefreshToken).toBe(false);
        expect(result.data?.decodedAccess).toEqual({ userId: "only-access" });
        expect(result.data?.decodedRefresh).toBeNull();
        expect(BackendVerifyToken).toHaveBeenCalledTimes(1);
    });

    it("decodes only refresh token when target='refresh'", async () => {
        mockCookies.get.mockImplementation((name: string) => {
            if (name === "accessToken") { return { value: "access-token" }; }
            if (name === "refreshToken") { return { value: "refresh-token" }; }
            return undefined;
        });
        (BackendVerifyToken as jest.Mock)
            .mockResolvedValueOnce([true, { payload: { userId: "only-refresh" } }]); // refresh only

        const result = await DecodeTokenContent('refresh');
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.userId).toBe("only-refresh");
        expect(result.data?.validRefreshToken).toBe(true);
        expect(result.data?.validAccessToken).toBe(false);
        expect(result.data?.decodedRefresh).toEqual({ userId: "only-refresh" });
        expect(result.data?.decodedAccess).toBeNull();
        expect(BackendVerifyToken).toHaveBeenCalledTimes(1);
    });

    it("returns failure when requested access token is missing", async () => {
        mockCookies.get.mockImplementation((name: string) => {
            if (name === "refreshToken") { return { value: "refresh-token" }; }
            return undefined;
        });
        const result = await DecodeTokenContent('access');
        expect(result.success).toBe(false);
        expect(result.message).toBe('No access token found');
    });

    it("returns failure when requested refresh token is missing", async () => {
        mockCookies.get.mockImplementation((name: string) => {
            if (name === "accessToken") { return { value: "access-token" }; }
            return undefined;
        });
        const result = await DecodeTokenContent('refresh');
        expect(result.success).toBe(false);
        expect(result.message).toBe('No refresh token found');
    });
});