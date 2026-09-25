import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Bookmark, Check, Sparkles, Award } from 'lucide-react-native';
import { Movie } from '../types/movie';

const { width } = Dimensions.get('window');

interface HeroPremiereProps {
  movie: Movie;
  allSpotlights: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onOpenModal: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
}

export const HeroPremiere: React.FC<HeroPremiereProps> = ({
  movie,
  allSpotlights,
  onSelectMovie,
  onOpenModal,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  return (
    <View style={styles.container}>
      {/* Cinematic Hero Backdrop with Atmospheric Gradients */}
      <View style={styles.backdropWrapper}>
        <Image
          source={{ uri: movie.backdrop }}
          style={styles.backdropImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(8, 8, 10, 0.2)', 'rgba(8, 8, 10, 0.65)', '#08080A']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Hero Content Overlay */}
      <View style={styles.contentOverlay}>
        {/* Top Badges Row */}
        <View style={styles.topBadgesRow}>
          <View style={styles.spotlightBadge}>
            <Sparkles size={11} color="#E5A93C" />
            <Text style={styles.spotlightBadgeText}>CURATOR PREMIERE</Text>
          </View>

          <View style={styles.specsRow}>
            <View style={styles.specChip}>
              <Text style={styles.specChipText}>{movie.year}</Text>
            </View>
            <View style={styles.specChip}>
              <Text style={styles.specChipText}>{movie.runtime}</Text>
            </View>
            <View style={[styles.specChip, styles.goldSpecChip]}>
              <Text style={styles.goldSpecChipText}>{movie.technicalSpecs.resolution}</Text>
            </View>
          </View>
        </View>

        {/* Director Eyebrow */}
        <Text style={styles.directorEyebrow}>DIR. {movie.director.toUpperCase()}</Text>

        {/* Monumental Headline */}
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>

        {/* Awards pill if available */}
        {movie.awards && movie.awards.length > 0 && (
          <View style={styles.awardRow}>
            <Award size={12} color="#E5A93C" />
            <Text style={styles.awardText} numberOfLines={1}>
              {movie.awards[0]}
            </Text>
          </View>
        )}

        {/* Editorial Curator Note */}
        <Text style={styles.curatorNote} numberOfLines={3}>
          {movie.curatorNote}
        </Text>

        {/* Action CTAs */}
        <View style={styles.actionsRow}>
          {/* Primary Action Button (Experience Feature) */}
          <TouchableOpacity
            onPress={() => onOpenModal(movie)}
            activeOpacity={0.8}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Experience Feature</Text>
            <View style={styles.playIconCircle}>
              <Play size={13} color="#08080A" fill="#08080A" />
            </View>
          </TouchableOpacity>

          {/* Secondary Watchlist Toggle */}
          <TouchableOpacity
            onPress={() => onToggleWatchlist(movie)}
            activeOpacity={0.7}
            style={[
              styles.watchlistButton,
              isWatchlisted && styles.watchlistButtonActive,
            ]}
          >
            {isWatchlisted ? (
              <>
                <Check size={14} color="#E5A93C" />
                <Text style={styles.watchlistButtonTextActive}>In Watchlist</Text>
              </>
            ) : (
              <>
                <Bookmark size={14} color="#FFFFFF" />
                <Text style={styles.watchlistButtonText}>Watchlist</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Switcher: Quick Select Between Featured Premieres */}
        <View style={styles.switcherSection}>
          <View style={styles.switcherHeader}>
            <View style={styles.pulsingDot} />
            <Text style={styles.switcherLabel}>
              CURATED PREMIERES ({allSpotlights.length})
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.switcherScroll}
          >
            {allSpotlights.map((item, index) => {
              const isSelected = item.id === movie.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelectMovie(item)}
                  activeOpacity={0.7}
                  style={[
                    styles.switcherPill,
                    isSelected && styles.switcherPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.switcherNumber,
                      isSelected && styles.switcherNumberActive,
                    ]}
                  >
                    0{index + 1}
                  </Text>
                  <Text
                    style={[
                      styles.switcherTitle,
                      isSelected && styles.switcherTitleActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#08080A',
    position: 'relative',
    overflow: 'hidden',
  },
  backdropWrapper: {
    width: '100%',
    height: 480,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  contentOverlay: {
    marginTop: -230,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  topBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  spotlightBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 0.8,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#C4C4CD',
  },
  goldSpecChip: {
    backgroundColor: 'rgba(229, 169, 60, 0.1)',
    borderColor: 'rgba(229, 169, 60, 0.3)',
  },
  goldSpecChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 0.5,
  },
  directorEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  movieTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 8,
  },
  awardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  awardText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EDEDF0',
  },
  curatorNote: {
    fontSize: 13,
    lineHeight: 19,
    color: '#B8B8C2',
    marginBottom: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 7,
    borderRadius: 26,
    gap: 12,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#08080A',
  },
  playIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16161F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 24,
  },
  watchlistButtonActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: '#E5A93C',
  },
  watchlistButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  watchlistButtonTextActive: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E5A93C',
  },
  switcherSection: {
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  switcherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5A93C',
  },
  switcherLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E98',
    letterSpacing: 1,
  },
  switcherScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  switcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#121218',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  switcherPillActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: '#E5A93C',
  },
  switcherNumber: {
    fontSize: 10,
    fontWeight: '900',
    color: '#E5A93C',
  },
  switcherNumberActive: {
    color: '#E5A93C',
  },
  switcherTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A0A0AB',
    maxWidth: 120,
  },
  switcherTitleActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
