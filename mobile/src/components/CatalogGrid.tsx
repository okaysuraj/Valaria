/** Fetch and render filtered catalog pages in a virtualized native list. */
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { api } from '../api/client';
import { useRequest } from '../hooks/useRequest';
import type { Movie, SortOption } from '../types/movie';
import { Button, colors, MovieCard, StateView, ui } from './ui';

export interface CollectionProps {
  savedIds: ReadonlySet<string>;
  onOpenMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
}
interface CatalogGridProps extends CollectionProps {
  genres: string[];
  mood?: string;
  heading?: React.ReactElement;
  activeMoodLabel?: string;
  onClearMood?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export function CatalogGrid({
  genres,
  mood,
  heading,
  activeMoodLabel,
  onClearMood,
  savedIds,
  onOpenMovie,
  onToggleWatchlist,
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
}: CatalogGridProps) {
  const [sort, setSort] = useState<SortOption>('title');
  const listRef = useRef<FlatList<Movie>>(null);
  const [page, setPage] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const { width } = useWindowDimensions();
  const columns = width >= 760 ? 4 : width >= 540 ? 3 : 2;
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  // Scope the page to its filters so changing filters never requests a stale offset.
  const filterKey = JSON.stringify([debouncedSearch, selectedGenre, sort, mood]);
  const [pageScope, setPageScope] = useState(filterKey);
  const currentPage = pageScope === filterKey ? page : 0;
  useEffect(
    () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
    [currentPage, filterKey],
  );
  useEffect(() => {
    setPage(0);
    setPageScope(filterKey);
  }, [filterKey]);
  const result = useRequest(`${filterKey}:${currentPage}`, (signal) =>
    api.movies(
      {
        search: debouncedSearch,
        genre: selectedGenre,
        sort,
        mood,
        limit: 24,
        offset: currentPage * 24,
      },
      signal,
    ),
  );
  const listHeader = (
    <View style={ui.section}>
      {heading || (
        <>
          <Text style={ui.eyebrow}>THE LIVING ARCHIVE</Text>
          <Text style={ui.title}>Film catalog</Text>
          <Text style={ui.body}>
            Explore the published catalog by title, director, theme and genre.
          </Text>
        </>
      )}
      {activeMoodLabel && onClearMood && (
        <View style={{ gap: 8 }}>
          <Text style={ui.body}>Mood: {activeMoodLabel}</Text>
          <Button label="Clear mood filter" onPress={onClearMood} />
        </View>
      )}
      <TextInput
        style={ui.input}
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Search title, director, theme…"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Search film catalog"
        returnKeyType="search"
        autoCorrect={false}
        maxLength={200}
      />
      {searchQuery.length > 0 && <Button label="Clear search" onPress={() => onSearchChange('')} />}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {['All', ...genres].map((genre) => (
          <Button
            key={genre}
            label={genre}
            selected={genre === selectedGenre}
            onPress={() => onGenreChange(genre)}
          />
        ))}
      </ScrollView>
      <Text style={ui.eyebrow}>SORT BY</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {(
          [
            ['title', 'Title'],
            ['curator', 'Curator score'],
            ['year', 'Newest'],
            ['runtime', 'Runtime'],
          ] as const
        ).map(([key, label]) => (
          <Button key={key} label={label} selected={sort === key} onPress={() => setSort(key)} />
        ))}
      </ScrollView>
      {result.data && (
        <Text style={ui.body}>
          {result.data.pagination.total} {result.data.pagination.total === 1 ? 'film' : 'films'} ·
          Page {currentPage + 1} of {Math.max(1, Math.ceil(result.data.pagination.total / 24))}
        </Text>
      )}
    </View>
  );
  return (
    <FlatList
      ref={listRef}
      key={columns}
      data={result.data?.data || []}
      numColumns={columns}
      keyExtractor={(movie) => movie.id}
      style={ui.screen}
      columnWrapperStyle={{ paddingHorizontal: 20, gap: 12 }}
      contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
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
      extraData={savedIds}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        <StateView
          loading={result.loading}
          error={result.error}
          title="No films found"
          detail="Try another search or filter. Only published database entries appear here."
          onRetry={result.error ? result.reload : undefined}
        />
      }
      ListFooterComponent={
        result.data && result.data.pagination.total > 24 ? (
          <View style={[ui.row, { padding: 20, justifyContent: 'space-between' }]}>
            <Button
              label="Previous page"
              disabled={currentPage === 0 || result.loading}
              onPress={() => setPage((value) => Math.max(0, value - 1))}
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
