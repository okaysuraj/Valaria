/** Verify Firebase sessions and expose the authenticated identity to API handlers. */
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { RequestHandler } from 'express';
import { AppError } from './middleware/errorHandler.js';

export interface Identity {
  uid: string;
  email?: string;
  emailVerified: boolean;
  authTime: number;
}
export type VerifyToken = (token: string) => Promise<Identity>;
declare global {
  namespace Express {
    interface Request {
      identity?: Identity;
    }
  }
}

function firebaseAuth() {
  if (!process.env.FIREBASE_PROJECT_ID) throw new AppError('Authentication is not configured', 503);
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new AppError('Authentication is not configured', 503);
  }
  if (!getApps().length) {
    const email = process.env.FIREBASE_CLIENT_EMAIL;
    const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (Boolean(email) !== Boolean(key)) throw new Error('Incomplete Firebase credentials');
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credential:
        email && key
          ? cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: email,
              privateKey: key,
            })
          : applicationDefault(),
    });
  }
  return getAuth();
}

export const verifyFirebaseToken: VerifyToken = async (token) => {
  try {
    // checkRevoked=true also rejects disabled users and revoked refresh sessions.
    const claims = await firebaseAuth().verifyIdToken(token, true);
    return {
      uid: claims.uid,
      email: claims.email,
      emailVerified: claims.email_verified === true,
      authTime: claims.auth_time,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    const code = (error as { code?: string }).code || '';
    if (
      [
        'app/invalid-credential',
        'auth/invalid-credential',
        'auth/internal-error',
        'app/network-error',
      ].includes(code) ||
      !code
    ) {
      throw new AppError('Authentication temporarily unavailable', 503);
    }
    throw new AppError('Your sign-in session has expired. Sign in again.', 401);
  }
};

export async function deleteFirebaseIdentity(uid: string): Promise<void> {
  try {
    await firebaseAuth().deleteUser(uid);
  } catch (error) {
    if ((error as { code?: string }).code === 'auth/user-not-found') return;
    throw new AppError('Account deletion is pending. Please retry shortly.', 503);
  }
}

export function requireAuth(verify: VerifyToken): RequestHandler {
  return async (req, _res, next) => {
    const match = /^Bearer ([A-Za-z0-9._-]{16,8192})$/.exec(req.headers.authorization || '');
    if (!match) {
      next(new AppError('Sign in to continue', 401));
      return;
    }
    req.identity = await verify(match[1]);
    next();
  };
}
