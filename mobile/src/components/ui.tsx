/** Shared native colors, styles, buttons, images, cards, and query feedback. */
import { memo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import type { Movie } from '../types/movie';

export const colors = {
  background: '#08080A',
  panel: '#141419',
  line: '#292930',
  text: '#F5F3EC',
  muted: '#A8A6AE',
  gold: '#E5A93C',
  error: '#F1A5A5',
};
export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  section: { padding: 20, gap: 12 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.7 },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700' },
  eyebrow: { color: colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.7 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 23 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  input: {
    backgroundColor: colors.panel,
    color: colors.text,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    minHeight: 48,
    fontSize: 16,
  },
  error: { color: colors.error, fontSize: 14, lineHeight: 21 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
});

export function Button({
  label,
  onPress,
  disabled = false,
  primary = false,
  selected = false,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
  selected?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary && styles.primary,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          primary && { color: colors.background },
          selected && { color: colors.gold },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function StateView({
  loading,
  error,
  title,
  detail,
  onRetry,
}: {
  loading?: boolean;
  error?: string | null;
  title?: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.state} accessibilityLiveRegion="polite">
      {loading ? (
        <>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={ui.body}>Loading from the archive…</Text>
        </>
      ) : (
        <>
          <Text style={ui.heading}>{error ? 'Unable to load' : title || 'Nothing here yet'}</Text>
          {error || detail ? (
            <Text style={[ui.body, { textAlign: 'center' }]}>{error || detail}</Text>
          ) : null}
          {onRetry && <Button label="Retry" onPress={onRetry} />}
        </>
      )}
    </View>
  );
}

export function Artwork({
  uri,
  title,
  style,
  id,
}: {
  uri: string | null;
  title: string;
  style: ViewStyle;
  id: string;
}) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  return uri && failedUri !== uri ? (
    <Image
      source={{ uri }}
      style={style as ImageStyle}
      contentFit="cover"
      cachePolicy="disk"
      allowDownscaling
      enforceEarlyResizing
      recyclingKey={id}
      transition={0}
      accessibilityLabel={`${title} artwork`}
      onError={() => setFailedUri(uri)}
    />
  ) : (
    <View style={[style, styles.artworkEmpty]}>
      <Text style={[ui.body, { textAlign: 'center', padding: 12 }]}>Artwork unavailable</Text>
    </View>
  );
}

export const MovieCard = memo(function MovieCard({
  movie,
  saved,
  onOpen,
  onSave,
  showNote = false,
}: {
  movie: Movie;
  saved: boolean;
  onOpen: (movie: Movie) => void;
  onSave: (movie: Movie) => void;
  showNote?: boolean;
}) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${movie.title}`}
        onPress={() => onOpen(movie)}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Artwork
          uri={movie.poster || movie.backdrop}
          title={movie.title}
          id={movie.id}
          style={styles.poster}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {[movie.year, movie.runtime].filter(Boolean).join(' · ') || 'Details not supplied'}
          </Text>
          {movie.director && (
            <Text style={styles.cardMeta} numberOfLines={1}>
              {movie.director}
            </Text>
          )}
          {movie.curatorScore !== null && (
            <Text style={styles.score}>Curator {movie.curatorScore}/100</Text>
          )}
          {movie.matchScore !== null && <Text style={styles.score}>{movie.matchScore}% match</Text>}
          {showNote && movie.curatorNote && (
            <Text style={styles.cardMeta}>{movie.curatorNote}</Text>
          )}
        </View>
      </Pressable>
      <Button
        label={saved ? 'Remove saved' : 'Save film'}
        onPress={() => onSave(movie)}
        selected={saved}
        style={{ margin: 10, marginTop: 0 }}
      />
    </View>
  );
});

export async function openExternal(url: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password)
    throw new Error('This link is unavailable.');
  await Linking.openURL(parsed.toString());
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202027',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
  },
  primary: { backgroundColor: colors.text, borderColor: colors.text },
  selected: { borderColor: colors.gold, backgroundColor: '#292217' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  buttonText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  state: { padding: 32, gap: 16, alignItems: 'center', justifyContent: 'center', minHeight: 230 },
  artworkEmpty: { backgroundColor: '#202027', justifyContent: 'center', alignItems: 'center' },
  card: {
    flex: 1,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    overflow: 'hidden',
  },
  poster: { width: '100%', aspectRatio: 2 / 3 },
  cardBody: { padding: 12, gap: 5, minHeight: 114 },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  cardMeta: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  score: { color: colors.gold, fontSize: 11 },
});
