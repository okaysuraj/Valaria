/** Provide the web footer and archive navigation. */
export function Footer() {
  return (
    <footer className="site-footer">
      <a href="#spotlight" className="wordmark">
        VALARIA<span className="brand-accent">.</span>
      </a>
      <p className="muted">Discover cinema. Keep what moves you.</p>
      <nav aria-label="Footer navigation">
        <a href="#taste-engine">Discover</a>
        <a href="#curator-bento">Curations</a>
        <a href="#catalog">Catalog</a>
      </nav>
    </footer>
  );
}
