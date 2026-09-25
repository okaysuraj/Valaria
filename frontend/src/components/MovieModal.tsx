import React, { useEffect, useState } from 'react';
import { X, Play, Bookmark, Check, Award, Film, Disc, Sparkles, ExternalLink } from 'lucide-react';
import { Movie } from '../types/movie';

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

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
      setIsPlayingTrailer(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [movie]);

  if (!movie) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto bg-black/85 backdrop-blur-2xl transition-opacity duration-300 animate-[fadeIn_200ms_ease-out]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-[2.5rem] bg-[#0E0E12] border border-white/12 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center tap-press backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto no-scrollbar flex-1">
          {/* Top Video / Backdrop Hero Area */}
          <div className="relative aspect-video sm:aspect-[21/9] w-full bg-black overflow-hidden">
            {isPlayingTrailer && movie.trailerEmbedUrl ? (
              <iframe
                src={`${movie.trailerEmbedUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-[#0E0E12]/30 to-transparent" />
                <div className="absolute inset-0 cinema-grain opacity-40 pointer-events-none" />

                {/* Center Play Trailer Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#E5A93C] transition-all duration-200 tap-press shadow-2xl"
                  >
                    <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
                    </span>
                    <span>Launch 4K Trailer</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Modal Body Information */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            {/* Header Metadata */}
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#8E8E98] mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] font-semibold">
                  {movie.matchScore}% CINEPHILE MATCH
                </span>
                <span>{movie.year}</span>
                <span>·</span>
                <span>{movie.runtime}</span>
                <span>·</span>
                <span className="text-white">IMDb {movie.imdbScore}</span>
              </div>

              <h2 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {movie.title}
              </h2>

              <p className="font-mono text-sm text-[#A0A0AB] mt-1 font-medium">
                Directed by {movie.director}
              </p>

              {/* Tagline */}
              {movie.tagline && (
                <p className="text-sm italic text-[#E5A93C] mt-2 font-serif">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => alert(`Starting 4K Stream: ${movie.title}`)}
                className="px-8 py-3.5 rounded-full bg-[#E5A93C] text-black font-semibold text-sm hover:bg-white transition-colors tap-press flex items-center gap-2 shadow-lg shadow-[#E5A93C]/10"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Stream Feature (4K UHD)</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(movie)}
                className={`px-5 py-3.5 rounded-full border text-sm font-medium transition-all tap-press flex items-center gap-2 ${
                  isWatchlisted
                    ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]'
                    : 'bg-[#181820] hover:bg-white/10 border-white/15 text-white'
                }`}
              >
                {isWatchlisted ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isWatchlisted ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Synopsis & Curator Reflection */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-white/8">
              <div className="md:col-span-7 space-y-4">
                <h4 className="font-['Syne'] text-lg font-bold text-white">
                  Narrative Synopsis
                </h4>
                <p className="text-sm md:text-base text-[#C4C4CD] leading-relaxed">
                  {movie.synopsis}
                </p>

                {/* Cast */}
                <div className="pt-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8E8E98] block mb-2">
                    Key Cast
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.cast.map((actor) => (
                      <span
                        key={actor}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-[#D1D1D8] font-mono"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Curator Note Card */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-[#14141B] border border-white/8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#E5A93C] flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Curator's Dispatch
                </span>
                <p className="text-xs md:text-sm text-[#B5B5C0] mt-3 leading-relaxed">
                  {movie.curatorNote}
                </p>
                {movie.awards && movie.awards.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/8 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#8E8E98]">
                      Recognition
                    </span>
                    {movie.awards.map((award) => (
                      <p key={award} className="text-xs text-[#EDEDF0] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                        <span>{award}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="pt-6 border-t border-white/8">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#8E8E98] mb-4">
                Archival Technical Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                  <span className="font-mono text-[10px] text-[#8E8E98] block">RESOLUTION</span>
                  <span className="font-mono text-xs text-white font-medium mt-0.5 block truncate">
                    {movie.technicalSpecs.resolution}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                  <span className="font-mono text-[10px] text-[#8E8E98] block">ASPECT RATIO</span>
                  <span className="font-mono text-xs text-white font-medium mt-0.5 block truncate">
                    {movie.technicalSpecs.aspectRatio}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                  <span className="font-mono text-[10px] text-[#8E8E98] block">AUDIO MIX</span>
                  <span className="font-mono text-xs text-white font-medium mt-0.5 block truncate">
                    {movie.technicalSpecs.audio}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                  <span className="font-mono text-[10px] text-[#8E8E98] block">COLOR GRADING</span>
                  <span className="font-mono text-xs text-white font-medium mt-0.5 block truncate">
                    {movie.technicalSpecs.colorGrade}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                  <span className="font-mono text-[10px] text-[#8E8E98] block">FRAME RATE</span>
                  <span className="font-mono text-xs text-white font-medium mt-0.5 block truncate">
                    {movie.technicalSpecs.fps}
                  </span>
                </div>
              </div>
            </div>

            {/* Streaming Availability */}
            <div className="pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#8E8E98]">AVAILABLE ON:</span>
                <div className="flex flex-wrap gap-2">
                  {movie.streamPlatforms.map((platform) => (
                    <span
                      key={platform.name}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white flex items-center gap-1.5"
                    >
                      <Disc className="w-3 h-3 text-[#E5A93C]" />
                      {platform.logoText}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
