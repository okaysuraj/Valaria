/** Provide web navigation, search, account access, and the watchlist count. */
import { Bookmark, Search, UserRound } from 'lucide-react';

export function Navbar({
  watchlistCount,
  onOpenWatchlist,
  onOpenSearch,
  onAccount,
  signedIn,
}: {
  watchlistCount: number | null;
  onOpenWatchlist: () => void;
  onOpenSearch: () => void;
  onAccount: () => void;
  signedIn: boolean;
}) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#spotlight" aria-label="Valaria home">
        VALARIA<span className="brand-accent">.</span>
      </a>
      <nav aria-label="Main navigation" className="main-nav">
        <a href="#taste-engine">Discover</a>
        <a href="#curator-bento">Curations</a>
        <a href="#catalog">Catalog</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search catalog" onClick={onOpenSearch}>
          <Search size={21} />
        </button>
        <button className="button subtle" onClick={onOpenWatchlist}>
          <Bookmark size={18} />
          <span className="watchlist-label">Watchlist</span>
          <span
            aria-label={
              watchlistCount === null ? 'Watchlist syncing' : `${watchlistCount} saved films`
            }
          >
            {watchlistCount === null ? '…' : watchlistCount}
          </span>
        </button>
        <button
          className="icon-button"
          aria-label={signedIn ? 'Your account' : 'Sign in'}
          onClick={onAccount}
        >
          <UserRound size={21} />
        </button>
      </div>
    </header>
  );
}
