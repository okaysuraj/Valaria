import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  LayoutChangeEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { HeroPremiere } from './src/components/HeroPremiere';
import { TasteEngine } from './src/components/TasteEngine';
import { CuratorBento } from './src/components/CuratorBento';
import { CatalogGrid } from './src/components/CatalogGrid';
import { MovieModal } from './src/components/MovieModal';
import { WatchlistModal } from './src/components/WatchlistModal';
import { Toast } from './src/components/Toast';
import { Footer } from './src/components/Footer';

import { moviesList } from './src/data/moviesData';
import { Movie, GenreFilter, AppTab } from './src/types/movie';
import { api } from './src/api/client';

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
  const [activeTab, setActiveTab] = useState<AppTab>('spotlight');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Section coordinates for smooth anchor scrolling
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<{ [key: string]: number }>({
    spotlight: 0,
    taste: 0,
    vault: 0,
    catalog: 0,
  });

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

  const spotlightCandidates = movies
    .filter((m) => m.featuredSpotlight || m.curatorScore >= 98)
    .slice(0, 5);

  // Watchlist Actions — syncs with backend API
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


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Section navigation helper
  const navigateToSection = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab === 'watchlist') {
      setIsWatchlistOpen(true);
      return;
    }

    const yPos = sectionPositions.current[tab];
    if (yPos !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, yPos - 10), animated: true });
    }
  };

  const handleOpenSearch = () => {
    navigateToSection('catalog');
  };

  const watchlistMovies = movies.filter((m) => watchlistIds.includes(m.id));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <View style={styles.container}>
          {/* Top Status & Brand Header */}
          <Header
            watchlistCount={watchlistIds.length}
            onOpenWatchlist={() => setIsWatchlistOpen(true)}
            onOpenSearch={handleOpenSearch}
          />

          {/* Main Continuous Curated Stream */}
          <ScrollView
            ref={scrollRef}
            style={styles.mainScrollView}
            contentContainerStyle={styles.mainScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Monumental Premiere Spotlight Section */}
            <View
              onLayout={(e: LayoutChangeEvent) => {
                sectionPositions.current.spotlight = e.nativeEvent.layout.y;
              }}
            >
              <HeroPremiere
                movie={spotlightMovie}
                allSpotlights={spotlightCandidates}
                onSelectMovie={(movie) => setSpotlightMovie(movie)}
                onOpenModal={(movie) => setActiveModalMovie(movie)}
                isWatchlisted={watchlistIds.includes(spotlightMovie.id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            </View>

            {/* The Taste Engine & Mood Matrix */}
            <View
              onLayout={(e: LayoutChangeEvent) => {
                sectionPositions.current.taste = e.nativeEvent.layout.y;
              }}
            >
              <TasteEngine
                selectedMoodId={selectedMoodId}
                onSelectMood={(moodId) => setSelectedMoodId(moodId)}
                movies={movies}
                onOpenMovie={(movie) => setActiveModalMovie(movie)}
                watchlistIds={watchlistIds}
                onToggleWatchlist={handleToggleWatchlist}
              />
            </View>

            {/* Curator Vault & Optical Lab */}
            <View
              onLayout={(e: LayoutChangeEvent) => {
                sectionPositions.current.vault = e.nativeEvent.layout.y;
              }}
            >
              <CuratorBento
                movies={movies}
                onSelectMovie={(movie) => {
                  setSpotlightMovie(movie);
                  navigateToSection('spotlight');
                }}
              />
            </View>

            {/* Curated Archive Catalog Grid */}
            <View
              onLayout={(e: LayoutChangeEvent) => {
                sectionPositions.current.catalog = e.nativeEvent.layout.y;
              }}
            >
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
            </View>

            {/* Architectural Footer */}
            <Footer />
          </ScrollView>

          {/* Bottom Floating Navigation Tab Bar */}
          <BottomTabBar
            activeTab={activeTab}
            onSelectTab={navigateToSection}
            watchlistCount={watchlistIds.length}
          />

          {/* Detailed Movie Modal with 4K Trailer & Specs */}
          <MovieModal
            movie={activeModalMovie}
            onClose={() => setActiveModalMovie(null)}
            isWatchlisted={
              activeModalMovie ? watchlistIds.includes(activeModalMovie.id) : false
            }
            onToggleWatchlist={handleToggleWatchlist}
          />

          {/* Watchlist Sheet / Modal with Taste DNA */}
          <WatchlistModal
            isOpen={isWatchlistOpen}
            onClose={() => setIsWatchlistOpen(false)}
            watchlistMovies={watchlistMovies}
            onRemoveMovie={handleToggleWatchlist}
            onOpenMovie={(movie) => setActiveModalMovie(movie)}
            onClearWatchlist={handleClearWatchlist}
          />

          {/* Floating Toast Notification */}
          <Toast message={toastMessage} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08080A',
  },
  container: {
    flex: 1,
    backgroundColor: '#08080A',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 20,
  },
});
