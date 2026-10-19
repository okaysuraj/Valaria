/** Web client types for the catalog, profile, and paginated API responses. */
export interface TechnicalSpecs {
  resolution: string | null;
  aspectRatio: string | null;
  audio: string | null;
  colorGrade: string | null;
  fps: string | null;
}

export interface StreamingPlatform {
  name: string;
  type: string;
  logoText?: string | null;
  badgeColor?: string | null;
  url: string;
  region: string;
  verifiedAt: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle: string | null;
  tagline: string | null;
  director: string | null;
  year: number | null;
  runtime: string | null;
  runtimeMinutes?: number | null;
  rating: string | null;
  imdbScore: string | null;
  curatorScore: number | null;
  matchScore: number | null;
  genres: string[];
  moods: string[];
  synopsis: string | null;
  curatorNote: string | null;
  backdrop: string | null;
  poster: string | null;
  trailerId: string | null;
  trailerEmbedUrl: string | null;
  streamPlatforms: StreamingPlatform[];
  technicalSpecs: TechnicalSpecs;
  awards: string[];
  cast: string[];
  featuredSpotlight: boolean;
  addedAt?: string;
}

export interface TasteMood {
  id: string;
  label: string;
  tagline: string | null;
  accentHue: string | null;
  matchGenreKeys: string[];
}
export interface Catalog {
  spotlights: Movie[];
  curated: Movie[];
  moods: TasteMood[];
  genres: string[];
  total: number;
}
export interface Profile {
  selectedMoodId: string | null;
  newsletterOptIn: boolean;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
}
export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}
export interface Page<T> {
  data: T[];
  pagination: Pagination;
}
export type SortOption = 'title' | 'curator' | 'year' | 'runtime';
