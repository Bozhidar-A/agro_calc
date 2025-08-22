// Mock all dependencies
jest.mock("@/lib/utils-server", () => ({
    DecodeTokenContent: jest.fn()
}))

jest.mock('@/lib/logger', () => ({
    Log: jest.fn()
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn()
}));

jest.mock('jose', () => ({
    SignJWT: jest.fn().mockImplementation(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        sign: jest.fn().mockResolvedValue('mock-token')
    })),
    jwtVerify: jest.fn()
}));

// Mock Prisma functions
jest.mock('@/prisma/prisma-utils', () => ({
    FindUserByEmail: jest.fn(),
    CreateNewUser: jest.fn(),
    DeleteAllRefreshTokensByUserId: jest.fn(),
    InsertRefreshTokenByUserId: jest.fn(),
    FindRefreshToken: jest.fn(),
    CreateResetPassword: jest.fn(),
    FindResetPasswordByToken: jest.fn(),
    DeleteResetPasswordByEmail: jest.fn(),
    AttachCredentialsToUser: jest.fn()
}));

// Mock next/headers
jest.mock('next/headers', () => {
    const mockCookies = {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn()
    };
    return {
        cookies: jest.fn().mockReturnValue(mockCookies)
    };
});

import { BackendLogin, BackendRegister, BackendLogout, BackendPasswordResetRequest, HandleOAuthLogin } from '@/lib/auth-utils';
import { DecodeTokenContent } from '@/lib/utils-server'
import { hash, compare } from 'bcryptjs';
import * as prismaUtils from '@/prisma/prisma-utils';
import { cookies } from 'next/headers';

