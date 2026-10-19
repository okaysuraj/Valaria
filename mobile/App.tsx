/** Compose native navigation and screens; account operations live in useAccount. */
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { HeroPremiere } from './src/components/HeroPremiere';
import { TasteEngine } from './src/components/TasteEngine';
import { CuratorBento } from './src/components/CuratorBento';
import { CatalogGrid } from './src/components/CatalogGrid';
import { MovieModal } from './src/components/MovieModal';
import { WatchlistModal } from './src/components/WatchlistModal';
import { AuthModal } from './src/components/AuthModal';
import { Toast } from './src/components/Toast';
import { Footer } from './src/components/Footer';
import { Button, StateView, ui } from './src/components/ui';
import type { AppTab, Movie } from './src/types/movie';
import { api } from './src/api/client';
import { auth } from './src/api/firebase';
import { useRequest } from './src/hooks/useRequest';

import { useAccount } from './src/hooks/useAccount';
import { useToast } from './src/hooks/useToast';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('spotlight');
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [movieId, setMovieId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const { toast, showMessage, clearMessage } = useToast();
  const onAccountChange = useCallback(() => {
    setMovieId(null);
    clearMessage();
  }, [clearMessage]);
  const {
    user,
    authReady,
    authOpen,
    setAuthOpen,
    savedIds,
    watchlistRevision,
    profile,
    profileBusy,
    preferenceError,
    setPreferenceError,
    selectedMoodId,
    account,
    toggleWatchlist,
    clearWatchlist,
    updatePreferences,
  } = useAccount({ showMessage, onAccountChange });
  const catalog = useRequest('catalog', (signal) => api.catalog(signal));
  useEffect(() => {
    let lastRefresh = Date.now();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && Date.now() - lastRefresh > 30_000) {
        lastRefresh = Date.now();
        catalog.reload();
        const signedInUser = auth?.currentUser;
        if (signedInUser)
          void signedInUser
            .reload()
            .then(() => signedInUser.getIdToken(true))
            .catch(() => account.reload());
      }
    });
    return () => subscription.remove();
  }, [catalog.reload, account.reload]);

  const data = catalog.data;
  const watchlistCount = !authReady || (user && !profile) ? null : savedIds.size;
  const spotlight =
    data?.spotlights.find((movie) => movie.id === spotlightId) || data?.spotlights[0] || null;
  const collectionProps = {
    savedIds,
    onOpenMovie: (movie: Movie) => setMovieId(movie.id),
    onToggleWatchlist: toggleWatchlist,
  };
  const filterProps = {
    searchQuery: search,
    onSearchChange: setSearch,
    selectedGenre: genre,
    onGenreChange: setGenre,
  };
  let screen: React.ReactNode;
  if (activeTab === 'watchlist' && !user) {
    screen = (
      <View style={ui.screen}>
        <StateView
          title="Your personal watchlist"
          detail={
            authReady
              ? 'Sign in to save films and sync them across web and mobile.'
              : 'Restoring your account…'
          }
        />
        <View style={ui.section}>
          <Button primary label="Sign in" disabled={!authReady} onPress={() => setAuthOpen(true)} />
        </View>
      </View>
    );
  } else if (activeTab === 'watchlist') {
    screen = (
      <WatchlistModal
        {...collectionProps}
        userId={user?.uid || null}
        revision={watchlistRevision}
        onClear={clearWatchlist}
      />
    );
  } else if (!data) {
    screen = (
      <View style={ui.screen}>
        <StateView
          loading={catalog.loading}
          error={catalog.error}
          onRetry={catalog.error ? catalog.reload : undefined}
        />
      </View>
    );
  } else if (activeTab === 'catalog') {
    screen = (
      <CatalogGrid
        {...collectionProps}
        {...filterProps}
        genres={data.genres}
        mood={selectedMoodId || undefined}
        activeMoodLabel={data.moods.find((mood) => mood.id === selectedMoodId)?.label}
        onClearMood={() => void updatePreferences({ selectedMoodId: null })}
      />
    );
  } else if (activeTab === 'taste') {
    screen = (
      <TasteEngine
        {...collectionProps}
        {...filterProps}
        genres={data.genres}
        moods={data.moods}
        selectedMoodId={selectedMoodId}
        onSelectMood={(id) => void updatePreferences({ selectedMoodId: id })}
      />
    );
  } else if (activeTab === 'vault') {
    screen = <CuratorBento {...collectionProps} movies={data.curated} />;
  } else {
    screen = (
      <ScrollView style={ui.screen} contentContainerStyle={{ paddingBottom: 20 }}>
        <HeroPremiere
          movie={spotlight}
          allSpotlights={data.spotlights}
          onSelectMovie={(movie) => setSpotlightId(movie.id)}
          onOpenModal={(movie) => setMovieId(movie.id)}
          isWatchlisted={Boolean(spotlight && savedIds.has(spotlight.id))}
          onToggleWatchlist={toggleWatchlist}
        />
        <View style={ui.section}>
          <Text style={ui.heading}>Explore the archive</Text>
          <Text style={ui.body}>
            {data.total} published {data.total === 1 ? 'film' : 'films'}. Discover selections by
            mood or explore the full catalog.
          </Text>
          <View style={ui.row}>
            <Button label="Explore moods" onPress={() => setActiveTab('taste')} />
            <Button label="Curator vault" onPress={() => setActiveTab('vault')} />
          </View>
          <Button label="Refresh archive" onPress={catalog.reload} />
        </View>
        <Footer
          profile={profile}
          signedIn={Boolean(user)}
          busy={profileBusy}
          onOptIn={(value) => void updatePreferences({ newsletterOptIn: value })}
          onCatalog={() => setActiveTab('catalog')}
          onSignIn={() => setAuthOpen(true)}
        />
      </ScrollView>
    );
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={ui.screen}>
        <StatusBar style="light" />
        <Header
          watchlistCount={watchlistCount}
          onOpenWatchlist={() => setActiveTab('watchlist')}
          onOpenSearch={() => setActiveTab('catalog')}
          onOpenAccount={() => setAuthOpen(true)}
          signedIn={Boolean(user)}
        />
        {user && account.error && (
          <View style={[ui.section, { paddingVertical: 8 }]}>
            <Text style={ui.error}>{account.error}</Text>
            <Button label="Retry account sync" onPress={account.reload} />
          </View>
        )}
        {screen}
        <BottomTabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          watchlistCount={watchlistCount}
        />
        <MovieModal
          movieId={movieId}
          onClose={() => setMovieId(null)}
          {...collectionProps}
          onError={showMessage}
        />
        <AuthModal
          open={authOpen}
          user={user}
          onClose={() => setAuthOpen(false)}
          onMessage={showMessage}
          profile={profile}
          profileLoading={account.loading}
          profileError={account.error || preferenceError}
          preferencePending={profileBusy}
          onRetryProfile={() => {
            setPreferenceError(null);
            account.reload();
          }}
          onPreference={(value) => void updatePreferences({ newsletterOptIn: value })}
        />
        <Toast message={toast} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
