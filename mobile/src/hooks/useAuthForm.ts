/** Account form state and Firebase actions, separate from native presentation. */
import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../api/firebase';
import { api } from '../api/client';

type FormMode = 'signin' | 'signup' | 'reset';

function authFormError(error: unknown, mode: FormMode): string {
  const code = (error as { code?: string })?.code;
  if (code === 'auth/network-request-failed') return 'Connection failed. Please retry.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.';
  const messages = {
    signup: 'Unable to create your account. Check your details or try signing in.',
    reset: 'Unable to send the request. Please retry later.',
    signin: 'Unable to sign in. Check your email and password.',
  };
  return messages[mode];
}

interface Options {
  open: boolean;
  onClose: () => void;
  onMessage: (message: string) => void;
}
export function useAuthForm({ open, onClose, onMessage }: Options) {
  const [mode, setMode] = useState<FormMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  useEffect(() => {
    if (!open) {
      setPassword('');
      setError(null);
      setStatus(null);
      setDeleting(false);
    }
  }, [open]);
  const submit = async () => {
    if (!auth || busy) return;
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (mode !== 'reset' && password.length < (mode === 'signup' ? 12 : 1)) {
      setError(
        mode === 'signup'
          ? 'Use at least 12 characters for your password.'
          : 'Enter your password.',
      );
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === 'reset') {
        try {
          await sendPasswordResetEmail(auth, normalizedEmail);
        } catch (cause) {
          if ((cause as { code?: string }).code !== 'auth/user-not-found') throw cause;
        }
        onMessage('If an account exists for that email, a password reset message has been sent.');
      } else if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        try {
          await sendEmailVerification(credential.user);
          onMessage('Account created. Check your email to verify your address.');
        } catch {
          onMessage(
            'Account created, but verification could not be sent. You can retry from Account.',
          );
        }
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
        onMessage('Signed in. Your watchlist will sync across devices.');
      }
      setPassword('');
      onClose();
    } catch (cause) {
      setError(authFormError(cause, mode));
    } finally {
      setBusy(false);
    }
  };
  const accountAction = async (action: 'signout' | 'verify' | 'refresh') => {
    if (!auth || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (action === 'signout') {
        await signOut(auth);
        setPassword('');
        onClose();
        onMessage('Signed out.');
      } else if (action === 'refresh' && auth.currentUser) {
        await auth.currentUser.reload();
        await auth.currentUser.getIdToken(true);
        setStatus(
          auth.currentUser.emailVerified
            ? 'Email verified. Account refreshed.'
            : 'Your email has not been verified yet. Check your inbox.',
        );
      } else if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setStatus('Verification email requested. Check your inbox.');
      }
    } catch {
      setError('Unable to complete this request. Please retry later.');
    } finally {
      setBusy(false);
    }
  };
  const deleteAccount = async () => {
    if (!auth?.currentUser?.email || busy) return;
    if (!password) {
      setError('Enter your current password to confirm account deletion.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await reauthenticateWithCredential(
        auth.currentUser,
        EmailAuthProvider.credential(auth.currentUser.email, password),
      );
      await auth.currentUser.getIdToken(true);
      await api.deleteAccount();
      await signOut(auth);
      setPassword('');
      setDeleting(false);
      onClose();
      onMessage('Your account and saved data have been deleted.');
    } catch {
      setError('Unable to delete your account. Check your password and connection, then retry.');
    } finally {
      setBusy(false);
    }
  };

  return {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    busy,
    error,
    setError,
    deleting,
    setDeleting,
    status,
    submit,
    accountAction,
    deleteAccount,
  };
}
