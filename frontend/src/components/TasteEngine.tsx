/** Show published mood filters and the current mood selection. */
import type { TasteMood } from '../types/movie';

export function TasteEngine({
  moods,
  selectedMoodId,
  onSelectMood,
  saving,
}: {
  moods: TasteMood[];
  selectedMoodId: string;
  onSelectMood: (id: string) => void;
  saving: boolean;
}) {
  return (
    <section id="taste-engine" className="section" aria-labelledby="taste-heading">
      <div className="section-heading">
        <h2 id="taste-heading">Find your atmosphere.</h2>
        <p className="muted">Choose a mood to explore the catalog.</p>
      </div>
      {moods.length ? (
        <div className="mood-strip">
          <button
            className={`mood-button ${!selectedMoodId ? 'selected' : ''}`}
            aria-pressed={!selectedMoodId}
            onClick={() => onSelectMood('')}
            disabled={saving}
          >
            All moods
          </button>
          {moods.map((mood) => (
            <button
              className={`mood-button ${selectedMoodId === mood.id ? 'selected' : ''}`}
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              aria-pressed={selectedMoodId === mood.id}
              disabled={saving}
            >
              <span>{mood.label}</span>
              {mood.tagline && <small>{mood.tagline}</small>}
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-inline">No moods have been published yet.</p>
      )}
    </section>
  );
}
