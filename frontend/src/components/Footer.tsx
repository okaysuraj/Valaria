import React, { useState } from 'react';
import { Disc3, ArrowRight, Check, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="mt-20 border-t border-white/8 bg-[#08080A] text-[#8E8E98] py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Manifesto & Newsletter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/6">
          {/* Brand Manifesto (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <Disc3 className="w-4 h-4 animate-[spin_12s_linear_infinite]" />
              </div>
              <span className="font-['Syne'] text-2xl font-extrabold tracking-tight text-white">
                VALARIA
              </span>
            </div>

            <p className="text-base md:text-lg text-[#EDEDF0] max-w-[50ch] leading-relaxed font-light">
              An independent cinema streaming platform and algorithmic taste sanctuary. Dedicated to uncompromised 4K transfers, spatial audio, and cinematic preservation.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-mono text-[#A0A0AB]">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8">
                4K UHD REMASTER
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8">
                DOLBY ATMOS 7.1.4
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8">
                DCI-P3 WIDE COLOR
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8">
                24.000 FPS NATIVE
              </span>
            </div>
          </div>

          {/* Weekly Dispatch Newsletter (5 cols) */}
          <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-[#111116] border border-white/8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#E5A93C] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                The Friday Dispatch
              </span>
              <h4 className="font-['Syne'] text-xl font-bold text-white mt-2">
                Curator Essays & Secret Screenings
              </h4>
              <p className="text-xs text-[#8E8E98] mt-1.5">
                Every Friday morning, our programming committee sends one long-form film essay and an exclusive 48-hour premiere link. Zero algorithmic spam.
              </p>
            </div>

            {subscribed ? (
              <div className="mt-6 p-3 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center gap-2 text-xs font-mono">
                <Check className="w-4 h-4" />
                <span>YOU ARE SUBSCRIBED TO THE DISPATCH.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cinephile.org"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-[#6E6E78] focus:outline-none focus:border-[#E5A93C]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5A93C] transition-colors tap-press flex items-center gap-1.5 shrink-0"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Colophon & Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-mono">
          <div>
            <span className="text-white font-semibold uppercase tracking-wider block mb-3">
              Curations
            </span>
            <ul className="space-y-2">
              <li><a href="#spotlight" className="hover:text-white transition-colors">Premiere Spotlight</a></li>
              <li><a href="#taste-engine" className="hover:text-white transition-colors">Taste Matrix</a></li>
              <li><a href="#curator-bento" className="hover:text-white transition-colors">Auteur Retrospective</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Restorations</a></li>
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold uppercase tracking-wider block mb-3">
              Platforms
            </span>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">Apple Vision Pro</li>
              <li className="hover:text-white transition-colors cursor-pointer">Apple TV 4K</li>
              <li className="hover:text-white transition-colors cursor-pointer">Google TV / Android</li>
              <li className="hover:text-white transition-colors cursor-pointer">Native Web Player</li>
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold uppercase tracking-wider block mb-3">
              Technical Lab
            </span>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">Spatial Audio Engine</li>
              <li className="hover:text-white transition-colors cursor-pointer">Color Space Verification</li>
              <li className="hover:text-white transition-colors cursor-pointer">Archival Photochemistry</li>
              <li className="hover:text-white transition-colors cursor-pointer">Subtitles & Open Captions</li>
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold uppercase tracking-wider block mb-3">
              Institution
            </span>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">Programming Ethics</li>
              <li className="hover:text-white transition-colors cursor-pointer">Preservation Fund</li>
              <li className="hover:text-white transition-colors cursor-pointer">Press & Ephemera</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms & Telemetry</li>
            </ul>
          </div>
        </div>

        {/* Bottom Massive Typography & Copyright */}
        <div className="pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6E6E78]">
          <p>© 2026 VALARIA CINEMATHEQUE. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2">
            <span>CURATED FOR 65MM & OLED</span>
            <span>·</span>
            <span>BUILD 4.2.0</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
