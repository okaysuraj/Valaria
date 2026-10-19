/** Restore the account and synchronize preferences and saved films across devices. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { onIdTokenChanged, type User } from 'firebase/auth';
import { api } from '../api/client';
import { auth } from '../api/firebase';
import type { Movie, Profile } from '../types/movie';
import { useRequest } from './useRequest';

interface Options {
  showMessage: (message: string) => void;
  onAccountChange: () => void;
}

export function useAccount({ showMessage, onAccountChange }: Options) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!auth);
  const [authOpen, setAuthOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(new Set());
  const [watchlistRevision, setWatchlistRevision] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileBusy, setProfileBusy] = useState(false);
  const [preferenceError, setPreferenceError] = useState<string | null>(null);
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const mutationBusy = useRef(false);
  const profileMutationBusy = useRef(false);
  const currentUid = useRef<string | null>(null);
  // A new generation invalidates pending writes, even after signing back into the same account.
  const accountGeneration = useRef(0);
  const accountWriteVersion = useRef(0);
  const isCurrentAccount = useCallback((uid: string, generation: number) => {
    return currentUid.current === uid && accountGeneration.current === generation;
  }, []);
  const account = useRequest(
    `${user?.uid || ''}:${watchlistRevision}`,
    async (signal) => {
      const uid = auth?.currentUser?.uid || null;
      const generation = accountGeneration.current;
      const writeVersion = accountWriteVersion.current;
      const [ids, preferences] = await Promise.all([api.watchlistIds(signal), api.profile(signal)]);
      return { ids, preferences, uid, generation, writeVersion };
    },
    authReady && Boolean(user),
  );

  useEffect(() => {
    if (!auth) return;
    return onIdTokenChanged(auth, (nextUser) => {
      if (currentUid.current !== (nextUser?.uid || null)) {
        accountGeneration.current += 1;
        accountWriteVersion.current += 1;
        mutationBusy.current = false;
        profileMutationBusy.current = false;
        setProfileBusy(false);
        setSavedIds(new Set());
        setProfile(null);
        setPreferenceError(null);
        setSelectedMoodId(null);
        setAuthOpen(false);
        onAccountChange();
        currentUid.current = nextUser?.uid || null;
      }
      setUser(nextUser);
      setAuthReady(true);
      setWatchlistRevision((value) => value + 1);
    });
  }, [onAccountChange]);
  useEffect(() => {
    if (
      account.data &&
      account.data.uid === currentUid.current &&
      account.data.generation === accountGeneration.current &&
      account.data.writeVersion === accountWriteVersion.current &&
      !mutationBusy.current &&
      !profileMutationBusy.current
    ) {
      setSavedIds(new Set(account.data.ids));
      setProfile(account.data.preferences);
      setSelectedMoodId(account.data.preferences.selectedMoodId);
    }
  }, [account.data]);

  const toggleWatchlist = useCallback(
    async (movie: Movie) => {
      const uid = auth?.currentUser?.uid;
      if (!uid) {
        setAuthOpen(true);
        return;
      }
      if (account.loading || account.error || account.data?.uid !== uid) {
        showMessage('Your watchlist must finish syncing before it can be changed.');
        return;
      }
      if (mutationBusy.current) {
        showMessage('Saving your previous change…');
        return;
      }
      mutationBusy.current = true;
      accountWriteVersion.current += 1;
      const generation = accountGeneration.current;
      const removing = savedIds.has(movie.id);
      try {
        showMessage(removing ? 'Removing saved film…' : 'Saving film…');
        if (removing) await api.remove(movie.id);
        else await api.add(movie.id);
        if (!isCurrentAccount(uid, generation)) return;
        setSavedIds((previous) => {
          const next = new Set(previous);
          removing ? next.delete(movie.id) : next.add(movie.id);
          return next;
        });
        showMessage(removing ? `Removed ${movie.title}.` : `Saved ${movie.title}.`);
      } catch (error) {
        if (isCurrentAccount(uid, generation))
          showMessage(error instanceof Error ? error.message : 'Unable to save. Please retry.');
      } finally {
        if (isCurrentAccount(uid, generation)) {
          mutationBusy.current = false;
          accountWriteVersion.current += 1;
          setWatchlistRevision((value) => value + 1);
        }
      }
    },
    [savedIds, showMessage, account.loading, account.error, account.data],
  );
  const clearWatchlist = async () => {
    const uid = currentUid.current;
    if (!uid || mutationBusy.current) return;
    mutationBusy.current = true;
    accountWriteVersion.current += 1;
    const generation = accountGeneration.current;
    try {
      await api.clear();
      if (!isCurrentAccount(uid, generation)) return;
      setSavedIds(new Set());
      showMessage('Watchlist cleared.');
    } catch (error) {
      if (isCurrentAccount(uid, generation))
        showMessage(error instanceof Error ? error.message : 'Unable to clear your watchlist.');
    } finally {
      if (isCurrentAccount(uid, generation)) {
        mutationBusy.current = false;
        accountWriteVersion.current += 1;
        setWatchlistRevision((value) => value + 1);
      }
    }
  };
  const updatePreferences = async (patch: {
    selectedMoodId?: string | null;
    newsletterOptIn?: boolean;
  }) => {
    if (!user) {
      if (patch.selectedMoodId !== undefined) setSelectedMoodId(patch.selectedMoodId);
      return;
    }
    if (
      profileMutationBusy.current ||
      account.loading ||
      currentUid.current !== user.uid ||
      account.data?.uid !== user.uid
    )
      return;
    profileMutationBusy.current = true;
    setProfileBusy(true);
    setPreferenceError(null);
    accountWriteVersion.current += 1;
    const uid = user.uid;
    const generation = accountGeneration.current;
    try {
      const preferences = await api.updateProfile(patch);
      if (isCurrentAccount(uid, generation)) {
        setProfile(preferences);
        setSelectedMoodId(preferences.selectedMoodId);
        showMessage('Preference saved.');
      }
    } catch (error) {
      if (isCurrentAccount(uid, generation)) {
        const message = error instanceof Error ? error.message : 'Unable to save preference.';
        setPreferenceError(message);
        showMessage(message);
      }
    } finally {
      if (isCurrentAccount(uid, generation)) {
        profileMutationBusy.current = false;
        setProfileBusy(false);
        accountWriteVersion.current += 1;
        setWatchlistRevision((value) => value + 1);
      }
    }
  };

  return {
    user,
    authReady,
    authOpen,
    setAuthOpen,
    savedIds,
    watchlistRevision,
    profile,
    profileBusy,
    preferenceError,
    setPreferenceError,
    selectedMoodId,
    account,
    toggleWatchlist,
    clearWatchlist,
    updatePreferences,
  };
}
