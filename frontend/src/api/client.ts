import { Movie, TasteMood } from '../types/movie';

const API_BASE = 'http://localhost:4000/api';
const SESSION_ID = getOrCreateSessionId();

function getOrCreateSessionId(): string {
  let id = localStorage.getItem('valaria_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('valaria_session_id', id);
  }
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
    const url = new URL(`${API_BASE}/movies`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'All') url.searchParams.set(key, value);
      });
    }
    const res = await fetch(url.toString());
    const json = await res.json();
    return json.data;
  },

  /** Fetch a single movie by ID */
  async getMovie(id: string): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    const json = await res.json();
    return json.data;
  },

  /** Fetch all taste moods */
  async getMoods(): Promise<TasteMood[]> {
    const res = await fetch(`${API_BASE}/moods`);
    const json = await res.json();
    return json.data;
  },

  /** Get session watchlist */
  async getWatchlist(): Promise<{ movieId: string }[]> {
    const res = await fetch(`${API_BASE}/watchlist/${SESSION_ID}`);
    const json = await res.json();
    return json.data;
  },

  /** Add movie to watchlist */
  async addToWatchlist(movieId: string): Promise<void> {
    await fetch(`${API_BASE}/watchlist/${SESSION_ID}/${movieId}`, {
      method: 'POST',
    });
  },

  /** Remove movie from watchlist */
  async removeFromWatchlist(movieId: string): Promise<void> {
    await fetch(`${API_BASE}/watchlist/${SESSION_ID}/${movieId}`, {
      method: 'DELETE',
    });
  },

  /** Clear entire watchlist */
  async clearWatchlist(): Promise<void> {
    await fetch(`${API_BASE}/watchlist/${SESSION_ID}`, {
      method: 'DELETE',
    });
  },

  /** Health check */
  async health(): Promise<{ status: string; database: string }> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  getSessionId(): string {
    return SESSION_ID;
  },
};
