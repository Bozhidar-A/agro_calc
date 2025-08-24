'use server';

import { cookies } from 'next/headers';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { HandleOAuthLoginArgs, HandleOAuthLoginResult } from '@/lib/interfaces';
import { Log } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { DecodeTokenContent } from '@/lib/utils-server';
import {
  AttachCredentialsToUser,
  CreateNewUser,
  CreateResetPassword,
  DeleteAllRefreshTokensByUserId,
  DeleteResetPasswordByEmail,
  FindRefreshToken,
  FindResetPasswordByToken,
  FindUserByEmail,
  InsertRefreshTokenByUserId,
} from '@/prisma/prisma-utils';

export async function BackendVerifyToken(secret: string, token: string | undefined, type: string) {
  try {
    if (!token) {
      return [false, null];
    }

    // Verify refresh token
    const decoded = await jwtVerify(token, new TextEncoder().encode(secret));

    if (decoded?.payload?.type !== type) {
      Log(['auth', 'verifyToken'], `Invalid token type: ${decoded?.payload?.type}`);
      return [false, null];
    }

    //also check if it exists in the db
    if (type === 'refresh') {
      Log(['auth', 'verifyToken'], `Checking refresh token in db: ${token}`);

      //VERY UGLY HACK
      //AWFUL
      //baiscally you cant use pg? functions in the edge runtime that middleware runs in [1]
      //or soemthing else is missing
      //so we have to do this
      //[1] https://github.com/prisma/prisma/issues/24430#issuecomment-2153025329
      if (process.env.NEXT_RUNTIME === 'nodejs') {
        const foundRefreshToken = await FindRefreshToken(token);

        if (!foundRefreshToken) {
          Log(['auth', 'verifyToken'], `Refresh token not found in db: ${token}`);
          return [false, null];
        }
      }
    }

    Log(['auth', 'verifyToken'], `Token verified: ${token}`);
    return [true, decoded];
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'verifyToken'], `BackendVerifyToken failed with: ${errorMessage}`);
    return [false, null];
  }
}

