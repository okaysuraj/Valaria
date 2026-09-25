import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Bookmark, X, Trash2, ChevronRight, Sparkles } from 'lucide-react-native';
import { Movie } from '../types/movie';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistMovies: Movie[];
  onRemoveMovie: (movie: Movie) => void;
  onOpenMovie: (movie: Movie) => void;
  onClearWatchlist: () => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlistMovies,
  onRemoveMovie,
  onOpenMovie,
  onClearWatchlist,
}) => {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleRow}>
            <View style={styles.bookmarkBadge}>
              <Bookmark size={15} color="#E5A93C" fill="#E5A93C" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Cinema Watchlist</Text>
              <Text style={styles.headerSub}>
                {watchlistMovies.length} TITLES QUEUED
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={styles.closeBtn}
            accessibilityLabel="Close watchlist"
          >
            <X size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Personalized Taste DNA Breakdown */}
          {watchlistMovies.length > 0 && (
            <View style={styles.tasteDnaCard}>
              <View style={styles.dnaHeaderRow}>
                <Sparkles size={13} color="#E5A93C" />
                <Text style={styles.dnaHeaderTitle}>TASTE DNA AFFINITY</Text>
              </View>

              <View style={styles.dnaMetric}>
                <View style={styles.dnaLabelRow}>
                  <Text style={styles.dnaLabel}>Auteur Direction</Text>
                  <Text style={styles.dnaPercent}>94%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: '94%' }]} />
                </View>
              </View>

              <View style={styles.dnaMetric}>
                <View style={styles.dnaLabelRow}>
                  <Text style={styles.dnaLabel}>Atmospheric Tension</Text>
                  <Text style={styles.dnaPercent}>88%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: '88%' }]} />
                </View>
              </View>
            </View>
          )}

          {/* List of Saved Movies */}
          {watchlistMovies.length > 0 ? (
            <View style={styles.moviesList}>
              {watchlistMovies.map((movie) => (
                <TouchableOpacity
                  key={movie.id}
                  onPress={() => {
                    onClose();
                    onOpenMovie(movie);
                  }}
                  activeOpacity={0.8}
                  style={styles.movieRow}
                >
                  <Image
                    source={{ uri: movie.backdrop }}
                    style={styles.rowThumbnail}
                    resizeMode="cover"
                  />

                  <View style={styles.rowInfo}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {movie.title}
                    </Text>
                    <Text style={styles.rowDirector} numberOfLines={1}>
                      Dir. {movie.director}
                    </Text>
                    <View style={styles.rowMeta}>
                      <Text style={styles.rowMetaText}>{movie.year}</Text>
                      <Text style={styles.rowMetaText}>·</Text>
                      <Text style={styles.rowMetaText}>{movie.runtime}</Text>
                      <Text style={styles.rowMetaText}>·</Text>
                      <Text style={styles.rowScoreText}>
                        {movie.matchScore}% Match
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation?.();
                      onRemoveMovie(movie);
                    }}
                    activeOpacity={0.7}
                    style={styles.removeBtn}
                    accessibilityLabel={`Remove ${movie.title}`}
                  >
                    <Trash2 size={16} color="#E5A93C" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              {/* Clear Watchlist Button */}
              <TouchableOpacity
                onPress={onClearWatchlist}
                activeOpacity={0.7}
                style={styles.clearBtn}
              >
                <Text style={styles.clearBtnText}>Clear Watchlist</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Bookmark size={28} color="#8E8E98" />
              </View>
              <Text style={styles.emptyStateTitle}>Your Watchlist is Empty</Text>
              <Text style={styles.emptyStateSub}>
                Bookmark auteur masterworks from the premiere spotlight, taste
                matrix, or living archive to queue your personal cinema salon.
              </Text>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.8}
                style={styles.browseBtn}
              >
                <Text style={styles.browseBtnText}>Explore Film Catalog</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#08080A',
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookmarkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 169, 60, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E98',
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#16161F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  tasteDnaCard: {
    backgroundColor: '#121218',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  dnaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dnaHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1,
  },
  dnaMetric: {
    marginBottom: 10,
  },
  dnaLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dnaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1D1D8',
  },
  dnaPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E5A93C',
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E5A93C',
    borderRadius: 3,
  },
  moviesList: {
    gap: 12,
  },
  movieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: 10,
    gap: 12,
  },
  rowThumbnail: {
    width: 72,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#08080A',
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  rowDirector: {
    fontSize: 11,
    color: '#8E8E98',
    marginBottom: 4,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowMetaText: {
    fontSize: 10,
    color: '#A0A0AB',
  },
  rowScoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E5A93C',
  },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(229, 169, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E98',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 13,
    color: '#8E8E98',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: '#E5A93C',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
  },
  browseBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#08080A',
  },
});
