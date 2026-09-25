import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Movie, TasteMood } from '../types/movie';

/**
 * Resolves the backend API base URL.
 * Priority:
 * 1. EXPO_PUBLIC_API_URL environment variable (if set)
 * 2. Host IP dynamically detected from Expo Go Metro bundler connection (e.g., 192.168.1.37)
 * 3. Android Emulator fallback (10.0.2.2)
 * 4. Fallback detected LAN IP or localhost
 */
function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Auto-detect host IP when running in Expo Go on physical device
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:4000/api`;
    }
  }

  // Android emulator fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api';
  }

  // Default detected LAN IP fallback for Expo Go on real device on current Wi-Fi
  return 'http://192.168.1.37:4000/api';
}

export const API_BASE = resolveApiBaseUrl();

console.log(`[Valaria Mobile API] Resolved API Base URL: ${API_BASE}`);

let _sessionId: string | null = null;

async function getOrCreateSessionId(): Promise<string> {
  if (_sessionId) return _sessionId;

  const stored = await AsyncStorage.getItem('valaria_session_id');
  if (stored) {
    _sessionId = stored;
    return stored;
  }

  // Generate unique session ID
  const id = 'session-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
  await AsyncStorage.setItem('valaria_session_id', id);
  _sessionId = id;
  return id;
}

export const api = {
  /** Fetch all movies (with optional filters) */
  async getMovies(params?: {
    genre?: string;
    mood?: string;
    search?: string;
    sort?: string;
  }): Promise<Movie[]> {
    const queryParts: string[] = [];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'All') {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      });
    }
    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await fetch(`${API_BASE}/movies${queryString}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch movies: HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  },

  /** Fetch a single movie by ID */
  async getMovie(id: string): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch movie ${id}: HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  },

  /** Fetch all taste moods */
  async getMoods(): Promise<TasteMood[]> {
    const res = await fetch(`${API_BASE}/moods`);
    if (!res.ok) {
      throw new Error(`Failed to fetch moods: HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  },

  /** Get session watchlist */
  async getWatchlist(): Promise<{ movieId: string }[]> {
    const sessionId = await getOrCreateSessionId();
    const res = await fetch(`${API_BASE}/watchlist/${sessionId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch watchlist: HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  },

  /** Add movie to watchlist */
  async addToWatchlist(movieId: string): Promise<void> {
    const sessionId = await getOrCreateSessionId();
    const res = await fetch(`${API_BASE}/watchlist/${sessionId}/${movieId}`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(`Failed to add to watchlist: HTTP ${res.status}`);
    }
  },

  /** Remove movie from watchlist */
  async removeFromWatchlist(movieId: string): Promise<void> {
    const sessionId = await getOrCreateSessionId();
    const res = await fetch(`${API_BASE}/watchlist/${sessionId}/${movieId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to remove from watchlist: HTTP ${res.status}`);
    }
  },

  /** Clear entire watchlist */
  async clearWatchlist(): Promise<void> {
    const sessionId = await getOrCreateSessionId();
    const res = await fetch(`${API_BASE}/watchlist/${sessionId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to clear watchlist: HTTP ${res.status}`);
    }
  },

  /** Health check */
  async health(): Promise<{ status: string; database: string }> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },
};
