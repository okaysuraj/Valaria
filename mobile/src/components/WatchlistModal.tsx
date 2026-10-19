/** Load saved-film pages and confirm clearing the watchlist. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Text, View, useWindowDimensions } from 'react-native';
import { api } from '../api/client';
import type { Movie } from '../types/movie';
import { useRequest } from '../hooks/useRequest';
import type { CollectionProps } from './CatalogGrid';
import { Button, MovieCard, StateView, ui } from './ui';

interface Props extends CollectionProps {
  userId: string | null;
  revision: number;
  onClear: () => Promise<void>;
}
export function WatchlistModal({
  userId,
  revision,
  onClear,
  savedIds,
  onOpenMovie,
  onToggleWatchlist,
}: Props) {
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList<Movie>>(null);
  const [clearing, setClearing] = useState(false);
  const { width } = useWindowDimensions();
  const columns = width >= 760 ? 4 : 2;
  const result = useRequest(
    `${userId}:${page}:${revision}`,
    (signal) => api.watchlist(page * 24, signal),
    Boolean(userId),
  );
  useEffect(() => listRef.current?.scrollToOffset({ offset: 0, animated: false }), [page]);
  useEffect(() => {
    if (page > 0 && result.data && result.data.data.length === 0) setPage((value) => value - 1);
  }, [page, result.data]);
  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    result.data?.data.forEach((movie) =>
      movie.genres.forEach((genre) => counts.set(genre, (counts.get(genre) || 0) + 1)),
    );
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [result.data]);
  if (!userId)
    return (
      <StateView
        title="Your personal watchlist"
        detail="Sign in to save films and sync them across web and mobile."
        onRetry={undefined}
      />
    );
  const confirmClear = () =>
    Alert.alert(
      'Clear your watchlist?',
      'This removes all saved films from your account on every device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear watchlist',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await onClear();
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  return (
    <FlatList
      ref={listRef}
      key={columns}
      style={ui.screen}
      data={result.data?.data || []}
      numColumns={columns}
      keyExtractor={(movie) => movie.id}
      extraData={savedIds}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
      contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
      ListHeaderComponent={
        <View style={ui.section}>
          <Text style={ui.eyebrow}>YOUR SAVED FILMS</Text>
          <Text style={ui.title}>Watchlist</Text>
          {result.data && (
            <Text style={ui.body}>
              {result.data.pagination.total} saved · Page {page + 1} of{' '}
              {Math.max(1, Math.ceil(result.data.pagination.total / 24))}
            </Text>
          )}
          {genres.length > 0 && (
            <>
              <Text style={ui.heading}>Genres on this page</Text>
              <Text style={ui.body}>
                {genres.map(([genre, count]) => `${genre} (${count})`).join(' · ')}
              </Text>
            </>
          )}
          {savedIds.size > 0 && (
            <Button
              label={clearing ? 'Clearing…' : 'Clear watchlist'}
              disabled={clearing}
              onPress={confirmClear}
            />
          )}
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ width: (width - 40 - 12 * (columns - 1)) / columns }}>
          <MovieCard
            movie={item}
            saved={savedIds.has(item.id)}
            onOpen={onOpenMovie}
            onSave={onToggleWatchlist}
          />
        </View>
      )}
      ListEmptyComponent={
        <StateView
          loading={result.loading}
          error={result.error}
          title="No saved films yet"
          detail="Explore the catalog and save a film to start your watchlist."
          onRetry={result.error ? result.reload : undefined}
        />
      }
      ListFooterComponent={
        result.data && result.data.pagination.total > 24 ? (
          <View style={[ui.row, { padding: 20, justifyContent: 'space-between' }]}>
            <Button
              label="Previous page"
              disabled={page === 0 || result.loading}
              onPress={() => setPage((value) => value - 1)}
            />
            <Button
              label="Next page"
              disabled={!result.data.pagination.hasMore || result.loading}
              onPress={() => setPage((value) => value + 1)}
            />
          </View>
        ) : null
      }
    />
  );
}
