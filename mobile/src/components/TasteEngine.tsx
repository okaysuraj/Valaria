import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Compass, Sparkles, Bookmark, Check, Play } from 'lucide-react-native';
import { Movie } from '../types/movie';
import { tasteMoods } from '../data/moviesData';

interface TasteEngineProps {
  selectedMoodId: string;
  onSelectMood: (moodId: string) => void;
  movies: Movie[];
  onOpenMovie: (movie: Movie) => void;
  watchlistIds: string[];
  onToggleWatchlist: (movie: Movie) => void;
}

export const TasteEngine: React.FC<TasteEngineProps> = ({
  selectedMoodId,
  onSelectMood,
  movies,
  onOpenMovie,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const currentMood =
    tasteMoods.find((m) => m.id === selectedMoodId) || tasteMoods[0];

  // Matched movies for selected mood
  const matchedMovies = movies
    .filter(
      (m) =>
        m.moods.includes(currentMood.id) ||
        currentMood.matchGenreKeys.some((g) => m.genres.includes(g))
    )
    .slice(0, 6);

  return (
    <View style={styles.sectionContainer}>
      {/* Section Header */}
      <View style={styles.headerArea}>
        <View style={styles.eyebrowRow}>
          <View style={styles.amberDot} />
          <Text style={styles.eyebrowText}>THE TASTE ENGINE</Text>
        </View>
        <Text style={styles.sectionHeading}>Cinematic Appetite Matrix</Text>
        <Text style={styles.sectionDescription}>
          Filter by aesthetic wavelength. Algorithmic curation calibrated for
          photographic grain, pacing, and emotional resonance.
        </Text>
      </View>

      {/* Mood Selector Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodPillsContainer}
      >
        {tasteMoods.map((mood) => {
          const isSelected = mood.id === selectedMoodId;
          return (
            <TouchableOpacity
              key={mood.id}
              onPress={() => onSelectMood(mood.id)}
              activeOpacity={0.75}
              style={[styles.moodPill, isSelected && styles.moodPillActive]}
            >
              <Sparkles
                size={12}
                color={isSelected ? '#08080A' : '#E5A93C'}
              />
              <Text
                style={[
                  styles.moodPillText,
                  isSelected && styles.moodPillTextActive,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Atmosphere Info Card */}
      <View style={styles.atmosphereCard}>
        <View style={styles.atmosphereHeader}>
          <View style={styles.compassCircle}>
            <Compass size={18} color="#E5A93C" />
          </View>
          <View style={styles.affinityBadge}>
            <Text style={styles.affinityBadgeText}>99% AFFINITY</Text>
          </View>
        </View>

        <Text style={styles.atmosphereEyebrow}>SELECTED ATMOSPHERE</Text>
        <Text style={styles.atmosphereTagline}>{currentMood.tagline}</Text>

        <View style={styles.atmosphereFooter}>
          <Text style={styles.matchedCountText}>
            {matchedMovies.length} ARCHIVAL TITLES MATCHED
          </Text>
        </View>
      </View>

      {/* Matched Film Cards Scroll */}
      <View style={styles.carouselHeaderRow}>
        <Text style={styles.carouselHeading}>Matched Selections</Text>
        <Text style={styles.carouselSub}>Swipe to explore</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
      >
        {matchedMovies.map((movie) => {
          const isWatchlisted = watchlistIds.includes(movie.id);
          return (
            <TouchableOpacity
              key={movie.id}
              onPress={() => onOpenMovie(movie)}
              activeOpacity={0.85}
              style={styles.movieCard}
            >
              <View style={styles.cardImageWrapper}>
                <Image
                  source={{ uri: movie.backdrop }}
                  style={styles.cardBackdrop}
                  resizeMode="cover"
                />
                <View style={styles.matchScoreBadge}>
                  <Text style={styles.matchScoreText}>{movie.matchScore}% MATCH</Text>
                </View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onToggleWatchlist(movie);
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.cardWatchlistButton,
                    isWatchlisted && styles.cardWatchlistButtonActive,
                  ]}
                >
                  {isWatchlisted ? (
                    <Check size={12} color="#08080A" />
                  ) : (
                    <Bookmark size={12} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.metaYear}>{movie.year}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaRuntime}>{movie.runtime}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaScore}>★ {movie.imdbScore}</Text>
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {movie.title}
                </Text>
                <Text style={styles.cardDirector} numberOfLines={1}>
                  Dir. {movie.director}
                </Text>

                <View style={styles.cardGenreTag}>
                  <Text style={styles.cardGenreText}>{movie.genres[0]}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#08080A',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerArea: {
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5A93C',
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.6,
  },
  sectionHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#8E8E98',
  },
  moodPillsContainer: {
    paddingHorizontal: 18,
    gap: 8,
    paddingBottom: 14,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
  },
  moodPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  moodPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A0A0AB',
  },
  moodPillTextActive: {
    color: '#08080A',
    fontWeight: '800',
  },
  atmosphereCard: {
    marginHorizontal: 18,
    backgroundColor: '#111116',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  atmosphereHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compassCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(229, 169, 60, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  affinityBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  affinityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 0.6,
  },
  atmosphereEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  atmosphereTagline: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EDEDF0',
    lineHeight: 18,
    marginBottom: 10,
  },
  atmosphereFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
  },
  matchedCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E98',
    letterSpacing: 0.8,
  },
  carouselHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  carouselHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  carouselSub: {
    fontSize: 11,
    color: '#8E8E98',
  },
  cardsScroll: {
    paddingHorizontal: 18,
    gap: 12,
  },
  movieCard: {
    width: 220,
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardImageWrapper: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  cardBackdrop: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  matchScoreBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(8, 8, 10, 0.85)',
    borderWidth: 1,
    borderColor: '#E5A93C',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchScoreText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
  },
  cardWatchlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(8, 8, 10, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWatchlistButtonActive: {
    backgroundColor: '#E5A93C',
    borderColor: '#E5A93C',
  },
  cardBody: {
    padding: 12,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  metaYear: {
    fontSize: 11,
    color: '#8E8E98',
    fontWeight: '600',
  },
  metaDot: {
    fontSize: 11,
    color: '#555560',
  },
  metaRuntime: {
    fontSize: 11,
    color: '#8E8E98',
    fontWeight: '600',
  },
  metaScore: {
    fontSize: 11,
    color: '#E5A93C',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardDirector: {
    fontSize: 11,
    color: '#A0A0AB',
    marginBottom: 8,
  },
  cardGenreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardGenreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D1D1D8',
  },
});
