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
        if (result.data) {
            expect(result.data.userId).toBe("user-123");
            expect(result.data.accessToken).toBe("access-token");
            expect(result.data.refreshToken).toBe("refresh-token");
        } else {
            throw new Error("Expected result.data to be defined");
        }
    });

    it("returns success false if both tokens are missing", async () => {
        mockCookies.get.mockReturnValue(undefined);
        const result = await DecodeTokenContent();
        expect(result.success).toBe(false);
        expect(Log).toHaveBeenCalledWith(["auth", "logout", "frontend"], "No access or refresh token found");
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
        expect(Log).toHaveBeenCalledWith(["auth", "logout", "frontend"], "No user id found");
    });

    it("returns success true and logs error if exception is thrown", async () => {
        mockCookies.get.mockImplementation(() => { throw new Error("fail!"); });
        const result = await DecodeTokenContent();
        expect(result.success).toBe(true);
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
        if (result.data) {
            expect(result.data.userId).toBe("user-456");
        } else {
            throw new Error("Expected result.data to be defined");
        }
    });
});