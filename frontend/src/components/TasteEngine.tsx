import React from 'react';
import { Compass, Sparkles, SlidersHorizontal, ArrowRight, Play, Bookmark, Check } from 'lucide-react';
import { Movie, TasteMood } from '../types/movie';
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
  const currentMood = tasteMoods.find((m) => m.id === selectedMoodId) || tasteMoods[0];

  // Filter and sort movies matching the selected mood
  const matchedMovies = movies
    .filter((movie) => movie.moods.includes(currentMood.id) || currentMood.matchGenreKeys.some((g) => movie.genres.includes(g)))
    .slice(0, 4);

  return (
    <section id="taste-engine" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header block with massive typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#E5A93C] font-semibold">
              The Taste Engine
            </span>
          </div>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white">
            Cinematic Appetite Matrix
          </h2>
        </div>
        <p className="text-sm md:text-base text-[#8E8E98] max-w-[42ch]">
          Filter by aesthetic wavelength. Algorithmic curation calibrated for photographic grain, pacing, and emotional resonance.
        </p>
      </div>

      {/* Interactive Mood Selector Tabs */}
      <div className="mt-8 flex flex-wrap gap-2.5">
        {tasteMoods.map((mood) => {
          const isSelected = mood.id === selectedMoodId;
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 tap-press flex items-center gap-2 ${
                isSelected
                  ? 'bg-white text-black font-semibold shadow-lg shadow-white/5'
                  : 'bg-[#121217] border border-white/8 text-[#A0A0AB] hover:text-white hover:border-white/20'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#E5A93C]'}`} />
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Mood Descriptor Banner */}
      <div className="mt-6 p-5 md:p-6 rounded-3xl bg-[#111116] border border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0 mt-0.5">
            <Compass className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <span className="font-mono text-xs text-[#E5A93C] font-semibold uppercase tracking-wider">
              Selected Atmosphere
            </span>
            <p className="text-sm md:text-base text-[#EDEDF0] mt-0.5 font-medium">
              {currentMood.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="font-mono text-xs text-[#8E8E98]">
            {matchedMovies.length} TITLES MATCHED
          </span>
          <span className="px-3 py-1 rounded-full bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30 font-mono text-xs font-semibold">
            99% AFFINITY
          </span>
        </div>
      </div>

      {/* Matched Movie Recommendation Cards (4-column responsive grid) */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {matchedMovies.map((movie) => {
          const isWatchlisted = watchlistIds.includes(movie.id);
          return (
            <div
              key={movie.id}
              className="group relative rounded-3xl bg-[#111116] border border-white/8 hover:border-white/20 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-2xl"
            >
              {/* Poster Thumbnail */}
              <div 
                onClick={() => onOpenMovie(movie)}
                className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-black/50"
              >
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/30" />

                {/* Match percentage badge */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[#E5A93C] font-mono text-[11px] font-semibold">
                  {movie.matchScore}% MATCH
                </div>

                {/* Quick play hover button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-12 h-12 rounded-full bg-[#E5A93C] text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8E8E98] font-mono mb-1.5">
                    <span>{movie.year}</span>
                    <span>{movie.runtime}</span>
                  </div>
                  <h3 
                    onClick={() => onOpenMovie(movie)}
                    className="font-['Syne'] text-lg font-bold text-white group-hover:text-[#E5A93C] transition-colors cursor-pointer line-clamp-1"
                  >
                    {movie.title}
                  </h3>
                  <p className="text-xs text-[#8E8E98] mt-1 font-mono">
                    Dir. {movie.director}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-white/6 flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/8 text-[#A0A0AB]">
                    {movie.technicalSpecs.resolution.split(' ')[0]} 4K
                  </span>

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
          );
        })}
      </div>
    </section>
  );
};
