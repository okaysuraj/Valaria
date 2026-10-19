/** Compose the web screens; hooks own network and account state. */
import { useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroPremiere } from './components/HeroPremiere';
import { TasteEngine } from './components/TasteEngine';
import { CuratorBento } from './components/CuratorBento';
import { CatalogGrid } from './components/CatalogGrid';
import { MovieModal } from './components/MovieModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AccountModal } from './components/AccountModal';
import { Footer } from './components/Footer';

import { useCatalog } from './hooks/useCatalog';
import { useAccount } from './hooks/useAccount';
import { useToast } from './hooks/useToast';
import { Toast } from './components/Toast';

export default function App() {
  const [accountOpen, setAccountOpen] = useState(false);
  const { toast, notify } = useToast();
  const {
    catalog,
    catalogError,
    catalogLoading,
    retryCatalog,
    spotlight,
    selectSpotlight,
    moviesPage,
    moviesLoading,
    moviesError,
    retryMovies,
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
    retryDetails,
    reload,
  } = useCatalog();
  const openAccount = useCallback(() => setAccountOpen(true), []);
  const closeMovie = useCallback(() => setActiveMovie(null), [setActiveMovie]);
  const {
    user,
    authLoading,
    savedIds,
    savedSet,
    savedReady,
    savedError,
    profile,
    profileError,
    profileLoading,
    preferencePending,
    retryProfile,
    watchlistOpen,
    setWatchlistOpen,
    watchlistPage,
    setWatchlistOffset,
    watchlistLoading,
    watchlistError,
    retryWatchlist,
    pendingIds,
    clearing,
    confirmClear,
    setConfirmClear,
    toggleWatchlist,
    clearWatchlist,
    savePreference,
    openWatchlist,
  } = useAccount({
    notify,
    onSignIn: openAccount,
    onCloseMovie: closeMovie,
    setMood,
    setOffset,
    reloadCatalog: reload,
  });
  function focusSearch() {
    document.getElementById('catalog-search')?.focus();
  }
  return (
    <>
      <a className="skip-link" href="#catalog">
        Skip to catalog
      </a>
      <Navbar
        watchlistCount={authLoading || (user && !savedReady) ? null : savedIds.length}
        onOpenWatchlist={openWatchlist}
        onOpenSearch={focusSearch}
        onAccount={() => setAccountOpen(true)}
        signedIn={Boolean(user)}
      />
      <main>
        {savedError && user && (
          <div className="sync-banner" role="alert">
            <span>Watchlist sync unavailable: {savedError}</span>
            <button className="text-button" onClick={() => retryProfile()}>
              Retry account sync
            </button>
          </div>
        )}
        {catalogError && (
          <div className="sync-banner" role="alert">
            <span>Featured catalog unavailable: {catalogError}</span>
            <button className="text-button" onClick={() => retryCatalog()}>
              Retry featured catalog
            </button>
          </div>
        )}
        {catalogLoading ? (
          <section id="spotlight" className="hero hero-empty" aria-busy="true">
            <div className="hero-content">
              <p className="eyebrow">VALARIA</p>
              <h1>Discover your next film.</h1>
              <p role="status">Loading the catalog…</p>
            </div>
          </section>
        ) : (
          <HeroPremiere
            movie={spotlight}
            allSpotlights={catalog?.spotlights || []}
            onSelectMovie={selectSpotlight}
            onOpenModal={setActiveMovie}
            isWatchlisted={spotlight ? savedSet.has(spotlight.id) : false}
            onToggleWatchlist={toggleWatchlist}
            pending={spotlight ? pendingIds.has(spotlight.id) || clearing : false}
          />
        )}
        <TasteEngine
          moods={catalog?.moods || []}
          selectedMoodId={mood}
          onSelectMood={(id) => {
            if (user) void savePreference({ selectedMoodId: id || null });
            else {
              setMood(id);
              setOffset(0);
            }
          }}
          saving={preferencePending}
        />
        <CuratorBento movies={catalog?.curated || []} onSelectMovie={setActiveMovie} />
        <CatalogGrid
          movies={moviesPage.data}
          genres={catalog?.genres || []}
          watchlistIds={savedSet}
          pendingIds={pendingIds}
          onOpenMovie={setActiveMovie}
          onToggleWatchlist={toggleWatchlist}
          searchQuery={search}
          onSearchChange={(value) => {
            setSearch(value);
            setOffset(0);
          }}
          selectedGenre={genre}
          onGenreChange={(value) => {
            setGenre(value);
            setOffset(0);
          }}
          sort={sort}
          onSortChange={(value) => {
            setSort(value);
            setOffset(0);
          }}
          pagination={moviesPage.pagination}
          onPage={setOffset}
          loading={moviesLoading}
          error={moviesError}
          onRetry={() => retryMovies()}
        />
      </main>
      <Footer />
      <MovieModal
        movie={activeMovie}
        onClose={() => setActiveMovie(null)}
        isWatchlisted={activeMovie ? savedSet.has(activeMovie.id) : false}
        onToggleWatchlist={toggleWatchlist}
        pending={activeMovie ? pendingIds.has(activeMovie.id) || clearing : false}
        loading={detailLoading}
        error={detailError}
        onRetry={() => retryDetails()}
      />
      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        page={watchlistPage}
        onRemoveMovie={toggleWatchlist}
        onOpenMovie={(movie) => {
          setWatchlistOpen(false);
          setActiveMovie(movie);
        }}
        onClearWatchlist={clearWatchlist}
        onPage={setWatchlistOffset}
        loading={watchlistLoading}
        error={watchlistError}
        onRetry={() => retryWatchlist()}
        pendingIds={pendingIds}
        clearing={clearing}
        confirmedClear={confirmClear}
        onConfirmClear={setConfirmClear}
      />
      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={user}
        profile={profile}
        profileLoading={profileLoading}
        profileError={profileError}
        onRetryProfile={() => retryProfile()}
        onPreference={(value) => savePreference({ newsletterOptIn: value })}
        preferencePending={preferencePending}
      />
      <Toast message={toast} />
    </>
  );
}
