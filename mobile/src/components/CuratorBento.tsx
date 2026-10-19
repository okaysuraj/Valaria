/** Display the published editorial collection in a native list. */
import { FlatList, Text, View, useWindowDimensions } from 'react-native';
import type { Movie } from '../types/movie';
import type { CollectionProps } from './CatalogGrid';
import { MovieCard, StateView, ui } from './ui';

export function CuratorBento({
  movies,
  savedIds,
  onOpenMovie,
  onToggleWatchlist,
}: CollectionProps & { movies: Movie[] }) {
  const { width } = useWindowDimensions();
  const columns = width >= 760 ? 4 : 2;
  return (
    <FlatList
      key={columns}
      style={ui.screen}
      data={movies}
      numColumns={columns}
      keyExtractor={(movie) => movie.id}
      extraData={savedIds}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
      ListHeaderComponent={
        <View style={ui.section}>
          <Text style={ui.eyebrow}>THE CURATOR VAULT</Text>
          <Text style={ui.title}>Curated selections</Text>
          <Text style={ui.body}>
            Published editorial selections from the archive. Open a film to read its curator note
            and available technical metadata.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ width: (width - 40 - 12 * (columns - 1)) / columns }}>
          <MovieCard
            movie={item}
            saved={savedIds.has(item.id)}
            onOpen={onOpenMovie}
            onSave={onToggleWatchlist}
            showNote
          />
        </View>
      )}
      ListEmptyComponent={
        <StateView
          title="No curated selections yet"
          detail="Editorial selections will appear after they are published."
        />
      }
    />
  );
}
