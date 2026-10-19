/** Present account access, email preferences, verification, and deletion controls. */
import type { User } from 'firebase/auth';
import { Dialog } from './Dialog';
import { authConfigured, logout, verifyEmail, refreshVerification } from '../auth/firebase';
import type { Profile } from '../types/movie';
import { useAccountForm } from '../hooks/useAccountForm';

const formTitles = { signin: 'Welcome back', signup: 'Create an account', reset: 'Reset password' };
const submitLabels = { signin: 'Sign in', signup: 'Create account', reset: 'Send reset link' };

export function AccountModal({
  open,
  onClose,
  user,
  profile,
  profileLoading,
  profileError,
  onRetryProfile,
  onPreference,
  preferencePending,
}: {
  open: boolean;
  onClose: () => void;
  user: User | null;
  profile: Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  onRetryProfile: () => void;
  onPreference: (value: boolean) => Promise<void>;
  preferencePending: boolean;
}) {
  const {
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
  } = useAccountForm(open);
  return (
    <Dialog open={open} title={user ? 'Your account' : formTitles[mode]} onClose={onClose}>
      <div className="detail-content">
        {!authConfigured ? (
          <div className="status-box">
            <h3>Account access unavailable</h3>
            <p>Account access has not been configured yet. You can still explore the catalog.</p>
          </div>
        ) : user ? (
          <div className="account-panel">
            <p>{user.email}</p>
            <p className="muted">
              {user.emailVerified ? 'Email verified' : 'Your email is not verified yet.'}
            </p>
            {!user.emailVerified && (
              <button
                className="button subtle"
                disabled={busy}
                onClick={() =>
                  accountAction(verifyEmail, 'Verification email sent. Check your inbox.')
                }
              >
                Resend verification email
              </button>
            )}
            {profileLoading ? (
              <p role="status">Loading preferences…</p>
            ) : profileError ? (
              <div role="alert">
                <p>{profileError}</p>
                <button className="button subtle" onClick={onRetryProfile}>
                  Retry preferences
                </button>
              </div>
            ) : (
              profile && (
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={profile.newsletterOptIn}
                    disabled={preferencePending}
                    onChange={(event) => void onPreference(event.target.checked)}
                  />
                  <span>
                    Email updates preference
                    <small>
                      Save whether you would like to receive email updates from Valaria.
                    </small>
                  </span>
                </label>
              )
            )}
            <button
              className="button subtle"
              disabled={busy}
              onClick={() => accountAction(logout, 'Signed out.')}
            >
              Sign out
            </button>
            {deleting ? (
              <form onSubmit={deleteAccount} className="account-form">
                <p>
                  This permanently deletes your account, watchlist, and preferences. Enter your
                  password to confirm.
                </p>
                <label>
                  Current password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    maxLength={128}
                  />
                </label>
                <button
                  className="button danger"
                  disabled={busy || preferencePending}
                  type="submit"
                >
                  {busy ? 'Deleting account…' : 'Permanently delete account'}
                </button>
                <button
                  type="button"
                  className="button subtle"
                  disabled={busy}
                  onClick={() => {
                    setDeleting(false);
                    setPassword('');
                  }}
                >
                  Cancel deletion
                </button>
              </form>
            ) : (
              <button
                className="text-button"
                disabled={busy || preferencePending}
                onClick={() => {
                  setDeleting(true);
                  setPassword('');
                  setMessage(null);
                }}
              >
                Delete account
              </button>
            )}
            {!user.emailVerified && (
              <button
                className="button subtle"
                disabled={busy}
                onClick={() =>
                  accountAction(async () => {
                    await refreshVerification();
                    onRetryProfile();
                  }, 'Email verification status refreshed.')
                }
              >
                I have verified my email
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="account-form">
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
            {mode !== 'reset' && (
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={mode === 'signup' ? 12 : undefined}
                  maxLength={128}
                  required
                />
                {mode === 'signup' && <small>Use at least 12 characters.</small>}
              </label>
            )}
            <button className="button primary" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : submitLabels[mode]}
            </button>
            <div className="auth-links">
              {mode !== 'signin' && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                    setMessage(null);
                  }}
                >
                  Sign in
                </button>
              )}
              {mode === 'signin' && (
                <>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                  >
                    Create account
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setMode('reset');
                      setError(null);
                    }}
                  >
                    Forgot password?
                  </button>
                </>
              )}
            </div>
          </form>
        )}
        {error && (
          <p role="alert" className="inline-error">
            {error}
          </p>
        )}
        {message && <p role="status">{message}</p>}
      </div>
    </Dialog>
  );
}
