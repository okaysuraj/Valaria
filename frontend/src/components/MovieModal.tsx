/** Display fresh film details, trailers, and provider links by region. */
import { useEffect, useState } from 'react';
import { Bookmark, Check, ExternalLink, Play } from 'lucide-react';
import type { Movie } from '../types/movie';
import { Dialog } from './Dialog';
import { MovieImage } from './MovieCard';

export function safeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}
export function trailerUrl(movie: Movie): string | null {
  if (movie.trailerId && /^[A-Za-z0-9_-]{11}$/.test(movie.trailerId))
    return `https://www.youtube-nocookie.com/embed/${movie.trailerId}`;
  if (!movie.trailerEmbedUrl) return null;
  try {
    const url = new URL(movie.trailerEmbedUrl);
    const match = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})\/?$/);
    return ['www.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname) &&
      url.protocol === 'https:' &&
      match
      ? `https://www.youtube-nocookie.com/embed/${match[1]}`
      : null;
  } catch {
    return null;
  }
}
export function MovieModal({
  movie,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  pending,
  loading,
  error,
  onRetry,
}: {
  movie: Movie | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  pending: boolean;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => setPlaying(false), [movie?.id]);
  const embed = movie ? trailerUrl(movie) : null;
  const specs = movie
    ? [
        ['Resolution', movie.technicalSpecs.resolution],
        ['Aspect ratio', movie.technicalSpecs.aspectRatio],
        ['Audio', movie.technicalSpecs.audio],
        ['Color', movie.technicalSpecs.colorGrade],
        ['Frame rate', movie.technicalSpecs.fps],
      ].filter(([, value]) => value)
    : [];
  return (
    <Dialog open={Boolean(movie)} title={movie?.title || 'Film details'} onClose={onClose} wide>
      {movie &&
        (loading ? (
          <p className="detail-content" role="status">
            Loading film details…
          </p>
        ) : error ? (
          <div className="detail-content inline-error" role="alert">
            <p>{error}</p>
            <button className="button subtle" onClick={onRetry}>
              Retry details
            </button>
          </div>
        ) : (
          <>
            <div className="detail-art">
              {playing && embed ? (
                <iframe
                  src={embed}
                  title={`${movie.title} trailer`}
                  allow="encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <MovieImage src={movie.backdrop || movie.poster} title={movie.title} />
              )}
            </div>
            <div className="detail-content">
              <p className="muted">
                {[movie.director, movie.year, movie.runtime, movie.rating]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="muted">{movie.originalTitle}</p>
              )}
              {movie.tagline && <p>{movie.tagline}</p>}
              <div className="button-row">
                {embed && (
                  <button className="button primary" onClick={() => setPlaying(!playing)}>
                    <Play size={18} />
                    {playing ? 'Close trailer' : 'Play trailer'}
                  </button>
                )}
                <button
                  className="button subtle"
                  disabled={pending}
                  onClick={() => onToggleWatchlist(movie)}
                  aria-pressed={isWatchlisted}
                >
                  {isWatchlisted ? <Check size={18} /> : <Bookmark size={18} />}
                  {isWatchlisted ? 'Saved to watchlist' : 'Save to watchlist'}
                </button>
              </div>
              <p className="synopsis">
                {movie.synopsis || 'A synopsis has not been published for this film.'}
              </p>
              {movie.genres.length > 0 && <p className="muted">{movie.genres.join(' · ')}</p>}
              {(movie.imdbScore !== null || movie.curatorScore !== null) && (
                <p className="muted">
                  {[
                    movie.imdbScore !== null ? `IMDb ${movie.imdbScore}/10` : null,
                    movie.curatorScore !== null ? `Curator ${movie.curatorScore}/100` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
              {movie.curatorNote && (
                <section className="detail-section">
                  <h3>Curator’s note</h3>
                  <p>{movie.curatorNote}</p>
                </section>
              )}
              {movie.cast.length > 0 && (
                <section className="detail-section">
                  <h3>Cast</h3>
                  <p>{movie.cast.join(', ')}</p>
                </section>
              )}
              {movie.awards.length > 0 && (
                <section className="detail-section">
                  <h3>Awards</h3>
                  <ul>
                    {movie.awards.map((award, index) => (
                      <li key={`${award}-${index}`}>{award}</li>
                    ))}
                  </ul>
                </section>
              )}
              {specs.length > 0 && (
                <section className="detail-section">
                  <h3>Technical specifications</h3>
                  <dl className="spec-grid">
                    {specs.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
              <section className="detail-section">
                <h3>Where to watch</h3>
                {movie.streamPlatforms.length ? (
                  <div className="provider-list">
                    {movie.streamPlatforms.map((provider, index) => {
                      const url = safeExternalUrl(provider.url);
                      return url ? (
                        <div key={`${provider.name}-${index}`}>
                          <a
                            className="button subtle"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {provider.name}
                            {provider.region ? ` · ${provider.region}` : ''}
                            <ExternalLink size={16} />
                          </a>
                          <p className="fine-print">
                            {provider.type.replaceAll('_', ' ')} · Availability checked{' '}
                            {new Date(provider.verifiedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="muted">No verified streaming links are currently available.</p>
                )}
                <p className="fine-print">
                  Provider availability, pricing, and account requirements may vary by region.
                </p>
              </section>
            </div>
          </>
        ))}
    </Dialog>
  );
}
