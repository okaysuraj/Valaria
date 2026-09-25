import React, { useState } from 'react';
import { Award, Volume2, Maximize2, Sparkles, Film, Play, Pause, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';

interface CuratorBentoProps {
  onSelectMovie: (movie: Movie) => void;
  movies: Movie[];
}

export const CuratorBento: React.FC<CuratorBentoProps> = ({ onSelectMovie, movies }) => {
  const [activeAspect, setActiveAspect] = useState<'academy' | 'flat' | 'scope'>('scope');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const villeneuveMovie = movies.find((m) => m.id === 'blade-runner-2049') || movies[0];
  const cannesMovie = movies.find((m) => m.id === 'in-the-mood-for-love') || movies[3];

  const aspectRatios = {
    academy: { ratio: 'aspect-[4/3]', label: '1.37:1 Academy', desc: 'Pre-1953 classical intimacy. Vertical facial dominance.' },
    flat: { ratio: 'aspect-[1.85/1]', label: '1.85:1 Flat', desc: 'Modern human scale. Natural vertical and horizontal balance.' },
    scope: { ratio: 'aspect-[2.39/1]', label: '2.39:1 Anamorphic', desc: 'Monumental lateral scope. Expansive architectural landscapes.' },
  };

  return (
    <section id="curator-bento" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#E5A93C] font-semibold">
              Curator Dispatches
            </span>
          </div>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white">
            Landmarks & Restorations
          </h2>
        </div>
        <p className="text-sm md:text-base text-[#8E8E98] max-w-[44ch]">
          Archival standards, photochemical transfers, and spatial acoustics curated for the uncompromising cinephile.
        </p>
      </div>

      {/* 4-Cell Asymmetrical Bento Grid with Double-Bezel Hardware styling */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cell 1: The Auteur Retrospective (8-col) */}
        <div className="lg:col-span-8 p-1.5 rounded-[2.25rem] double-bezel group">
          <div className="relative rounded-[calc(2.25rem-0.375rem)] double-bezel-inner min-h-[380px] p-7 md:p-10 flex flex-col justify-between overflow-hidden">
            {/* Background image & lighting */}
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80"
              alt="Blade Runner 2049"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/70 to-transparent" />
            <div className="absolute inset-0 cinema-grain opacity-50 pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono text-[#F7F7F8]">
                <Film className="w-3.5 h-3.5 text-[#E5A93C]" />
                AUTEUR ARCHIVE // 4K REMASTER
              </span>
              <span className="font-mono text-xs text-[#8E8E98]">
                VOL. 04
              </span>
            </div>

            {/* Core Text & CTA */}
            <div className="relative z-10 max-w-xl mt-12">
              <h3 className="font-['Syne'] text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                The Architecture of Solitude: Modern Neo-Noir
              </h3>
              <p className="mt-3 text-sm md:text-base text-[#B0B0BC] leading-relaxed">
                From Deakins’ copper-dusted dust storms in <em>Blade Runner 2049</em> to Nicolas Winding Refn’s neon elevators, explore how lighting sculpts psychological isolation.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => onSelectMovie(villeneuveMovie)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E5A93C] text-black font-semibold text-xs hover:bg-white transition-colors tap-press"
                >
                  <span>Launch Spotlight</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#8E8E98]">
                  4 TITLES · 65MM SCANS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cell 2: Aspect Ratio & Framing Comparator (4-col) */}
        <div className="lg:col-span-4 p-1.5 rounded-[2.25rem] double-bezel">
          <div className="rounded-[calc(2.25rem-0.375rem)] double-bezel-inner min-h-[380px] p-6 md:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E5A93C]">
                  <Maximize2 className="w-3.5 h-3.5" />
                  OPTICAL GEOMETRY
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  INTERACTIVE
                </span>
              </div>

              <h4 className="font-['Syne'] text-xl font-bold text-white mt-3">
                Aspect Ratio Lab
              </h4>
              <p className="text-xs text-[#8E8E98] mt-1">
                Toggle optical standards to see how aspect ratio dictates emotional space.
              </p>

              {/* Visual Framing Box Simulation */}
              <div className="my-6 p-4 rounded-2xl bg-black/60 border border-white/8 flex items-center justify-center min-h-[140px]">
                <div 
                  className={`w-full ${aspectRatios[activeAspect].ratio} max-h-[120px] bg-gradient-to-br from-[#1F1F28] to-[#121217] border border-[#E5A93C]/40 rounded-lg flex items-center justify-center text-center p-2 transition-all duration-300`}
                >
                  <span className="font-mono text-xs text-[#E5A93C] font-semibold">
                    {aspectRatios[activeAspect].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons to switch */}
            <div>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/6">
                {(['academy', 'flat', 'scope'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveAspect(key)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono capitalize transition-all duration-150 tap-press ${
                      activeAspect === key
                        ? 'bg-white text-black font-semibold'
                        : 'text-[#8E8E98] hover:text-white'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#A0A0AB] mt-2 font-mono">
                {aspectRatios[activeAspect].desc}
              </p>
            </div>
          </div>
        </div>

        {/* Cell 3: Spatial Audio & Sound Design (4-col) */}
        <div className="lg:col-span-4 p-1.5 rounded-[2.25rem] double-bezel">
          <div className="rounded-[calc(2.25rem-0.375rem)] double-bezel-inner min-h-[360px] p-6 md:p-7 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E5A93C]">
                <Volume2 className="w-3.5 h-3.5" />
                ACOUSTIC PRECISION
              </span>

              <h4 className="font-['Syne'] text-xl font-bold text-white mt-3">
                Dolby Atmos 7.1.4
              </h4>
              <p className="text-xs text-[#8E8E98] mt-1">
                Spatial sound positioning engineered for uncompressed playback through studio monitors or reference headphones.
              </p>

              {/* Animated Waveform Visualizer */}
              <div className="my-8 p-4 rounded-2xl bg-black/50 border border-white/8 flex items-center justify-center gap-1.5 h-24">
                {[30, 65, 45, 85, 95, 60, 40, 75, 90, 50, 70, 40, 80, 100, 60, 35].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlayingAudio ? `${height}%` : '20%',
                      transition: 'height 180ms ease',
                    }}
                    className={`w-1 rounded-full ${
                      isPlayingAudio ? 'bg-[#E5A93C]' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1D1D26] hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-colors tap-press"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>MUTE PREVIEW HARMONICS</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#E5A93C] fill-[#E5A93C]" />
                  <span>TEST SPATIAL FREQUENCY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cell 4: Festival Laureates & Cannes Archive (8-col) */}
        <div className="lg:col-span-8 p-1.5 rounded-[2.25rem] double-bezel group">
          <div className="relative rounded-[calc(2.25rem-0.375rem)] double-bezel-inner min-h-[360px] p-7 md:p-10 flex flex-col justify-between overflow-hidden">
            {/* Background Image */}
            <img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80"
              alt="In the Mood for Love"
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/75 to-transparent" />
            <div className="absolute inset-0 cinema-grain opacity-50 pointer-events-none" />

            {/* Top Laurels */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-[#E5A93C]">
                <Award className="w-4 h-4" />
                PALME D'OR & GOLDEN LION CURATION
              </span>
              <span className="font-mono text-xs text-[#8E8E98]">
                CANNES · VENICE · BERLIN
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-xl mt-8">
              <h3 className="font-['Syne'] text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Wong Kar-wai: The Restored Hong Kong Canon
              </h3>
              <p className="mt-2.5 text-sm text-[#B0B0BC] leading-relaxed">
                Supervised 4K photochemical scans from original 35mm camera negatives. Experience <em>In the Mood for Love</em> and <em>Chungking Express</em> in pristine color timing.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => onSelectMovie(cannesMovie)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-[#E5A93C] transition-colors tap-press"
                >
                  <span>Open 4K Master</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#8E8E98]">
                  CRITERION COLLECTION ARCHIVE
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
