import React from 'react';
import { X, Trash2, Play, Bookmark, Sparkles, Film, ArrowRight } from 'lucide-react';
import { Movie } from '../types/movie';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistMovies: Movie[];
  onRemoveMovie: (movie: Movie) => void;
  onOpenMovie: (movie: Movie) => void;
  onClearWatchlist: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistMovies,
  onRemoveMovie,
  onOpenMovie,
  onClearWatchlist,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-[#0E0E12] border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto no-scrollbar">
          {/* Top Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Syne'] text-xl font-bold text-white">
                    Cinema Watchlist
                  </h3>
                  <span className="font-mono text-[11px] text-[#8E8E98]">
                    {watchlistMovies.length} TITLES QUEUED
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close watchlist drawer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center tap-press transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Personalized Taste DNA Breakdown */}
            {watchlistMovies.length > 0 && (
              <div className="my-6 p-4 rounded-2xl bg-[#14141B] border border-white/8">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#E5A93C] font-semibold block mb-2">
                  Taste DNA Affinity
                </span>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-[#D1D1D8] mb-1">
                      <span>Auteur Direction</span>
                      <span className="text-[#E5A93C]">94%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#E5A93C] w-[94%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-[#D1D1D8] mb-1">
                      <span>Atmospheric Tension</span>
                      <span className="text-[#E5A93C]">88%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#E5A93C] w-[88%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List of Movies */}
            <div className="mt-4 space-y-3">
              {watchlistMovies.length > 0 ? (
                watchlistMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group relative p-3 rounded-2xl bg-[#131318] border border-white/6 hover:border-white/15 flex items-center gap-3.5 transition-all duration-200"
                  >
                    {/* Thumbnail */}
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-16 h-12 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => onOpenMovie(movie)}
                    />

                    {/* Meta */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onOpenMovie(movie)}
                    >
                      <h4 className="font-['Syne'] text-sm font-bold text-white group-hover:text-[#E5A93C] truncate transition-colors">
                        {movie.title}
                      </h4>
                      <p className="font-mono text-[11px] text-[#8E8E98] truncate">
                        {movie.year} · {movie.director}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenMovie(movie)}
                        aria-label={`Play ${movie.title}`}
                        className="p-2 rounded-lg bg-white/5 hover:bg-[#E5A93C] hover:text-black text-white transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => onRemoveMovie(movie)}
                        aria-label={`Remove ${movie.title} from watchlist`}
                        className="p-2 rounded-lg text-[#8E8E98] hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-[#8E8E98]">
                  <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#E5A93C]" />
                  <p className="font-['Syne'] text-base font-semibold text-white">
                    Your Watchlist is Empty
                  </p>
                  <p className="text-xs text-[#8E8E98] mt-1 max-w-[24ch] mx-auto">
                    Click the bookmark icon on any film to queue it for streaming.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Footer Actions */}
          {watchlistMovies.length > 0 && (
            <div className="pt-6 border-t border-white/8 flex items-center justify-between">
              <button
                onClick={onClearWatchlist}
                className="text-xs font-mono text-[#8E8E98] hover:text-red-400 transition-colors"
              >
                Clear All Titles
              </button>
              <button
                onClick={() => onOpenMovie(watchlistMovies[0])}
                className="px-5 py-2.5 rounded-full bg-[#E5A93C] text-black font-semibold text-xs tap-press hover:bg-white transition-colors flex items-center gap-1.5"
              >
                <span>Play First</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
