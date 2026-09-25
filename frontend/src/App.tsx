import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroPremiere } from './components/HeroPremiere';
import { TasteEngine } from './components/TasteEngine';
import { CuratorBento } from './components/CuratorBento';
import { CatalogGrid } from './components/CatalogGrid';
import { MovieModal } from './components/MovieModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';
import { moviesList } from './data/moviesData';
import { Movie, GenreFilter } from './types/movie';
import { api } from './api/client';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  // Global App States
  const [movies, setMovies] = useState<Movie[]>(moviesList); // fallback to local data
  const [spotlightMovie, setSpotlightMovie] = useState<Movie>(moviesList[0]);
  const [activeModalMovie, setActiveModalMovie] = useState<Movie | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([
    'dune-part-two',
    'in-the-mood-for-love',
    'blade-runner-2049',
  ]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [selectedMoodId, setSelectedMoodId] = useState('dystopian-solitude');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('All');
  const [activeSection, setActiveSection] = useState('spotlight');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Load movies and watchlist from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedMovies, watchlistData] = await Promise.all([
          api.getMovies(),
          api.getWatchlist(),
        ]);

        if (fetchedMovies && fetchedMovies.length > 0) {
          setMovies(fetchedMovies);
          setSpotlightMovie(fetchedMovies[0]);
          setIsApiConnected(true);
        }

        if (watchlistData) {
          setWatchlistIds(watchlistData.map((w) => w.movieId));
        }
      } catch (err) {
        console.warn('[Valaria] Backend unavailable, using local data:', err);
      }
    };
    loadData();
  }, []);

  // Spotlight candidates for the hero carousel
  const spotlightCandidates = movies.filter((m) => m.featuredSpotlight || m.curatorScore >= 98).slice(0, 5);

  // Watchlist toggle handler — syncs with backend API
  const handleToggleWatchlist = useCallback(async (movie: Movie) => {
    if (watchlistIds.includes(movie.id)) {
      setWatchlistIds((prev) => prev.filter((id) => id !== movie.id));
      showToast(`Removed "${movie.title}" from Watchlist`);
      if (isApiConnected) {
        try { await api.removeFromWatchlist(movie.id); } catch {}
      }
    } else {
      setWatchlistIds((prev) => [...prev, movie.id]);
      showToast(`Added "${movie.title}" to Watchlist`);
      if (isApiConnected) {
        try { await api.addToWatchlist(movie.id); } catch {}
      }
    }
  }, [watchlistIds, isApiConnected]);

  const handleClearWatchlist = useCallback(async () => {
    setWatchlistIds([]);
    showToast('Watchlist cleared');
    if (isApiConnected) {
      try { await api.clearWatchlist(); } catch {}
    }
  }, [isApiConnected]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Scroll navigation helper
  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSearch = () => {
    handleNavigateSection('catalog');
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) input.focus();
  };

  const watchlistMovies = movies.filter((m) => watchlistIds.includes(m.id));

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F7F7F8] selection:bg-[#E5A93C] selection:text-black">
      {/* Floating Island Navigation */}
      <Navbar
        watchlistCount={watchlistIds.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenSearch={handleOpenSearch}
        onNavigateSection={handleNavigateSection}
        activeSection={activeSection}
      />

      {/* Main Content Area */}
      <main>
        {/* Monumental Premiere Spotlight Hero */}
        <HeroPremiere
          movie={spotlightMovie}
          allSpotlights={spotlightCandidates}
          onSelectMovie={(movie) => setSpotlightMovie(movie)}
          onOpenModal={(movie) => setActiveModalMovie(movie)}
          isWatchlisted={watchlistIds.includes(spotlightMovie.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />

        {/* The Taste Engine & Mood Matrix */}
        <TasteEngine
          selectedMoodId={selectedMoodId}
          onSelectMood={(moodId) => setSelectedMoodId(moodId)}
          movies={movies}
          onOpenMovie={(movie) => setActiveModalMovie(movie)}
          watchlistIds={watchlistIds}
          onToggleWatchlist={handleToggleWatchlist}
        />

        {/* Curator Bento Grid & Technical Restorations */}
        <CuratorBento
          movies={movies}
          onSelectMovie={(movie) => {
            setSpotlightMovie(movie);
            handleNavigateSection('spotlight');
          }}
        />

        {/* Curated Catalog & Archive Grid */}
        <CatalogGrid
          movies={movies}
          onOpenMovie={(movie) => setActiveModalMovie(movie)}
          watchlistIds={watchlistIds}
          onToggleWatchlist={handleToggleWatchlist}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />
      </main>

      {/* Architectural Minimalist Footer */}
      <Footer />

      {/* Detailed Movie Modal with Trailer & Specs */}
      <MovieModal
        movie={activeModalMovie}
        onClose={() => setActiveModalMovie(null)}
        isWatchlisted={activeModalMovie ? watchlistIds.includes(activeModalMovie.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistMovies={watchlistMovies}
        onRemoveMovie={handleToggleWatchlist}
        onOpenMovie={(movie) => {
          setIsWatchlistOpen(false);
          setActiveModalMovie(movie);
        }}
        onClearWatchlist={handleClearWatchlist}
      />

      {/* Transient Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#14141B]/95 backdrop-blur-xl border border-white/15 shadow-2xl text-xs font-mono text-white flex items-center gap-2.5 animate-[fadeIn_200ms_ease-out]">
          <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

