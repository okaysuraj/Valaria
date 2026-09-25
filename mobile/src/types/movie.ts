export interface TechnicalSpecs {
  resolution: string; // "4K ULTRA HD"
  aspectRatio: string; // "2.39:1 Panavision"
  audio: string; // "Dolby Atmos 7.1.4"
  colorGrade: string; // "35mm Photochemical Transfer" or "Dolby Vision HDR"
  fps: string; // "24.000 fps"
}

export interface StreamingPlatform {
  name: string;
  type: 'subscription' | 'free_curated' | 'premiere';
  logoText: string;
  badgeColor?: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  tagline: string;
  director: string;
  year: number;
  runtime: string; // e.g. "2h 46m"
  rating: string; // "PG-13", "R"
  imdbScore: string; // "8.8"
  curatorScore: number; // 99 (Valaria index)
  matchScore: number; // percentage match for current taste
  genres: string[];
  moods: string[];
  synopsis: string;
  curatorNote: string;
  backdrop: string;
  poster: string;
  trailerId?: string; // YouTube trailer video id
  trailerEmbedUrl?: string;
  streamPlatforms: StreamingPlatform[];
  technicalSpecs: TechnicalSpecs;
  awards?: string[];
  cast: string[];
  featuredSpotlight?: boolean;
}

export interface TasteMood {
  id: string;
  label: string;
  tagline: string;
  accentHue: string;
  matchGenreKeys: string[];
}

export type GenreFilter = 
  | 'All'
  | 'Auteur Vision'
  | 'Sci-Fi & Speculative'
  | 'Neo-Noir'
  | 'Psychological Thriller'
  | 'Poetic Romance'
  | 'Documentary & Essay';

export type SortOption = 'match' | 'curator' | 'year' | 'runtime';

export type AppTab = 'spotlight' | 'taste' | 'vault' | 'catalog' | 'watchlist';
