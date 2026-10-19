/** Present the active spotlight and let readers browse other featured films. */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Movie } from '../types/movie';
import { Artwork, Button, StateView, ui } from './ui';

interface Props {
  movie: Movie | null;
  allSpotlights: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onOpenModal: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
}
export function HeroPremiere({
  movie,
  allSpotlights,
  onSelectMovie,
  onOpenModal,
  isWatchlisted,
  onToggleWatchlist,
}: Props) {
  if (!movie)
    return (
      <StateView
        title="No spotlight published yet"
        detail="Published spotlight selections will appear here."
      />
    );
  return (
    <View>
      <Artwork
        uri={movie.backdrop || movie.poster}
        title={movie.title}
        id={movie.id}
        style={styles.artwork}
      />
      <View style={ui.section}>
        <Text style={ui.eyebrow}>CURATOR SPOTLIGHT</Text>
        <Text style={[ui.title, { fontSize: 36 }]}>{movie.title}</Text>
        <Text style={ui.body}>
          {[movie.director, movie.year, movie.runtime, movie.rating].filter(Boolean).join(' · ')}
        </Text>
        {movie.tagline || movie.synopsis ? (
          <Text style={ui.body}>{movie.tagline || movie.synopsis}</Text>
        ) : null}
        <View style={ui.row}>
          <Button primary label="View film" onPress={() => onOpenModal(movie)} />
          <Button
            label={isWatchlisted ? 'Remove saved' : 'Save film'}
            selected={isWatchlisted}
            onPress={() => onToggleWatchlist(movie)}
          />
        </View>
        <Text style={ui.eyebrow}>SPOTLIGHT SELECTIONS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {allSpotlights.map((item) => (
            <Button
              key={item.id}
              label={item.title}
              selected={item.id === movie.id}
              onPress={() => onSelectMovie(item)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({ artwork: { width: '100%', aspectRatio: 16 / 10 } });
