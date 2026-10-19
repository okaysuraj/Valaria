/** Display the catalog editorial selections and open their movie details. */
import type { Movie } from '../types/movie';
import { ArrowUpRight } from 'lucide-react';
import { MovieImage } from './MovieCard';

export function CuratorBento({
  movies,
  onSelectMovie,
}: {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}) {
  return (
    <section id="curator-bento" className="section" aria-labelledby="curation-heading">
      <div className="section-heading">
        <h2 id="curation-heading">The curator’s shelf.</h2>
        <p className="muted">A closer look at the films selected for Valaria.</p>
      </div>
      {movies.length ? (
        <div className="curation-grid">
          {movies.map((movie) => (
            <article className="curation-card" key={movie.id}>
              <div className="curation-image">
                <MovieImage src={movie.backdrop || movie.poster} title={movie.title} />
              </div>
              <div className="curation-copy">
                <p className="muted">{[movie.director, movie.year].filter(Boolean).join(' · ')}</p>
                <h3>{movie.title}</h3>
                {movie.curatorNote && <p>{movie.curatorNote}</p>}
                <button className="text-button" onClick={() => onSelectMovie(movie)}>
                  Explore film
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-inline">No curations have been published yet.</p>
      )}
    </section>
  );
}