describe('Auth Utils', () => {
    let mockCookies: { get: jest.Mock; set: jest.Mock; delete: jest.Mock };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
        process.env.SALT_ROUNDS = '10';
        mockCookies = cookies() as any;

        // Mock TextEncoder
        global.TextEncoder = jest.fn().mockImplementation(() => ({
            encode: jest.fn().mockReturnValue(new Uint8Array())
        }));
    });

    describe('BackendRegister', () => {
        it('should register a new user successfully', async () => {
            (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(null);
            (prismaUtils.CreateNewUser as jest.Mock).mockResolvedValue({ id: '123', email: 'test@test.com' });
            (hash as jest.Mock).mockResolvedValue('hashed-password');

            const result = await BackendRegister('test@test.com', 'Test123!');

            expect(result.success).toBe(true);
            expect(prismaUtils.CreateNewUser).toHaveBeenCalledWith('test@test.com', 'Test123!');
        });

        it('should reject invalid email format', async () => {
            const result = await BackendRegister('invalid-email', 'Test123!');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid email');
        });

        it('should reject weak password', async () => {
            const result = await BackendRegister('test@test.com', 'weak');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Password too short');
        });
    });

    describe('BackendLogin', () => {

        it('should login a new user successfully', async () => {
            const mockUser = {
                id: '123',
                email: 'test@test.com',
                password: 'hashed-password'
            };
            (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (compare as jest.Mock).mockResolvedValue(true);
            (prismaUtils.DeleteAllRefreshTokensByUserId as jest.Mock).mockResolvedValue({ count: 1 });
            (prismaUtils.InsertRefreshTokenByUserId as jest.Mock).mockResolvedValue({ id: 'token-123' });

            const result = await BackendLogin('test@test.com', 'Test123!', 'test-ua');

            expect(result.success).toBe(true);
            expect(result.user).toEqual({
                id: '123',
                email: 'test@test.com'
            });
            expect(prismaUtils.FindUserByEmail).toHaveBeenCalledWith('test@test.com');
            expect(compare).toHaveBeenCalledWith('Test123!', 'hashed-password');
            expect(mockCookies.set).toHaveBeenCalledTimes(3);
        });

        it('should reject invalid credentials', async () => {
            (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(null);
            const result = await BackendLogin('test@test.com', 'wrong-password', 'test-ua');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid email or password');
        });

        it('should reject invalid password', async () => {
            const mockUser = {
                id: '123',
                email: 'test@test.com',
                password: 'hashed-password'
            };
            (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (compare as jest.Mock).mockResolvedValue(false);
            const result = await BackendLogin('test@test.com', 'wrong-password', 'test-ua');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid email or password');
        });
    });

    describe('BackendLogout', () => {
        const OLD_ENV = process.env;

        beforeEach(() => {
            jest.resetModules();
            process.env = { ...OLD_ENV, NEXT_RUNTIME: 'nodejs' };
            (DecodeTokenContent as jest.Mock).mockReset();
        });

        afterEach(() => {
            process.env = OLD_ENV;
        });

        it('should delete refresh tokens and return success when refresh token is present', async () => {
            (DecodeTokenContent as jest.Mock).mockResolvedValue({
                success: true,
                data: {
                    accessToken: undefined,
                    validAccessToken: null,
                    decodedAccessToken: null,
                    refreshToken: 'refresh-token',
                    validRefreshToken: true,
                    decodedRefreshToken: null,
                    userId: 'user-123'
                }
            });
            (prismaUtils.DeleteAllRefreshTokensByUserId as jest.Mock).mockResolvedValue({ count: 1 });

            const result = await BackendLogout();

            expect(prismaUtils.DeleteAllRefreshTokensByUserId).toHaveBeenCalledWith('user-123');
            expect(result).toEqual({ success: true });
        });

        it('should log and return success when no refresh token is present', async () => {
            (DecodeTokenContent as jest.Mock).mockResolvedValue({
                success: false,
                data: {
                    accessToken: undefined,
                    validAccessToken: null,
                    decodedAccessToken: null,
                    refreshToken: undefined,
                    validRefreshToken: false,
                    decodedRefreshToken: null,
                    userId: 'user-123'
                }
            });
            const result = await BackendLogout();
            expect(prismaUtils.DeleteAllRefreshTokensByUserId).not.toHaveBeenCalled();
            expect(result).toEqual({ success: true });
        });

        it('should return success even if DecodeTokenContent fails', async () => {
            (DecodeTokenContent as jest.Mock).mockImplementation(async () => { throw new Error('fail'); });
            const result = await BackendLogout();
            expect(result).toEqual({ success: true, message: "fail" });
        });
    });

    describe('BackendPasswordResetRequest', () => {
        it('should handle non-existent user', async () => {
            (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(null);
            const result = await BackendPasswordResetRequest('nonexistent@test.com');
            expect(result.success).toBe(false);
            expect(result.message).toBe('User not found');
        });
        describe('HandleOAuthLogin', () => {
            const provider = 'github';
            const providerId = 'gh-123';
            const email = 'test@test.com';
            const refreshTokenUserInfo = 'ua-info';
            const userObj = { id: 'u1', email };

            let findUserByProviderId: jest.Mock;
            let attachProviderIdToUser: jest.Mock;
            let createUserWithProvider: jest.Mock;

            beforeEach(() => {
                findUserByProviderId = jest.fn();
                attachProviderIdToUser = jest.fn();
                createUserWithProvider = jest.fn();
                (prismaUtils.FindUserByEmail as jest.Mock).mockReset();
                (prismaUtils.InsertRefreshTokenByUserId as jest.Mock).mockResolvedValue({});
            });

            it('creates new user if not found by providerId or email', async () => {
                findUserByProviderId.mockResolvedValue(null);
                (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(null);
                createUserWithProvider.mockResolvedValue(userObj);

                const result = await HandleOAuthLogin({
                    provider,
                    providerId,
                    email,
                    findUserByProviderId,
                    attachProviderIdToUser,
                    createUserWithProvider,
                    refreshTokenUserInfo
                });
                expect(createUserWithProvider).toHaveBeenCalledWith(providerId, email);
                expect(result.user).toEqual(userObj);
                expect(result.accessToken).toBeDefined();
                expect(result.refreshToken).toBeDefined();
            });

            it('attaches providerId to existing user found by email', async () => {
                findUserByProviderId.mockResolvedValue(null);
                (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(userObj);
                attachProviderIdToUser.mockResolvedValue(undefined);

                const result = await HandleOAuthLogin({
                    provider,
                    providerId,
                    email,
                    findUserByProviderId,
                    attachProviderIdToUser,
                    createUserWithProvider,
                    refreshTokenUserInfo
                });
                expect(attachProviderIdToUser).toHaveBeenCalledWith(userObj.id, providerId);
                expect(result.user).toEqual(userObj);
            });

            it('returns user found by providerId', async () => {
                findUserByProviderId.mockResolvedValue(userObj);

                const result = await HandleOAuthLogin({
                    provider,
                    providerId,
                    email,
                    findUserByProviderId,
                    attachProviderIdToUser,
                    createUserWithProvider,
                    refreshTokenUserInfo
                });
                expect(result.user).toEqual(userObj);
                expect(createUserWithProvider).not.toHaveBeenCalled();
                expect(attachProviderIdToUser).not.toHaveBeenCalled();
            });

            it('returns tokens and user info', async () => {
                findUserByProviderId.mockResolvedValue(userObj);

                const result = await HandleOAuthLogin({
                    provider,
                    providerId,
                    email,
                    findUserByProviderId,
                    attachProviderIdToUser,
                    createUserWithProvider,
                    refreshTokenUserInfo
                });
                expect(typeof result.accessToken).toBe('string');
                expect(typeof result.refreshToken).toBe('string');
                expect(result.user).toEqual(userObj);
            });
        });
    });
}); 