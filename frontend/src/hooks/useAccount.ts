/** Signed-in account state, preferences, and watchlist synchronization. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { api, errorMessage } from '../api/client';
import { auth, refreshVerification } from '../auth/firebase';
import type { Movie, Page, Profile } from '../types/movie';

const emptyPage = (): Page<Movie> => ({
  data: [],
  pagination: { offset: 0, limit: 24, total: 0, hasMore: false },
});
interface Options {
  notify: (message: string) => void;
  onSignIn: () => void;
  onCloseMovie: () => void;
  setMood: (mood: string) => void;
  setOffset: (offset: number) => void;
  reloadCatalog: () => void;
}

export function useAccount({
  notify,
  onSignIn,
  onCloseMovie,
  setMood,
  setOffset,
  reloadCatalog,
}: Options) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(auth));
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedReady, setSavedReady] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileVersion, setProfileVersion] = useState(0);
  const [preferencePending, setPreferencePending] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [watchlistPage, setWatchlistPage] = useState<Page<Movie>>(emptyPage);
  const [watchlistOffset, setWatchlistOffset] = useState(0);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState<string | null>(null);
  const [watchlistVersion, setWatchlistVersion] = useState(0);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const mutationLocks = useRef(new Set<string>());
  const clearingLock = useRef(false);
  const identity = useRef<string | null>(null);
  // A new generation invalidates pending writes, even after signing back into the same account.
  const accountGeneration = useRef(0);
  const preferenceLock = useRef(false);
  // Refresh responses must not overwrite newer watchlist or preference changes.
  const savedRevision = useRef(0);
  const preferenceRevision = useRef(0);
  const lastForegroundRefresh = useRef(Date.now());
  const isCurrentAccount = useCallback((uid: string, generation: number) => {
    return identity.current === uid && accountGeneration.current === generation;
  }, []);
  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(
      auth,
      (next) => {
        identity.current = next?.uid || null;
        accountGeneration.current += 1;
        savedRevision.current += 1;
        mutationLocks.current.clear();
        clearingLock.current = false;
        preferenceLock.current = false;
        setUser(next);
        setAuthLoading(false);
        setSavedIds([]);
        setSavedReady(false);
        setSavedError(null);
        setProfile(null);
        setProfileError(null);
        setWatchlistOpen(false);
        setWatchlistPage(emptyPage());
        setWatchlistOffset(0);
        setPendingIds(new Set());
        setClearing(false);
        setPreferencePending(false);
        setMood('');
        setOffset(0);
      },
      () => {
        setAuthLoading(false);
        setSavedError('Account access is temporarily unavailable.');
      },
    );
  }, [setMood, setOffset]);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    const revision = savedRevision.current;
    const preference = preferenceRevision.current;
    setProfileLoading(true);
    setProfileError(null);
    setSavedError(null);
    api
      .getProfile(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted && preference === preferenceRevision.current) {
          setProfile(data);
          setMood(data.selectedMoodId || '');
          setOffset(0);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted && preference === preferenceRevision.current)
          setProfileError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setProfileLoading(false);
      });
    api
      .getWatchlistIds(controller.signal)
      .then((ids) => {
        if (!controller.signal.aborted && revision === savedRevision.current) {
          setSavedIds(ids);
          setSavedReady(true);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted && revision === savedRevision.current) {
          setSavedReady(false);
          setSavedError(errorMessage(error));
        }
      });
    return () => controller.abort();
  }, [user?.uid, profileVersion]);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (
        document.visibilityState !== 'visible' ||
        Date.now() - lastForegroundRefresh.current < 30000
      )
        return;
      lastForegroundRefresh.current = Date.now();
      reloadCatalog();
      if (user && !mutationLocks.current.size && !clearingLock.current && !preferenceLock.current) {
        void refreshVerification()
          .then(() => {
            if (!cancelled) {
              setProfileVersion((value) => value + 1);
              setWatchlistVersion((value) => value + 1);
            }
          })
          .catch((error) => {
            if (!cancelled) setSavedError(errorMessage(error));
          });
      }
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [user?.uid, reloadCatalog]);

  useEffect(() => {
    if (!watchlistOpen || !user) return;
    const controller = new AbortController();
    setWatchlistLoading(true);
    setWatchlistError(null);
    api
      .getWatchlist(watchlistOffset, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          if (data.data.length === 0 && watchlistOffset > 0) {
            setWatchlistOffset(Math.max(0, watchlistOffset - 24));
            return;
          }
          setWatchlistPage(data);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setWatchlistPage(emptyPage());
          setWatchlistError(errorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setWatchlistLoading(false);
      });
    return () => controller.abort();
  }, [watchlistOpen, user?.uid, watchlistOffset, watchlistVersion]);

  const toggleWatchlist = useCallback(
    async (movie: Movie) => {
      const owner = identity.current;
      const generation = accountGeneration.current;
      if (authLoading) {
        notify('Your account is still loading. Please try again.');
        return;
      }
      if (!owner) {
        onCloseMovie();
        onSignIn();
        return;
      }
      if (!savedReady) {
        notify('Your watchlist is not loaded. Retry account sync before making changes.');
        return;
      }
      if (mutationLocks.current.has(movie.id) || clearingLock.current) return;
      mutationLocks.current.add(movie.id);
      setPendingIds(new Set(mutationLocks.current));
      savedRevision.current += 1;
      const removing = savedSet.has(movie.id);
      try {
        if (removing) await api.removeFromWatchlist(movie.id);
        else await api.addToWatchlist(movie.id);
        if (!isCurrentAccount(owner, generation)) return;
        setSavedIds((previous) =>
          removing
            ? previous.filter((id) => id !== movie.id)
            : [...new Set([...previous, movie.id])],
        );
        setWatchlistVersion((value) => value + 1);
        notify(
          `${removing ? 'Removed' : 'Saved'} “${movie.title}”${removing ? ' from' : ' to'} your watchlist.`,
        );
      } catch (error) {
        if (isCurrentAccount(owner, generation)) notify(errorMessage(error));
      } finally {
        if (isCurrentAccount(owner, generation)) {
          mutationLocks.current.delete(movie.id);
          setPendingIds(new Set(mutationLocks.current));
        }
      }
    },
    [authLoading, savedReady, savedSet, notify, onSignIn, onCloseMovie, isCurrentAccount],
  );

  async function clearWatchlist() {
    const owner = identity.current;
    const generation = accountGeneration.current;
    if (!owner || clearingLock.current || mutationLocks.current.size) return;
    clearingLock.current = true;
    setClearing(true);
    savedRevision.current += 1;
    try {
      await api.clearWatchlist();
      if (!isCurrentAccount(owner, generation)) return;
      setSavedIds([]);
      setWatchlistPage(emptyPage());
      setWatchlistOffset(0);
      setConfirmClear(false);
      setWatchlistVersion((value) => value + 1);
      notify('Your watchlist has been cleared.');
    } catch (error) {
      if (isCurrentAccount(owner, generation)) notify(errorMessage(error));
    } finally {
      if (isCurrentAccount(owner, generation)) {
        clearingLock.current = false;
        setClearing(false);
      }
    }
  }
  async function savePreference(
    values: Partial<Pick<Profile, 'selectedMoodId' | 'newsletterOptIn'>>,
  ) {
    const owner = identity.current;
    const generation = accountGeneration.current;
    if (!owner || preferenceLock.current) return;
    preferenceLock.current = true;
    setPreferencePending(true);
    preferenceRevision.current += 1;
    try {
      const result = await api.updateProfile(values);
      if (!isCurrentAccount(owner, generation)) return;
      setProfile(result);
      if ('selectedMoodId' in values) {
        setMood(result.selectedMoodId || '');
        setOffset(0);
      }
      notify('Your preference has been saved.');
    } catch (error) {
      if (isCurrentAccount(owner, generation)) notify(errorMessage(error));
    } finally {
      if (isCurrentAccount(owner, generation)) {
        preferenceLock.current = false;
        setPreferencePending(false);
      }
    }
  }
  function openWatchlist() {
    if (!user) {
      onSignIn();
      return;
    }
    setConfirmClear(false);
    setWatchlistOpen(true);
  }

  return {
    user,
    authLoading,
    savedIds,
    savedSet,
    savedReady,
    savedError,
    profile,
    profileError,
    profileLoading,
    preferencePending,
    retryProfile: () => setProfileVersion((value) => value + 1),
    watchlistOpen,
    setWatchlistOpen,
    watchlistPage,
    setWatchlistOffset,
    watchlistLoading,
    watchlistError,
    retryWatchlist: () => setWatchlistVersion((value) => value + 1),
    pendingIds,
    clearing,
    confirmClear,
    setConfirmClear,
    toggleWatchlist,
    clearWatchlist,
    savePreference,
    openWatchlist,
  };
}
