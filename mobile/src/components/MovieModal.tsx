import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  X,
  Play,
  Bookmark,
  Check,
  Award,
  Disc,
  ExternalLink,
  Sparkles,
} from 'lucide-react-native';
import { Movie } from '../types/movie';

const { width } = Dimensions.get('window');

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  if (!movie) return null;

  return (
    <Modal
      visible={!!movie}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        {/* Floating Close Button */}
        <TouchableOpacity
          onPress={() => {
            setIsPlayingTrailer(false);
            onClose();
          }}
          activeOpacity={0.8}
          style={styles.closeButton}
          accessibilityLabel="Close film details"
        >
          <X size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Video Trailer or Backdrop Area */}
          <View style={styles.mediaContainer}>
            {isPlayingTrailer && movie.trailerEmbedUrl ? (
              <WebView
                source={{
                  uri: `${movie.trailerEmbedUrl}?autoplay=1&modestbranding=1&playsinline=1`,
                }}
                style={styles.videoPlayer}
                allowsFullscreenVideo
                javaScriptEnabled
              />
            ) : (
              <View style={styles.backdropWrapper}>
                <Image
                  source={{ uri: movie.backdrop }}
                  style={styles.backdropImage}
                  resizeMode="cover"
                />
                <View style={styles.backdropGradient} />

                {/* Launch Trailer Button */}
                <TouchableOpacity
                  onPress={() => setIsPlayingTrailer(true)}
                  activeOpacity={0.85}
                  style={styles.playTrailerButton}
                >
                  <View style={styles.playTrailerIcon}>
                    <Play size={14} color="#08080A" fill="#08080A" />
                  </View>
                  <Text style={styles.playTrailerText}>Launch 4K Trailer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Body Content */}
          <View style={styles.bodyContent}>
            {/* Top Score Strip */}
            <View style={styles.scoreStrip}>
              <View style={styles.curatorScoreChip}>
                <Sparkles size={11} color="#E5A93C" />
                <Text style={styles.curatorScoreText}>
                  VALARIA INDEX {movie.curatorScore}
                </Text>
              </View>

              <View style={styles.matchScoreChip}>
                <Text style={styles.matchScoreChipText}>
                  {movie.matchScore}% AFFINITY
                </Text>
              </View>

              <View style={styles.imdbScoreChip}>
                <Text style={styles.imdbScoreText}>★ {movie.imdbScore} IMDB</Text>
              </View>
            </View>

            {/* Title & Eyebrows */}
            <Text style={styles.directorEyebrow}>
              DIR. {movie.director.toUpperCase()}
            </Text>
            <Text style={styles.titleText}>{movie.title}</Text>
            {movie.originalTitle && (
              <Text style={styles.originalTitleText}>{movie.originalTitle}</Text>
            )}
            <Text style={styles.taglineText}>"{movie.tagline}"</Text>

            {/* Metadata Bar */}
            <View style={styles.metaRow}>
              <Text style={styles.metaItem}>{movie.year}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaItem}>{movie.runtime}</Text>
              <Text style={styles.metaDot}>·</Text>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingText}>{movie.rating}</Text>
              </View>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.genresListText}>
                {movie.genres.join(', ')}
              </Text>
            </View>

            {/* Watchlist Toggle CTA */}
            <TouchableOpacity
              onPress={() => onToggleWatchlist(movie)}
              activeOpacity={0.8}
              style={[
                styles.modalWatchlistButton,
                isWatchlisted && styles.modalWatchlistButtonActive,
              ]}
            >
              {isWatchlisted ? (
                <>
                  <Check size={16} color="#08080A" />
                  <Text style={styles.modalWatchlistTextActive}>
                    In Your Watchlist
                  </Text>
                </>
              ) : (
                <>
                  <Bookmark size={16} color="#FFFFFF" />
                  <Text style={styles.modalWatchlistText}>
                    Add to Watchlist
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Synopsis */}
            <View style={styles.synopsisSection}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.synopsisText}>{movie.synopsis}</Text>
            </View>

            {/* Curator's Note */}
            <View style={styles.curatorNoteBox}>
              <Text style={styles.curatorNoteEyebrow}>CURATOR'S ARCHIVAL NOTE</Text>
              <Text style={styles.curatorNoteText}>{movie.curatorNote}</Text>
            </View>

            {/* Technical Specifications Grid */}
            <View style={styles.specsSection}>
              <View style={styles.specsHeaderRow}>
                <Disc size={15} color="#E5A93C" />
                <Text style={styles.sectionTitle}>Archival Specifications</Text>
              </View>

              <View style={styles.specsGrid}>
                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>MASTER RESOLUTION</Text>
                  <Text style={styles.specBoxValue}>
                    {movie.technicalSpecs.resolution}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>ASPECT RATIO</Text>
                  <Text style={styles.specBoxValue}>
                    {movie.technicalSpecs.aspectRatio}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>AUDIO ENCODING</Text>
                  <Text style={styles.specBoxValue}>
                    {movie.technicalSpecs.audio}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>COLOR GRADE</Text>
                  <Text style={styles.specBoxValue}>
                    {movie.technicalSpecs.colorGrade}
                  </Text>
                </View>

                <View style={styles.specBoxFull}>
                  <Text style={styles.specBoxLabel}>NATIVE FRAMERATE</Text>
                  <Text style={styles.specBoxValue}>
                    {movie.technicalSpecs.fps}
                  </Text>
                </View>
              </View>
            </View>

            {/* Cast Members */}
            <View style={styles.castSection}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <View style={styles.castChipsWrap}>
                {movie.cast.map((actor, i) => (
                  <View key={i} style={styles.castChip}>
                    <Text style={styles.castChipText}>{actor}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Available Platforms */}
            <View style={styles.streamSection}>
              <Text style={styles.sectionTitle}>Curated Streaming Channels</Text>
              <View style={styles.streamList}>
                {movie.streamPlatforms.map((platform, i) => (
                  <View key={i} style={styles.streamItem}>
                    <View style={styles.streamNameRow}>
                      <Text style={styles.streamName}>{platform.name}</Text>
                      {platform.badgeColor && (
                        <View
                          style={[
                            styles.platformTag,
                            { backgroundColor: 'rgba(229, 169, 60, 0.15)' },
                          ]}
                        >
                          <Text style={styles.platformTagText}>
                            {platform.logoText}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.streamType}>
                      {platform.type === 'premiere'
                        ? 'Exclusive Premiere'
                        : platform.type === 'free_curated'
                        ? 'Curated Direct'
                        : 'Subscription Access'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Awards */}
            {movie.awards && movie.awards.length > 0 && (
              <View style={styles.awardsSection}>
                <View style={styles.specsHeaderRow}>
                  <Award size={15} color="#E5A93C" />
                  <Text style={styles.sectionTitle}>Honors & Awards</Text>
                </View>
                {movie.awards.map((award, i) => (
                  <View key={i} style={styles.awardItem}>
                    <Text style={styles.awardItemText}>• {award}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#08080A',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 18,
    zIndex: 99,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  mediaContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000000',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  backdropWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  backdropGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 8, 10, 0.4)',
  },
  playTrailerButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  playTrailerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTrailerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#08080A',
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  scoreStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  curatorScoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.35)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  curatorScoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 0.5,
  },
  matchScoreChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchScoreChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EDEDF0',
  },
  imdbScoreChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  imdbScoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E5A93C',
  },
  directorEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  originalTitleText: {
    fontSize: 14,
    color: '#8E8E98',
    marginBottom: 4,
  },
  taglineText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#B0B0BC',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  metaItem: {
    fontSize: 12,
    color: '#8E8E98',
    fontWeight: '600',
  },
  metaDot: {
    fontSize: 12,
    color: '#555560',
  },
  ratingBox: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  genresListText: {
    fontSize: 12,
    color: '#A0A0AB',
  },
  modalWatchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E1E28',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  modalWatchlistButtonActive: {
    backgroundColor: '#E5A93C',
    borderColor: '#E5A93C',
  },
  modalWatchlistText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalWatchlistTextActive: {
    fontSize: 13,
    fontWeight: '900',
    color: '#08080A',
  },
  synopsisSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  synopsisText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#D1D1D8',
  },
  curatorNoteBox: {
    backgroundColor: '#13131A',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  curatorNoteEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  curatorNoteText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#EDEDF0',
  },
  specsSection: {
    marginBottom: 20,
  },
  specsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specBox: {
    width: (width - 40 - 8) / 2,
    backgroundColor: '#121218',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
  },
  specBoxFull: {
    width: '100%',
    backgroundColor: '#121218',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
  },
  specBoxLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E8E98',
    marginBottom: 3,
  },
  specBoxValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EDEDF0',
  },
  castSection: {
    marginBottom: 20,
  },
  castChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  castChip: {
    backgroundColor: '#16161F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  castChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EDEDF0',
  },
  streamSection: {
    marginBottom: 20,
  },
  streamList: {
    gap: 8,
  },
  streamItem: {
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
  },
  streamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  streamName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  platformTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  platformTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
  },
  streamType: {
    fontSize: 11,
    color: '#8E8E98',
  },
  awardsSection: {
    marginBottom: 10,
  },
  awardItem: {
    marginBottom: 4,
  },
  awardItemText: {
    fontSize: 12,
    color: '#D1D1D8',
    lineHeight: 18,
  },
});
