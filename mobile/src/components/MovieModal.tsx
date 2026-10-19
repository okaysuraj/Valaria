/** Fetch film details and open external trailers and regional provider links. */
import { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../api/client';
import { useRequest } from '../hooks/useRequest';
import type { Movie } from '../types/movie';
import { Artwork, Button, openExternal, StateView, ui } from './ui';

interface Props {
  movieId: string | null;
  onClose: () => void;
  savedIds: ReadonlySet<string>;
  onToggleWatchlist: (movie: Movie) => void;
  onError: (message: string) => void;
}
function verifiedTrailerId(movie: Movie | null): string | null {
  if (movie?.trailerId && /^[\w-]{11}$/.test(movie.trailerId)) return movie.trailerId;
  if (!movie?.trailerEmbedUrl) return null;
  try {
    const url = new URL(movie.trailerEmbedUrl);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      ![
        'www.youtube.com',
        'youtube.com',
        'www.youtube-nocookie.com',
        'youtube-nocookie.com',
      ].includes(url.hostname)
    )
      return null;
    return url.pathname.match(/^\/embed\/([\w-]{11})\/?$/)?.[1] || null;
  } catch {
    return null;
  }
}
export function MovieModal({ movieId, onClose, savedIds, onToggleWatchlist, onError }: Props) {
  const result = useRequest(
    movieId || '',
    (signal) => api.movie(movieId!, signal),
    Boolean(movieId),
  );
  const movie = result.data;
  const [linkError, setLinkError] = useState<string | null>(null);
  useEffect(() => setLinkError(null), [movieId]);
  const open = async (url: string) => {
    try {
      setLinkError(null);
      await openExternal(url);
    } catch {
      setLinkError('Unable to open the link. Please try again.');
      onError('Unable to open the link. Please try again.');
    }
  };
  // Only a validated video ID is used. Arbitrary database HTML/embed URLs are never executed.
  const trailerId = verifiedTrailerId(movie);
  const specs = movie
    ? [
        ['Resolution', movie.technicalSpecs?.resolution],
        ['Aspect ratio', movie.technicalSpecs?.aspectRatio],
        ['Audio', movie.technicalSpecs?.audio],
        ['Color grade', movie.technicalSpecs?.colorGrade],
        ['Frame rate', movie.technicalSpecs?.fps],
      ].filter(([, value]) => value)
    : [];
  return (
    <Modal
      visible={Boolean(movieId)}
      animationType="none"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={ui.screen}>
        <View style={{ padding: 16, alignItems: 'flex-end' }}>
          <Button label="Close film details" onPress={onClose} />
        </View>
        {!movie ? (
          <StateView
            loading={result.loading}
            error={result.error}
            onRetry={result.error ? result.reload : undefined}
          />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            <Artwork
              uri={movie.backdrop || movie.poster}
              title={movie.title}
              id={movie.id}
              style={{ width: '100%', aspectRatio: 16 / 9 }}
            />
            <View style={ui.section}>
              <Text style={ui.eyebrow}>FILM DETAILS</Text>
              <Text style={ui.title}>{movie.title}</Text>
              {linkError && (
                <Text style={ui.error} accessibilityRole="alert">
                  {linkError}
                </Text>
              )}
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <Text style={ui.body}>{movie.originalTitle}</Text>
              )}
              {movie.tagline && <Text style={ui.body}>{movie.tagline}</Text>}
              <Text style={ui.body}>
                {[movie.director, movie.year, movie.runtime, movie.rating]
                  .filter(Boolean)
                  .join(' · ') || 'Film metadata not supplied.'}
              </Text>
              {movie.genres.length > 0 && <Text style={ui.body}>{movie.genres.join(' · ')}</Text>}
              <View style={ui.row}>
                {movie.curatorScore !== null && (
                  <Text style={ui.eyebrow}>CURATOR {movie.curatorScore}/100</Text>
                )}
                {movie.imdbScore && <Text style={ui.eyebrow}>IMDB {movie.imdbScore}/10</Text>}
                {movie.matchScore !== null && (
                  <Text style={ui.eyebrow}>{movie.matchScore}% MATCH</Text>
                )}
              </View>
              <Button
                primary
                label={savedIds.has(movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                onPress={() => onToggleWatchlist(movie)}
              />
              {trailerId ? (
                <Button
                  label="Watch trailer on YouTube"
                  onPress={() => void open(`https://www.youtube.com/watch?v=${trailerId}`)}
                />
              ) : (
                <Text style={ui.body}>No verified trailer supplied.</Text>
              )}
              <View style={ui.divider} />
              <Text style={ui.heading}>Overview</Text>
              <Text style={ui.body}>{movie.synopsis || 'No synopsis supplied.'}</Text>
              {movie.curatorNote && (
                <>
                  <Text style={ui.heading}>Curator note</Text>
                  <Text style={ui.body}>{movie.curatorNote}</Text>
                </>
              )}
              <Text style={ui.heading}>Technical metadata</Text>
              {specs.length ? (
                specs.map(([label, value]) => (
                  <View key={label} style={{ gap: 3 }}>
                    <Text style={ui.eyebrow}>{label}</Text>
                    <Text style={ui.body}>{value}</Text>
                  </View>
                ))
              ) : (
                <Text style={ui.body}>No technical specifications supplied.</Text>
              )}
              <Text style={ui.heading}>Cast</Text>
              <Text style={ui.body}>
                {movie.cast.length ? movie.cast.join(' · ') : 'No cast supplied.'}
              </Text>
              <Text style={ui.heading}>Where to watch</Text>
              {movie.streamPlatforms.length ? (
                movie.streamPlatforms.map((provider, index) => (
                  <View key={`${provider.name}-${provider.region}-${index}`} style={{ gap: 6 }}>
                    <Button
                      label={`Open ${provider.name} · ${provider.region}`}
                      onPress={() => void open(provider.url)}
                    />
                    <Text style={ui.body}>
                      {provider.type} · Availability checked{' '}
                      {new Date(provider.verifiedAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={ui.body}>No current verified viewing providers supplied.</Text>
              )}
              {movie.awards.length > 0 && (
                <>
                  <Text style={ui.heading}>Awards</Text>
                  {movie.awards.map((award, index) => (
                    <Text key={`${award}-${index}`} style={ui.body}>
                      {award}
                    </Text>
                  ))}
                </>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}
