import React from 'react';
import { Play, Bookmark, Check, Sparkles, Volume2 } from 'lucide-react';
import { Movie } from '../types/movie';

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
    <section 
      id="spotlight"
      className="relative min-h-[92vh] md:min-h-[96vh] flex flex-col justify-between pt-24 md:pt-28 pb-8 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Cinematic Backdrop with atmospheric vignette */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-white/8 bg-[#0B0B0E]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000 ease-out brightness-[0.75] contrast-[1.1]"
        />
        {/* Gradients to merge seamlessly into canvas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-[#08080A]/40 to-transparent" />
        {/* Subtle film grain */}
        <div className="absolute inset-0 cinema-grain opacity-60 pointer-events-none" />
      </div>

      {/* Hero Top Metadata Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 px-2 md:px-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] font-mono text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            Curator Premiere Spotlight
          </span>
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#C4C4CD] font-mono text-[11px]">
            {movie.year} · {movie.runtime}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#A0A0AB]">
          <span className="px-2.5 py-0.5 rounded border border-white/10 bg-black/40 text-white font-medium">
            {movie.technicalSpecs.resolution}
          </span>
          <span className="hidden md:inline text-[#8E8E98]">
            {movie.technicalSpecs.aspectRatio}
          </span>
        </div>
      </div>

      {/* Hero Core Typography Stack (Strict 4 elements: Eyebrow, Headline, Subtext, CTAs) */}
      <div className="px-2 md:px-4 max-w-3xl my-auto py-8">
        <span className="font-mono text-xs tracking-[0.25em] text-[#E5A93C] uppercase block mb-3 font-semibold">
          Dir. {movie.director}
        </span>

        {/* Monumental Headline */}
        <h1 className="font-['Syne'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.04em] leading-[0.9] text-white drop-shadow-2xl">
          {movie.title}
        </h1>

        {/* Concise Editorial Subtext (< 20 words) */}
        <p className="mt-5 text-base md:text-lg text-[#D1D1D8] font-normal leading-relaxed max-w-[54ch]">
          {movie.curatorNote}
        </p>

        {/* Action CTAs with button-in-button nested architecture */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {/* Primary Action Button */}
          <button
            onClick={() => onOpenModal(movie)}
            className="group inline-flex items-center gap-4 pl-6 pr-2 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#E5A93C] transition-all duration-200 tap-press shadow-[0_4px_24px_rgba(255,255,255,0.2)]"
          >
            <span>Experience Feature</span>
            <span className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            </span>
          </button>

          {/* Secondary Watchlist Button */}
          <button
            onClick={() => onToggleWatchlist(movie)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium transition-all duration-200 tap-press ${
              isWatchlisted
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]'
                : 'bg-[#15151B]/80 hover:bg-white/10 border-white/15 text-white'
            }`}
          >
            {isWatchlisted ? (
              <>
                <Check className="w-4 h-4" />
                <span>In Watchlist</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Add to Watchlist</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Switcher: Quick Select Between Featured Premieres */}
      <div className="pt-4 border-t border-white/8 px-2 md:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E98]">
          <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
          <span>CURATED SELECTION ({allSpotlights.length} TITLES)</span>
        </div>

        {/* Spotlight film selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {allSpotlights.map((item, index) => {
            const isSelected = item.id === movie.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMovie(item)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 tap-press shrink-0 ${
                  isSelected
                    ? 'bg-[#E5A93C]/20 border border-[#E5A93C]/60 text-white'
                    : 'bg-black/40 border border-white/8 text-[#A0A0AB] hover:text-white hover:border-white/20'
                }`}
              >
                <span className="font-mono text-[10px] text-[#E5A93C] font-semibold">
                  0{index + 1}
                </span>
                <span className="font-medium max-w-[130px] truncate">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