export async function BackendRegister(email: string, password: string) {
  try {
    //check if the user already exists
    const user = await FindUserByEmail(email);
    const userExists = !!user;
    const userIsOAuth = !!(user?.googleId || user?.githubId);

    //if the user exists and is not a google or github user, return already exists
    if (userExists && !userIsOAuth) {
      Log(['auth', 'register'], `User already exists: ${email}`);
      return { success: false, message: 'User already exists' };
    }

    //force checks the format text@text.text
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Log(['auth', 'register'], `Invalid email: ${email}`);
      return { success: false, message: 'Invalid email' };
    }

    //force checks the password according to the frontend zod schema
    // password: z
    //       .string()
    //       .min(6, 'Password is too short')
    //       .regex(/[a-z]/, 'Password must contain a lowercase letter')
    //       .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    //       .regex(/[0-9]/, 'Password must contain a number'),
    //        .regex(/[$-/:-?{-~!"^_`\[\]]/, 'Password must contain at least one special character'),
    if (password.length < 6) {
      Log(['auth', 'register'], `Password too short: ${email}`);
      return { success: false, message: 'Password too short' };
    }
    if (!/[a-z]/.test(password)) {
      Log(['auth', 'register'], `Password must contain a lowercase letter: ${email}`);
      return { success: false, message: 'Password must contain a lowercase letter' };
    }
    if (!/[A-Z]/.test(password)) {
      Log(['auth', 'register'], `Password must contain an uppercase letter: ${email}`);
      return { success: false, message: 'Password must contain an uppercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      Log(['auth', 'register'], `Password must contain a number: ${email}`);
      return { success: false, message: 'Password must contain a number' };
    }
    if (!/[$-/:-?{-~!"^_`\\[\]]/.test(password)) {
      Log(['auth', 'register'], `Password must contain a special character: ${email}`);
      return { success: false, message: 'Password must contain a special character' };
    }

    //create the user
    let newUser;
    if (userExists && userIsOAuth) {
      newUser = await AttachCredentialsToUser(user.id, email, password);
    } else {
      newUser = await CreateNewUser(email, password);
    }

    Log(['auth', 'register'], `Created new user: ${newUser.id}`);

    return {
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'register'], `BackendRegister failed with: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

export async function BackendLogin(email: string, password: string, refreshTokenUserInfo: string) {
  try {
    const cookieStore = await cookies();

    //find the user
    const user = await FindUserByEmail(email);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    //compare passwords
    if (!user.password || !(await compare(password, user.password))) {
      Log(['auth', 'login'], `Invalid password for user ${user.id}`);
      return { success: false, message: 'Invalid email or password' };
    }

    //delete all old refresh tokens
    //just in case
    const deletedTokensCount = await DeleteAllRefreshTokensByUserId(user.id);
    Log(
      ['auth', 'login'],
      `Deleted ${deletedTokensCount?.count} old refresh tokens for user ${user.id}`
    );

    // Generate refresh token (long-lived)
    const refreshToken = await new SignJWT({ userId: user.id, type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));

    Log(['auth', 'login'], `refreshToken: ${refreshToken} for user ${user.id}`);

    //insert new refresh token
    const insertedToken = await InsertRefreshTokenByUserId(
      refreshToken,
      user.id,
      refreshTokenUserInfo
    );

    Log(['auth', 'login'], `Inserted new refresh token ${insertedToken.id} for user ${user.id}`);

    const accessToken = await new SignJWT({
      userId: user.id,
      type: 'access',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    Log(['auth', 'login'], `accessToken: ${accessToken}`);

    // Set cookies
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 900, // 15 minutes
      path: '/',
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      // path: '/auth/refresh'
      // apperently it is bad paractice to set to /
      // will do for dev
      //TODO: figure out and fix
      path: '/',
    });

    cookieStore.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    Log(['auth', 'login'], `Logged in user ${user.id}`);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'login'], `BackendLogin failed with: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

//generic OAuth login handler
export async function HandleOAuthLogin({
  provider,
  providerId,
  email,
  findUserByProviderId,
  attachProviderIdToUser,
  createUserWithProvider,
  refreshTokenUserInfo,
}: HandleOAuthLoginArgs): Promise<HandleOAuthLoginResult> {
  Log(
    ['auth', 'oauth', provider, 'login'],
    `Starting OAuth login for provider: ${provider}, providerId: ${providerId}, email: ${email}`
  );
  let user = await findUserByProviderId(providerId);
  if (!user) {
    Log(
      ['auth', 'oauth', provider, 'login'],
      `No user found by providerId. Looking up by email: ${email}`
    );
    const existingUser = await FindUserByEmail(email);
    if (existingUser) {
      Log(
        ['auth', 'oauth', provider, 'login'],
        `Existing user found by email. Attaching providerId to user: ${existingUser.id}`
      );
      await attachProviderIdToUser(existingUser.id, providerId);
      user = existingUser;
    } else {
      Log(
        ['auth', 'oauth', provider, 'login'],
        `No user found by email. Creating new user with providerId: ${providerId}`
      );
      user = await createUserWithProvider(providerId, email);
      Log(['auth', 'oauth', provider, 'login'], `Created new user: ${user.id}`);
    }
  } else {
    Log(['auth', 'oauth', provider, 'login'], `User found by providerId: ${user.id}`);
  }

  // Generate tokens
  const encoder = new TextEncoder();
  const accessToken = await new SignJWT({ userId: user.id, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(encoder.encode(process.env.JWT_SECRET!));

  Log(['auth', 'oauth', provider, 'login'], `Generated access token for user: ${user.id}`);

  const refreshToken = await new SignJWT({ userId: user.id, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(encoder.encode(process.env.JWT_REFRESH_SECRET!));

  Log(['auth', 'oauth', provider, 'login'], `Generated refresh token for user: ${user.id}`);

  await InsertRefreshTokenByUserId(refreshToken, user.id, refreshTokenUserInfo);
  Log(['auth', 'oauth', provider, 'login'], `Inserted refresh token for user: ${user.id}`);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
}

//no matter what, we should be able to logout
export async function BackendLogout() {
  try {
    const cookieStore = await cookies();
    const decodedData = await DecodeTokenContent('refresh');

    //nuke cookies
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userId');

    if (!decodedData.success) {
      Log(['auth', 'logout', 'frontend'], 'No access or refresh token found');
      return { success: true };
    }

    if (decodedData.data?.refreshToken && decodedData.data?.validRefreshToken) {
      //ugly hack 2
      if (process.env.NEXT_RUNTIME === 'nodejs') {
        //delete all refresh tokens
        const deletedTokensCount = await DeleteAllRefreshTokensByUserId(decodedData.data.userId);

        Log(
          ['auth', 'logout', 'backend'],
          `Deleted ${deletedTokensCount?.count} old refresh tokens for user ${decodedData.data.userId}`
        );
      }
    } else {
      // No refresh token found
      //VERY wierd and bad
      //should never happen
      //still log em out
      //an internal error/state desync error should not cause an sao incident
      //its also bloody stupid
      Log(['auth', 'logout', 'backend'], 'No refresh token found');
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'logout', 'backend'], `BackendLogout failed with: ${errorMessage}`);
    return { success: true, message: errorMessage };
  }
}

export async function BackendRefreshAccessToken(refreshToken: string) {
  const cookieStore = await cookies();

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const [validToken, decoded] = await BackendVerifyToken(
    process.env.JWT_REFRESH_SECRET || '',
    refreshToken,
    'refresh'
  );

  if (
    !validToken ||
    typeof decoded !== 'object' ||
    !(decoded && 'payload' in decoded) ||
    !decoded.payload?.userId
  ) {
    throw new Error('Invalid refresh token');
  }

  // Generate new access token
  const newAccessToken = await new SignJWT({ userId: decoded.payload.userId, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // Set new access token cookie
  cookieStore.set('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 900, // 15 minutes
  });
}

export async function HashPassword(password: string) {
  return await hash(password, parseInt(process.env.SALT_ROUNDS!, 10));
}

export async function BackendUpdateUserPassword(user: User, password: string) {
  try {
    const hashedPassword = await HashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'updateUserPassword'], `BackendUpdateUserPassword failed with: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}

export async function BackendPasswordResetRequest(email: string) {
  try {
    const user = await FindUserByEmail(email);

    if (!user) {
      Log(['auth', 'passwordReset', 'request'], `User not found: ${email}`);
      return { success: false, message: 'User not found' };
    }

    const resetToken = await new SignJWT({ userEmail: user.email, userId: user.id, type: 'reset' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    Log(['auth', 'passwordReset', 'request'], `Reset token: ${resetToken}`);

    await CreateResetPassword(user.email, resetToken);

    return { success: true, resetToken };
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(
      ['auth', 'passwordReset', 'request'],
      `BackendPasswordResetRequest failed with: ${errorMessage}`
    );
    return { success: false, message: errorMessage };
  }
}

export async function BackendPasswordReset(
  token: string,
  password: string,
  confirmPassword: string
) {
  try {
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    const resetPasswordEntry = await FindResetPasswordByToken(token);

    if (!resetPasswordEntry) {
      return { success: false, message: 'Invalid token, no entry' };
    }

    const decoded = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    if (!decoded) {
      return { success: false, message: 'Invalid token, no decoded' };
    }

    if (resetPasswordEntry.expiresAt < new Date()) {
      return { success: false, message: 'Token expired' };
    }

    if (decoded.payload.userEmail !== resetPasswordEntry.email) {
      return { success: false, message: 'Invalid token, email mismatch' };
    }

    const user = await FindUserByEmail(decoded.payload.userEmail as string);

    if (!user) {
      return { success: false, message: 'User not found, no user' };
    }

    if (user.id !== decoded.payload.userId) {
      return { success: false, message: 'User not found, id mismatch' };
    }

    const resetStatus = await BackendUpdateUserPassword(user, password);

    if (!resetStatus.success) {
      return { success: false, message: 'Failed to reset password, no reset status' };
    }

    await DeleteResetPasswordByEmail(user.email);
    await DeleteAllRefreshTokensByUserId(user.id);
    await BackendLogout();

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message ?? 'An unknown error occurred';
    Log(['auth', 'passwordReset', 'reset'], `BackendPasswordReset failed with: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
}
