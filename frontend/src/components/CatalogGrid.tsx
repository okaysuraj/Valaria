/** Render catalog filters, query feedback, movie cards, and pagination. */
import type { Movie, Pagination, SortOption } from '../types/movie';
import { MovieCard } from './MovieCard';

export function PageControls({
  pagination,
  onPage,
  disabled = false,
}: {
  pagination: Pagination;
  onPage: (offset: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="page-controls" aria-label="Pagination">
      <button
        className="button subtle"
        disabled={disabled || pagination.offset === 0}
        onClick={() => onPage(Math.max(0, pagination.offset - pagination.limit))}
      >
        Previous
      </button>
      <span className="muted">
        {pagination.total
          ? `${pagination.offset + 1}–${Math.min(pagination.offset + pagination.limit, pagination.total)} of ${pagination.total}`
          : '0 films'}
      </span>
      <button
        className="button subtle"
        disabled={disabled || !pagination.hasMore}
        onClick={() => onPage(pagination.offset + pagination.limit)}
      >
        Next
      </button>
    </div>
  );
}
export function CatalogGrid({
  movies,
  genres,
  watchlistIds,
  pendingIds,
  onOpenMovie,
  onToggleWatchlist,
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  sort,
  onSortChange,
  pagination,
  onPage,
  loading,
  error,
  onRetry,
}: {
  movies: Movie[];
  genres: string[];
  watchlistIds: Set<string>;
  pendingIds: Set<string>;
  onOpenMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  pagination: Pagination;
  onPage: (offset: number) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <section id="catalog" className="section" aria-labelledby="catalog-heading">
      <div className="section-heading">
        <h2 id="catalog-heading">Explore the catalog.</h2>
        <p className="muted">Search for a title, filmmaker, or story.</p>
      </div>
      <div className="catalog-filters">
        <label className="search-field">
          Search films
          <input
            id="catalog-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search the catalog"
            maxLength={200}
          />
        </label>
        <label>
          Genre
          <select value={selectedGenre} onChange={(event) => onGenreChange(event.target.value)}>
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(event) => onSortChange(event.target.value as SortOption)}>
            <option value="title">Title A–Z</option>
            <option value="year">Newest first</option>
            <option value="runtime">Runtime</option>
            <option value="curator">Curator score</option>
          </select>
        </label>
      </div>
      <div aria-live="polite" aria-busy={loading}>
        {error ? (
          <div className="status-box" role="alert">
            <h3>Catalog unavailable</h3>
            <p>{error}</p>
            <button className="button primary" onClick={onRetry}>
              Retry catalog
            </button>
          </div>
        ) : loading ? (
          <p className="status-box" role="status">
            Loading films…
          </p>
        ) : movies.length ? (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                saved={watchlistIds.has(movie.id)}
                pending={pendingIds.has(movie.id)}
                onOpen={onOpenMovie}
                onSave={onToggleWatchlist}
              />
            ))}
          </div>
        ) : (
          <div className="status-box">
            <h3>No films found</h3>
            <p>Try another search or filter. Published films will appear here when available.</p>
          </div>
        )}
      </div>
      <PageControls pagination={pagination} onPage={onPage} disabled={loading || Boolean(error)} />
    </section>
  );
}
