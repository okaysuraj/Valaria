/** Typed API endpoints with Firebase tokens, cancellation, and request timeouts. */
import { auth } from '../auth/firebase';
import type { Catalog, Movie, Page, Profile, SortOption } from '../types/movie';

function apiBaseUrl(): URL {
  const configuredBase = import.meta.env.VITE_API_URL?.trim() || '/api';
  const baseUrl = new URL(configuredBase.replace(/\/$/, '') + '/', window.location.origin);
  if (!['http:', 'https:'].includes(baseUrl.protocol) || baseUrl.username || baseUrl.password)
    throw new Error('VITE_API_URL must be an HTTP URL without embedded credentials.');
  const localDevelopment =
    ['localhost', '127.0.0.1'].includes(baseUrl.hostname) &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (import.meta.env.PROD && baseUrl.protocol !== 'https:' && !localDevelopment)
    throw new Error('Production API connections require HTTPS.');
  return baseUrl;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
function withAbort<T>(operation: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException('Request cancelled.', 'AbortError'));
    operation.then(
      (value) => {
        signal.removeEventListener('abort', abort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener('abort', abort);
        reject(error);
      },
    );
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
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = window.setTimeout(abort, 15000);
  try {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    if (options.body) headers.set('Content-Type', 'application/json');
    if (authenticated) {
      const user = auth?.currentUser;
      if (!user) throw new ApiError('Sign in to access your watchlist.', 401);
      headers.set(
        'Authorization',
        `Bearer ${await withAbort(user.getIdToken(), controller.signal)}`,
      );
    }
    const response = await fetch(new URL(path, apiBaseUrl()), {
      ...options,
      headers,
      signal: controller.signal,
      credentials: 'omit',
    });
    const json = await response.json().catch(() => null);
    if (!response.ok)
      throw new ApiError(json?.message || `Request failed (${response.status}).`, response.status);
    if (json?.status !== 'ok' || !('data' in json))
      throw new ApiError('The service returned an invalid response.', 502);
    return json as T;
  } catch (error) {
    if (controller.signal.aborted && !options.signal?.aborted)
      throw new ApiError('The service took too long to respond. Please retry.', 408);
    throw error;
  } finally {
    window.clearTimeout(timer);
    options.signal?.removeEventListener('abort', abort);
  }
}
export interface MovieQuery {
  genre?: string;
  mood?: string;
  search?: string;
  sort?: SortOption;
  offset?: number;
  limit?: number;
}
export const api = {
  async getCatalog(signal?: AbortSignal): Promise<Catalog> {
    return (await request<{ data: Catalog }>('catalog', { signal })).data;
  },
  async getMovies(params: MovieQuery = {}, signal?: AbortSignal): Promise<Page<Movie>> {
    const query = new URLSearchParams();
    Object.entries({ limit: 24, ...params }).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'All') query.set(key, String(value));
    });
    return request<Page<Movie>>(`movies?${query}`, { signal });
  },
  async getMovie(id: string, signal?: AbortSignal): Promise<Movie> {
    return (await request<{ data: Movie }>(`movies/${encodeURIComponent(id)}`, { signal })).data;
  },
  async getWatchlist(offset = 0, signal?: AbortSignal): Promise<Page<Movie>> {
    return request<Page<Movie>>(`watchlist?limit=24&offset=${offset}`, { signal }, true);
  },
  async getWatchlistIds(signal?: AbortSignal): Promise<string[]> {
    return (await request<{ data: string[] }>('watchlist/ids', { signal }, true)).data;
  },
  async addToWatchlist(id: string): Promise<void> {
    await request(`watchlist/${encodeURIComponent(id)}`, { method: 'PUT' }, true);
  },
  async removeFromWatchlist(id: string): Promise<void> {
    await request(`watchlist/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
  },
  async clearWatchlist(): Promise<void> {
    await request('watchlist', { method: 'DELETE' }, true);
  },
  async deleteAccount(): Promise<void> {
    await request('profile/account', { method: 'DELETE' }, true);
  },
  async getProfile(signal?: AbortSignal): Promise<Profile> {
    return (await request<{ data: Profile }>('profile', { signal }, true)).data;
  },
  async updateProfile(
    values: Partial<Pick<Profile, 'selectedMoodId' | 'newsletterOptIn' | 'displayName'>>,
  ): Promise<Profile> {
    return (
      await request<{ data: Profile }>(
        'profile',
        { method: 'PUT', body: JSON.stringify(values) },
        true,
      )
    ).data;
  },
};
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please retry.';
}
