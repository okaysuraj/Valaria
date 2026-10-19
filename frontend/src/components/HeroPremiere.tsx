/** Present the selected spotlight film and its browse and watchlist actions. */
import { ArrowUpRight, Bookmark, Check } from 'lucide-react';
import type { Movie } from '../types/movie';
import { MovieImage } from './MovieCard';

export function HeroPremiere({
  movie,
  allSpotlights,
  onSelectMovie,
  onOpenModal,
  isWatchlisted,
  onToggleWatchlist,
  pending,
}: {
  movie: Movie | null;
  allSpotlights: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onOpenModal: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  pending: boolean;
}) {
  return (
    <section
      id="spotlight"
      className={`hero ${movie ? '' : 'hero-empty'}`}
      aria-labelledby="spotlight-heading"
    >
      {movie && (
        <div className="hero-art">
          <MovieImage src={movie.backdrop || movie.poster} title={movie.title} hero />
        </div>
      )}
      <div className="hero-content">
        <p className="eyebrow">THE VALARIA FILM CATALOG</p>
        <h1 id="spotlight-heading">{movie?.title || 'A place for your next great film.'}</h1>
        {movie ? (
          <>
            <p className="hero-meta">
              {[movie.director, movie.year, movie.runtime, movie.rating]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {(movie.tagline || movie.synopsis) && (
              <p className="hero-description">{movie.tagline || movie.synopsis}</p>
            )}
            <div className="button-row">
              <button className="button primary" onClick={() => onOpenModal(movie)}>
                Explore film
                <ArrowUpRight size={19} />
              </button>
              <button
                className="button glass"
                onClick={() => onToggleWatchlist(movie)}
                disabled={pending}
                aria-pressed={isWatchlisted}
              >
                {isWatchlisted ? <Check size={18} /> : <Bookmark size={18} />}
                {isWatchlisted ? 'Saved' : 'Save film'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="hero-description">
              Discover cinema, explore curations, and keep the films you want to see together.
            </p>
            <a className="button primary" href="#catalog">
              Explore catalog
              <ArrowUpRight size={19} />
            </a>
          </>
        )}
      </div>
      {allSpotlights.length > 1 && (
        <div className="spotlight-switcher" aria-label="Featured films">
          {allSpotlights.map((film, index) => (
            <button
              key={film.id}
              onClick={() => onSelectMovie(film)}
              aria-pressed={film.id === movie?.id}
            >
              <span className="muted">{String(index + 1).padStart(2, '0')}</span>
              {film.title}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
