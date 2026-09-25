import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Search, X, Bookmark, Check, SlidersHorizontal } from 'lucide-react-native';
import { Movie, GenreFilter, SortOption } from '../types/movie';

const { width } = Dimensions.get('window');
const cardWidth = (width - 36 - 12) / 2;

interface CatalogGridProps {
  movies: Movie[];
  onOpenMovie: (movie: Movie) => void;
  watchlistIds: string[];
  onToggleWatchlist: (movie: Movie) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: GenreFilter;
  onGenreChange: (genre: GenreFilter) => void;
}

const genres: GenreFilter[] = [
  'All',
  'Auteur Vision',
  'Sci-Fi & Speculative',
  'Neo-Noir',
  'Psychological Thriller',
  'Poetic Romance',
  'Documentary & Essay',
];

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  movies,
  onOpenMovie,
  watchlistIds,
  onToggleWatchlist,
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('match');

  // Filter movies
  const filtered = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.cast.some((actor) => actor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre =
      selectedGenre === 'All' || movie.genres.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  // Sort movies
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'curator') return b.curatorScore - a.curatorScore;
    if (sortBy === 'year') return b.year - a.year;
    return parseInt(b.runtime) - parseInt(a.runtime);
  });

  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.headerArea}>
        <View style={styles.eyebrowRow}>
          <View style={styles.amberDot} />
          <Text style={styles.eyebrowText}>THE LIVING ARCHIVE</Text>
        </View>
        <Text style={styles.sectionHeading}>Curated Film Catalog</Text>
        <Text style={styles.sectionDescription}>
          Handpicked cinematic canon. High dynamic range masters, pristine
          subtitles, and zero compression artifacts.
        </Text>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Search size={16} color="#8E8E98" />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search by title, director, cast..."
            placeholderTextColor="#6E6E78"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              activeOpacity={0.7}
              style={styles.clearSearchBtn}
            >
              <X size={14} color="#C4C4CD" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Genre Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreScroll}
      >
        {genres.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <TouchableOpacity
              key={genre}
              onPress={() => onGenreChange(genre)}
              activeOpacity={0.75}
              style={[
                styles.genrePill,
                isSelected && styles.genrePillActive,
              ]}
            >
              <Text
                style={[
                  styles.genreText,
                  isSelected && styles.genreTextActive,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort Options Bar */}
      <View style={styles.sortBar}>
        <View style={styles.sortLabelRow}>
          <SlidersHorizontal size={12} color="#8E8E98" />
          <Text style={styles.sortLabel}>SORT BY:</Text>
        </View>
        <View style={styles.sortButtonsRow}>
          {[
            { key: 'match' as SortOption, label: 'Affinity' },
            { key: 'curator' as SortOption, label: 'Valaria' },
            { key: 'year' as SortOption, label: 'Year' },
            { key: 'runtime' as SortOption, label: 'Length' },
          ].map(({ key, label }) => {
            const isSelected = sortBy === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setSortBy(key)}
                activeOpacity={0.7}
                style={[
                  styles.sortPill,
                  isSelected && styles.sortPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.sortPillText,
                    isSelected && styles.sortPillTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsCountBar}>
        <Text style={styles.resultsCountText}>
          SHOWING {sorted.length} {sorted.length === 1 ? 'TITLE' : 'TITLES'}
        </Text>
      </View>

      {/* 2-Column Movie Grid */}
      {sorted.length > 0 ? (
        <View style={styles.gridContainer}>
          {sorted.map((movie) => {
            const isWatchlisted = watchlistIds.includes(movie.id);
            return (
              <TouchableOpacity
                key={movie.id}
                onPress={() => onOpenMovie(movie)}
                activeOpacity={0.85}
                style={styles.gridCard}
              >
                <View style={styles.posterWrapper}>
                  <Image
                    source={{ uri: movie.poster }}
                    style={styles.posterImage}
                    resizeMode="cover"
                  />

                  {/* Curator score badge */}
                  <View style={styles.curatorBadge}>
                    <Text style={styles.curatorBadgeText}>{movie.curatorScore}</Text>
                  </View>

                  {/* Watchlist Quick Button */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation?.();
                      onToggleWatchlist(movie);
                    }}
                    activeOpacity={0.7}
                    style={[
                      styles.watchlistQuickBtn,
                      isWatchlisted && styles.watchlistQuickBtnActive,
                    ]}
                  >
                    {isWatchlisted ? (
                      <Check size={13} color="#08080A" />
                    ) : (
                      <Bookmark size={13} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>

                  {/* Match percentage pill */}
                  <View style={styles.matchPill}>
                    <Text style={styles.matchPillText}>{movie.matchScore}%</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardMetadata}>
                    <Text style={styles.cardYear}>{movie.year}</Text>
                    <Text style={styles.cardDot}>·</Text>
                    <Text style={styles.cardRuntime}>{movie.runtime}</Text>
                    <Text style={styles.cardDot}>·</Text>
                    <Text style={styles.cardRating}>{movie.rating}</Text>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {movie.title}
                  </Text>
                  <Text style={styles.cardDirector} numberOfLines={1}>
                    {movie.director}
                  </Text>

                  <View style={styles.techTag}>
                    <Text style={styles.techTagText}>
                      {movie.technicalSpecs.resolution.split(' ')[0]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No matching films found</Text>
          <Text style={styles.emptySubtitle}>
            Try changing the search keywords or resetting the genre filter.
          </Text>
          <TouchableOpacity
            onPress={() => {
              onSearchChange('');
              onGenreChange('All');
            }}
            activeOpacity={0.75}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset All Filters</Text>
          </TouchableOpacity>
        </View>
      )}
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
  searchWrapper: {
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    padding: 0,
  },
  clearSearchBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreScroll: {
    paddingHorizontal: 18,
    gap: 8,
    paddingBottom: 12,
  },
  genrePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#111116',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  genrePillActive: {
    backgroundColor: '#E5A93C',
    borderColor: '#E5A93C',
  },
  genreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A0A0AB',
  },
  genreTextActive: {
    color: '#08080A',
    fontWeight: '800',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  sortLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sortLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E98',
    letterSpacing: 0.8,
  },
  sortButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sortPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  sortPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E98',
  },
  sortPillTextActive: {
    color: '#08080A',
    fontWeight: '800',
  },
  resultsCountBar: {
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  resultsCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E8E98',
    letterSpacing: 0.8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    gap: 12,
  },
  gridCard: {
    width: cardWidth,
    backgroundColor: '#111116',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  posterWrapper: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: '#08080A',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  curatorBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(8, 8, 10, 0.85)',
    borderWidth: 1,
    borderColor: '#E5A93C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  curatorBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#E5A93C',
  },
  watchlistQuickBtn: {
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
  watchlistQuickBtnActive: {
    backgroundColor: '#E5A93C',
    borderColor: '#E5A93C',
  },
  matchPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(8, 8, 10, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matchPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
  },
  cardContent: {
    padding: 10,
  },
  cardMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
  },
  cardYear: {
    fontSize: 10,
    color: '#8E8E98',
  },
  cardDot: {
    fontSize: 10,
    color: '#555560',
  },
  cardRuntime: {
    fontSize: 10,
    color: '#8E8E98',
  },
  cardRating: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A0A0AB',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardDirector: {
    fontSize: 11,
    color: '#8E8E98',
    marginBottom: 6,
  },
  techTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229, 169, 60, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  techTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#8E8E98',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#E5A93C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#08080A',
  },
});
