import { BackendLogin, BackendRegister, BackendLogout, BackendPasswordResetRequest } from '@/lib/auth-utils';
import { hash } from 'bcryptjs';
import * as prismaUtils from '@/prisma/prisma-utils';
import { cookies } from 'next/headers';

// Mock all dependencies
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

describe('Auth Utils', () => {
    let mockCookies: { get: jest.Mock; set: jest.Mock; delete: jest.Mock };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
        process.env.SALT_ROUNDS = '10';
        mockCookies = cookies() as any;
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
        it('should reject invalid credentials', async () => {
            (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(null);

            const result = await BackendLogin('test@test.com', 'wrong-password');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid email or password');
        });
    });

    describe('BackendLogout', () => {
        it('should logout successfully', async () => {
            mockCookies.get.mockReturnValue({ value: 'refresh-token' });
            (prismaUtils.DeleteAllRefreshTokensByUserId as jest.Mock).mockResolvedValue({ count: 1 });

            const result = await BackendLogout('123');

            expect(result.success).toBe(true);
            expect(mockCookies.delete).toHaveBeenCalledTimes(3);
        });
    });

    describe('BackendPasswordResetRequest', () => {
        it('should handle non-existent user', async () => {
            (prismaUtils.FindUserByEmail as jest.Mock).mockResolvedValue(null);

            const result = await BackendPasswordResetRequest('nonexistent@test.com');

            expect(result.success).toBe(false);
            expect(result.message).toBe('User not found');
        });
    });
}); 