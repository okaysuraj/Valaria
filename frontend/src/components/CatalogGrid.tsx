import React, { useState } from 'react';
import { Search, SlidersHorizontal, Bookmark, Check, Play, Star, Sparkles, Filter } from 'lucide-react';
import { Movie, GenreFilter, SortOption } from '../types/movie';

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

  // Filter movies by search query and genre
  const filtered = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === 'All' || movie.genres.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  // Sort filtered movies
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'curator') return b.curatorScore - a.curatorScore;
    if (sortBy === 'year') return b.year - a.year;
    return parseInt(b.runtime) - parseInt(a.runtime);
  });

  return (
    <section id="catalog" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#E5A93C] font-semibold">
              The Living Archive
            </span>
          </div>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white">
            Curated Film Catalog
          </h2>
        </div>
        <p className="text-sm md:text-base text-[#8E8E98] max-w-[40ch]">
          Handpicked cinematic canon. High dynamic range masters, pristine subtitles, and zero compression artifacts.
        </p>
      </div>

      {/* Control Bar: Search Input & Sort Selector */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input with clean modern styling */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E98]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, director, or theme..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#121217] border border-white/8 text-sm text-white placeholder-[#6E6E78] focus:outline-none focus:border-[#E5A93C]/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8E8E98] hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-mono text-[#8E8E98]">SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3.5 py-2.5 rounded-xl bg-[#121217] border border-white/8 text-xs font-mono text-[#EDEDF0] focus:outline-none focus:border-[#E5A93C]/60 cursor-pointer"
          >
            <option value="match">Taste Match %</option>
            <option value="curator">Curator Score</option>
            <option value="year">Release Year</option>
          </select>
        </div>
      </div>

      {/* Genre Filter Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {genres.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 tap-press ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#121217] text-[#8E8E98] hover:text-white border border-white/6 hover:border-white/15'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Movie Results Grid (3-column on desktop, 2-column tablet, 1-column mobile) */}
      {sorted.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((movie) => {
            const isWatchlisted = watchlistIds.includes(movie.id);
            return (
              <div
                key={movie.id}
                className="group relative rounded-[2rem] p-1.5 double-bezel transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="rounded-[calc(2rem-0.375rem)] double-bezel-inner overflow-hidden flex flex-col h-full justify-between">
                  {/* Poster Image Container */}
                  <div 
                    onClick={() => onOpenMovie(movie)}
                    className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-black/60"
                  >
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-transparent to-black/30" />

                    {/* Top overlay metadata */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[#E5A93C] font-mono text-[11px] font-semibold">
                        {movie.matchScore}% MATCH
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-white font-mono text-[10px]">
                        IMDb {movie.imdbScore}
                      </span>
                    </div>

                    {/* Center hover play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-14 h-14 rounded-full bg-[#E5A93C] text-black flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 fill-black translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E98] mb-1">
                        <span>{movie.year}</span>
                        <span>·</span>
                        <span>{movie.runtime}</span>
                        <span>·</span>
                        <span className="text-[#A0A0AB]">{movie.genres[0]}</span>
                      </div>

                      <h3
                        onClick={() => onOpenMovie(movie)}
                        className="font-['Syne'] text-xl font-bold text-white group-hover:text-[#E5A93C] transition-colors cursor-pointer line-clamp-1"
                      >
                        {movie.title}
                      </h3>

                      <p className="text-xs font-mono text-[#A0A0AB] mt-0.5">
                        Directed by {movie.director}
                      </p>

                      <p className="text-xs text-[#8E8E98] mt-3 line-clamp-2 leading-relaxed">
                        {movie.synopsis}
                      </p>
                    </div>

                    {/* Bottom Technical Strip and Bookmark */}
                    <div className="pt-4 mt-4 border-t border-white/6 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#8E8E98] px-2 py-1 rounded bg-white/5 border border-white/8">
                        {movie.technicalSpecs.aspectRatio.split(' ')[0]} · 4K
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenMovie(movie)}
                          className="text-xs font-medium text-[#E5A93C] hover:underline"
                        >
                          Specs & Trailer
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(movie);
                          }}
                          aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                          className={`p-2 rounded-xl transition-all duration-200 tap-press ${
                            isWatchlisted
                              ? 'bg-[#E5A93C]/20 text-[#E5A93C]'
                              : 'text-[#8E8E98] hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {isWatchlisted ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-16 py-16 text-center rounded-3xl bg-[#111116] border border-white/6 max-w-md mx-auto p-8">
          <Sparkles className="w-8 h-8 text-[#E5A93C] mx-auto mb-3 opacity-60" />
          <h3 className="font-['Syne'] text-xl font-bold text-white">
            No Films Found
          </h3>
          <p className="text-xs text-[#8E8E98] mt-2 max-w-xs mx-auto">
            No titles matched "{searchQuery}" in "{selectedGenre}". Try clearing the search query or switching genres.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onGenreChange('All');
            }}
            className="mt-5 px-5 py-2 rounded-full bg-white text-black font-semibold text-xs tap-press"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
