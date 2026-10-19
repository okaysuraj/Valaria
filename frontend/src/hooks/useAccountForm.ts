/** Account form state and sign-in, verification, and deletion actions. */
import { useEffect, useState, type FormEvent } from 'react';
import { authenticate, authError, logout, resetPassword, reauthenticate } from '../auth/firebase';
import { api, errorMessage } from '../api/client';

export function useAccountForm(open: boolean) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (!open) {
      setPassword('');
      setMessage(null);
      setError(null);
      setDeleting(false);
    }
  }, [open]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === 'reset') {
        await resetPassword(email);
        setMessage('If an account exists for this email, you’ll receive a reset link.');
      } else {
        const result = await authenticate(email, password, mode === 'signup');
        setPassword('');
        setMessage(
          mode === 'signup'
            ? result.verificationSent
              ? 'Account created. Check your inbox to verify your email.'
              : 'Account created. The verification email could not be sent. Use Resend verification email to try again.'
            : 'Signed in.',
        );
      }
    } catch (failure) {
      setError(authError(failure));
    } finally {
      setBusy(false);
    }
  }
  async function accountAction(action: () => Promise<void>, success: string) {
    setBusy(true);
    setError(null);
    try {
      await action();
      setMessage(success);
    } catch (failure) {
      setError(authError(failure));
    } finally {
      setBusy(false);
    }
  }
  async function deleteAccount(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await reauthenticate(password);
      await api.deleteAccount();
      await logout();
      setPassword('');
      setDeleting(false);
      setMessage('Your account and saved data have been deleted.');
    } catch (failure) {
      setError((failure as { code?: string })?.code ? authError(failure) : errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  return {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    busy,
    message,
    error,
    setError,
    setMessage,
    deleting,
    setDeleting,
    submit,
    accountAction,
    deleteAccount,
  };
}
