/** Present saved films, page navigation, and confirmed watchlist clearing. */
import type { Movie, Page } from '../types/movie';
import { Dialog } from './Dialog';
import { MovieCard } from './MovieCard';
import { PageControls } from './CatalogGrid';
import { useMemo } from 'react';

export function WatchlistDrawer({
  isOpen,
  onClose,
  page,
  onRemoveMovie,
  onOpenMovie,
  onClearWatchlist,
  onPage,
  loading,
  error,
  onRetry,
  pendingIds,
  clearing,
  confirmedClear,
  onConfirmClear,
}: {
  isOpen: boolean;
  onClose: () => void;
  page: Page<Movie>;
  onRemoveMovie: (movie: Movie) => void;
  onOpenMovie: (movie: Movie) => void;
  onClearWatchlist: () => void;
  onPage: (offset: number) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  pendingIds: Set<string>;
  clearing: boolean;
  confirmedClear: boolean;
  onConfirmClear: (value: boolean) => void;
}) {
  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    page.data.forEach((movie) =>
      movie.genres.forEach((genre) => counts.set(genre, (counts.get(genre) || 0) + 1)),
    );
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [page.data]);
  return (
    <Dialog open={isOpen} title="Your watchlist" onClose={onClose} wide>
      <div className="detail-content">
        <p className="muted">Saved to your account, available on web and mobile.</p>
        {!loading && !error && genres.length > 0 && (
          <div className="detail-section">
            <h3>Genres on this page</h3>
            <p className="muted">
              {genres.map(([genre, count]) => `${genre} (${count})`).join(' · ')}
            </p>
          </div>
        )}
        {error ? (
          <div role="alert" className="status-box">
            <p>{error}</p>
            <button className="button primary" onClick={onRetry}>
              Retry watchlist
            </button>
          </div>
        ) : loading ? (
          <p role="status" className="status-box">
            Loading your watchlist…
          </p>
        ) : page.data.length ? (
          <div className="movie-grid watchlist-grid">
            {page.data.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                saved
                pending={pendingIds.has(movie.id) || clearing}
                onOpen={onOpenMovie}
                onSave={onRemoveMovie}
              />
            ))}
          </div>
        ) : (
          <div className="status-box">
            <h3>Your next film starts here.</h3>
            <p>Save a film from the catalog to keep it in your watchlist.</p>
          </div>
        )}
        <PageControls
          pagination={page.pagination}
          onPage={onPage}
          disabled={loading || clearing || Boolean(error)}
        />
        {page.pagination.total > 0 && (
          <div className="clear-watchlist">
            {confirmedClear ? (
              <>
                <p>Remove every film from your watchlist?</p>
                <div className="button-row">
                  <button
                    className="button danger"
                    disabled={clearing || pendingIds.size > 0}
                    onClick={onClearWatchlist}
                  >
                    {clearing ? 'Clearing…' : 'Remove all films'}
                  </button>
                  <button
                    className="button subtle"
                    onClick={() => onConfirmClear(false)}
                    disabled={clearing}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button className="text-button" onClick={() => onConfirmClear(true)}>
                Clear watchlist
              </button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
