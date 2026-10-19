/** Reusable catalog card with accessible details and watchlist actions. */
import { memo, useState, useEffect } from 'react';
import { Bookmark, Check, Film } from 'lucide-react';
import type { Movie } from '../types/movie';

export function MovieImage({
  src,
  title,
  hero = false,
  compact = false,
}: {
  src: string | null;
  title: string;
  hero?: boolean;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  let safe = false;
  try {
    safe = Boolean(src && new URL(src).protocol === 'https:');
  } catch {
    /* Missing media uses the accessible unavailable state. */
  }
  return safe && !failed ? (
    <img
      src={src!}
      alt={title}
      loading={hero ? 'eager' : 'lazy'}
      fetchPriority={hero ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="image-unavailable" role="img" aria-label={`${title}: artwork unavailable`}>
      <Film size={32} />
      {!compact && <span>Artwork unavailable</span>}
    </div>
  );
}
export const MovieCard = memo(function MovieCard({
  movie,
  saved,
  pending,
  onOpen,
  onSave,
}: {
  movie: Movie;
  saved: boolean;
  pending: boolean;
  onOpen: (movie: Movie) => void;
  onSave: (movie: Movie) => void;
}) {
  return (
    <article className="movie-card">
      <button
        className="poster-button"
        onClick={() => onOpen(movie)}
        aria-label={`View ${movie.title}`}
      >
        <span className="poster-art" aria-hidden="true">
          <MovieImage src={movie.poster || movie.backdrop} title={movie.title} compact />
        </span>
      </button>
      <div className="movie-card-title">
        <h3>
          <button onClick={() => onOpen(movie)}>{movie.title}</button>
        </h3>
        <button
          className="icon-button"
          onClick={() => onSave(movie)}
          disabled={pending}
          aria-label={`${saved ? 'Remove' : 'Save'} ${movie.title}`}
          aria-pressed={saved}
        >
          {saved ? <Check size={19} /> : <Bookmark size={19} />}
        </button>
      </div>
      <p className="muted movie-meta">
        {[movie.year, movie.director].filter(Boolean).join(' · ') || 'Film details pending'}
      </p>
      {movie.runtime && <p className="muted movie-meta">{movie.runtime}</p>}
      {movie.curatorScore !== null && (
        <p className="movie-meta brand-accent">Curator {movie.curatorScore}/100</p>
      )}
    </article>
  );
});
