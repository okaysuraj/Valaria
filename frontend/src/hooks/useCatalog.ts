/** Catalog queries, browsing filters, and the selected movie's fresh details. */
import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client';
import type { Catalog, Movie, Page, SortOption } from '../types/movie';

const emptyPage = (): Page<Movie> => ({
  data: [],
  pagination: { offset: 0, limit: 24, total: 0, hasMore: false },
});

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [moviesPage, setMoviesPage] = useState<Page<Movie>>(emptyPage);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [sort, setSort] = useState<SortOption>('title');
  const [offset, setOffset] = useState(0);
  const [moviesVersion, setMoviesVersion] = useState(0);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailVersion, setDetailVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setCatalogLoading(true);
    setCatalogError(null);
    api
      .getCatalog(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setCatalog(data);
          setSpotlightId((previous) =>
            data.spotlights.some((movie) => movie.id === previous)
              ? previous
              : data.spotlights[0]?.id || null,
          );
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setCatalog(null);
          setCatalogError(errorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCatalogLoading(false);
      });
    return () => controller.abort();
  }, [catalogVersion]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const controller = new AbortController();
    setMoviesLoading(true);
    setMoviesError(null);
    api
      .getMovies({ search: debouncedSearch, genre, mood, sort, offset }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setMoviesPage(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setMoviesPage(emptyPage());
          setMoviesError(errorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setMoviesLoading(false);
      });
    return () => controller.abort();
  }, [debouncedSearch, genre, mood, sort, offset, moviesVersion]);

  useEffect(() => {
    if (!activeMovie) return;
    const controller = new AbortController();
    setDetailLoading(true);
    setDetailError(null);
    api
      .getMovie(activeMovie.id, controller.signal)
      .then((movie) => {
        if (!controller.signal.aborted) setActiveMovie(movie);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setDetailError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false);
      });
    return () => controller.abort();
  }, [activeMovie?.id, detailVersion]);

  const reload = useCallback(() => {
    setCatalogVersion((value) => value + 1);
    setMoviesVersion((value) => value + 1);
  }, []);
  return {
    catalog,
    catalogError,
    catalogLoading,
    retryCatalog: () => setCatalogVersion((value) => value + 1),
    spotlight: catalog?.spotlights.find((movie) => movie.id === spotlightId) || null,
    selectSpotlight: (movie: Movie) => setSpotlightId(movie.id),
    moviesPage,
    moviesLoading,
    moviesError,
    retryMovies: () => setMoviesVersion((value) => value + 1),
    search,
    setSearch,
    genre,
    setGenre,
    mood,
    setMood,
    sort,
    setSort,
    setOffset,
    activeMovie,
    setActiveMovie,
    detailLoading,
    detailError,
    retryDetails: () => setDetailVersion((value) => value + 1),
    reload,
  };
}
