/** Native API requests with environment-aware URLs, Firebase tokens, and timeouts. */
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { auth } from './firebase';
import type { Catalog, Movie, Page, Profile } from '../types/movie';

function apiBase(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (configured) {
    const parsed = new URL(configured);
    if (parsed.protocol !== 'https:' && (!__DEV__ || parsed.protocol !== 'http:')) {
      throw new Error('EXPO_PUBLIC_API_URL must use HTTPS in release builds.');
    }
    return configured;
  }
  if (!__DEV__) throw new Error('Set EXPO_PUBLIC_API_URL to your HTTPS API endpoint.');
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${host || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost')}:4000/api`;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
function abortable<T>(operation: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () =>
      reject(Object.assign(new Error('Request cancelled.'), { name: 'AbortError' }));
    // Observe the SDK promise even when cancellation happened before this helper ran.
    operation.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
  });
}
async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const controller = new AbortController();
  const relayAbort = () => controller.abort();
  options.signal?.addEventListener('abort', relayAbort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const tokenOperation = authenticated ? auth?.currentUser?.getIdToken() : null;
    const token = tokenOperation ? await abortable(tokenOperation, controller.signal) : null;
    if (authenticated && !token) throw new ApiError('Sign in to sync your watchlist.', 401);
    const res = await fetch(`${apiBase()}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok)
      throw new ApiError(
        json?.message ||
          json?.error?.message ||
          (typeof json?.error === 'string'
            ? json.error
            : `Request failed (${res.status}). Please retry.`),
        res.status,
      );
    if (!json || json.status !== 'ok' || !Object.prototype.hasOwnProperty.call(json, 'data')) {
      throw new ApiError('The server returned an invalid response. Please retry.', 502);
    }
    return json as T;
  } catch (error) {
    if (controller.signal.aborted && !options.signal?.aborted)
      throw new Error('The request timed out. Check your connection and retry.');
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', relayAbort);
  }
}
const query = (params: Record<string, string | number | undefined>) => {
  const pairs = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== '' && value !== 'All',
  );
  return pairs.length
    ? `?${pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`).join('&')}`
    : '';
};
export const api = {
  async catalog(signal?: AbortSignal) {
    return (await request<{ data: Catalog }>('/catalog', { signal })).data;
  },
  movies(params: Record<string, string | number | undefined>, signal?: AbortSignal) {
    return request<Page<Movie>>(`/movies${query(params)}`, { signal });
  },
  async movie(id: string, signal?: AbortSignal) {
    return (await request<{ data: Movie }>(`/movies/${encodeURIComponent(id)}`, { signal })).data;
  },
  watchlist(offset = 0, signal?: AbortSignal) {
    return request<Page<Movie>>(`/watchlist${query({ limit: 24, offset })}`, { signal }, true);
  },
  async watchlistIds(signal?: AbortSignal) {
    return (await request<{ data: string[] }>('/watchlist/ids', { signal }, true)).data;
  },
  add(id: string) {
    return request(`/watchlist/${encodeURIComponent(id)}`, { method: 'PUT' }, true);
  },
  remove(id: string) {
    return request(`/watchlist/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
  },
  clear() {
    return request('/watchlist', { method: 'DELETE' }, true);
  },
  async profile(signal?: AbortSignal) {
    return (await request<{ data: Profile }>('/profile', { signal }, true)).data;
  },
  async updateProfile(
    input: Partial<Pick<Profile, 'selectedMoodId' | 'newsletterOptIn' | 'displayName'>>,
  ) {
    return (
      await request<{ data: Profile }>(
        '/profile',
        { method: 'PUT', body: JSON.stringify(input) },
        true,
      )
    ).data;
  },
  deleteAccount() {
    return request('/profile/account', { method: 'DELETE' }, true);
  },
};
