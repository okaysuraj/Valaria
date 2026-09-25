import React, { useState } from 'react';
import { Search, Bookmark, Sparkles, Menu, X, Disc3 } from 'lucide-react';

interface NavbarProps {
  watchlistCount: number;
  onOpenWatchlist: () => void;
  onOpenSearch: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  watchlistCount,
  onOpenWatchlist,
  onOpenSearch,
  onNavigateSection,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'spotlight', label: 'Premiere' },
    { id: 'taste-engine', label: 'Taste Engine' },
    { id: 'curator-bento', label: 'Curations' },
    { id: 'catalog', label: 'The Archive' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 md:pt-6 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="max-w-6xl mx-auto pointer-events-auto flex items-center justify-between px-5 md:px-7 py-3 rounded-full bg-[#0E0E12]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        {/* Brand Logotype */}
        <div 
          onClick={() => handleNavClick('spotlight')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] group-hover:scale-105 transition-transform duration-200">
            <Disc3 className="w-4 h-4 animate-[spin_10s_linear_infinite]" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col">
            <span className="font-['Syne'] text-lg md:text-xl font-extrabold tracking-[-0.04em] text-white group-hover:text-[#E5A93C] transition-colors">
              VALARIA
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8E8E98] -mt-1 hidden sm:inline-block">
              Cinematheque
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#15151B]/60 p-1 rounded-full border border-white/5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 tap-press ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-[#8E8E98] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search films"
            className="w-9 h-9 rounded-full bg-[#16161C] border border-white/8 hover:border-white/20 text-[#A0A0AB] hover:text-white flex items-center justify-center tap-press transition-colors"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Watchlist Counter Button */}
          <button
            onClick={onOpenWatchlist}
            aria-label={`View watchlist containing ${watchlistCount} titles`}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161C] border border-white/8 hover:border-[#E5A93C]/40 text-[#EDEDF0] hover:text-white tap-press transition-all duration-200 group"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#E5A93C] group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span className="font-mono text-xs font-medium">
              {watchlistCount}
            </span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden w-9 h-9 rounded-full bg-[#16161C] border border-white/8 text-[#A0A0AB] hover:text-white flex items-center justify-center tap-press"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 max-w-sm mx-auto p-4 rounded-3xl bg-[#0E0E12]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium text-[#D1D1D6] hover:bg-white/10 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#8E8E98] px-2 font-mono">
            <span>TASTE ENGINE ACTIVE</span>
            <span className="text-[#E5A93C]">98% SYNC</span>
          </div>
        </div>
      )}
    </header>
  );
};
