/** Configure browser authentication and wrap the Firebase account actions. */
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const authConfigured = Object.values(config).every(
  (value) => typeof value === 'string' && value.trim().length > 0,
);
export const auth = authConfigured ? getAuth(initializeApp(config)) : null;
const persistenceReady = auth
  ? setPersistence(auth, browserLocalPersistence).catch(() => {
      // Sign-in remains usable in browsers that block persistent storage.
    })
  : Promise.resolve();

export async function authenticate(email: string, password: string, register: boolean) {
  if (!auth) throw new Error('Account access is not configured yet.');
  await persistenceReady;
  if (register) {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    try {
      await sendEmailVerification(credential.user);
      return { credential, verificationSent: true };
    } catch {
      return { credential, verificationSent: false };
    }
  }
  return {
    credential: await signInWithEmailAndPassword(auth, email.trim(), password),
    verificationSent: null,
  };
}
export async function resetPassword(email: string) {
  if (!auth) throw new Error('Account access is not configured yet.');
  await sendPasswordResetEmail(auth, email.trim());
}
export async function verifyEmail() {
  if (!auth?.currentUser) throw new Error('Sign in to verify your email.');
  await sendEmailVerification(auth.currentUser);
}
export async function refreshVerification() {
  const current = auth?.currentUser;
  if (!current) throw new Error('Sign in to refresh your email verification.');
  await current.reload();
  await current.getIdToken(true);
}
export async function logout() {
  if (auth) await signOut(auth);
}
export async function reauthenticate(password: string) {
  const current = auth?.currentUser;
  if (!current?.email) throw new Error('Sign in again before deleting your account.');
  await reauthenticateWithCredential(
    current,
    EmailAuthProvider.credential(current.email, password),
  );
  await current.getIdToken(true);
}
export function authError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.';
  if (code === 'auth/network-request-failed')
    return 'Unable to connect. Check your connection and try again.';
  if (code === 'auth/weak-password' || code === 'auth/password-does-not-meet-requirements')
    return 'Use a stronger password that meets the account password policy.';
  return 'Unable to complete this account request. Check your details and try again.';
}
