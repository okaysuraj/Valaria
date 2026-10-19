/** Shared catalog SQL and conversion from database rows to API responses. */
import type { Row, SqlClient } from './config/database.js';

// Paginate the movies table first, then enrich only the selected rows. This keeps
// cast/awards/provider work bounded by the page size instead of the whole catalog.
export const movieSelect = `SELECT m.*, cs.name AS source_name, ts.resolution, ts.aspect_ratio, ts.audio, ts.color_grade, ts.fps,
  coalesce((SELECT json_agg(mc.name ORDER BY mc.position,mc.id) FROM movie_cast mc WHERE mc.movie_id=m.id),'[]') AS cast,
  coalesce((SELECT json_agg(ma.award ORDER BY ma.id) FROM movie_awards ma WHERE ma.movie_id=m.id),'[]') AS awards,
  coalesce((SELECT json_agg(json_build_object('name',sp.name,'type',sp.type,'logoText',sp.logo_text,
    'badgeColor',sp.badge_color,'url',sp.url,'region',sp.region,'verifiedAt',sp.verified_at) ORDER BY sp.name)
    FROM stream_platforms sp WHERE sp.movie_id=m.id AND sp.url IS NOT NULL AND sp.region IS NOT NULL
      AND sp.verified_at IS NOT NULL AND sp.expires_at > now()),'[]') AS stream_platforms
  FROM movies m LEFT JOIN technical_specs ts ON ts.movie_id=m.id LEFT JOIN catalog_sources cs ON cs.id=m.source_id`;
export const published =
  'm.published AND m.source_id IS NOT NULL AND m.source_url IS NOT NULL AND m.verified_at IS NOT NULL';

export function transformMovie(row: Row) {
  return {
    id: row.id,
    title: row.title,
    originalTitle: row.original_title ?? null,
    tagline: row.tagline ?? null,
    director: row.director ?? null,
    year: row.year ?? null,
    runtime:
      row.runtime_minutes == null
        ? null
        : `${Math.floor(row.runtime_minutes / 60)}h ${row.runtime_minutes % 60}m`,
    runtimeMinutes: row.runtime_minutes ?? null,
    rating: row.rating ?? null,
    imdbScore: row.imdb_score ?? null,
    curatorScore: row.curator_score_source ? row.curator_score : null,
    // No personalization algorithm exists yet. Never return the prototype's
    // fabricated per-film affinity percentage as a user's score.
    matchScore: null,
    genres: row.genres || [],
    moods: row.moods || [],
    synopsis: row.synopsis ?? null,
    curatorNote: row.curator_note ?? null,
    backdrop: row.backdrop ?? null,
    poster: row.poster ?? null,
    trailerId: row.trailer_id ?? null,
    trailerEmbedUrl: row.trailer_id
      ? `https://www.youtube-nocookie.com/embed/${row.trailer_id}`
      : null,
    featuredSpotlight: row.featured_spotlight,
    technicalSpecs: {
      resolution: row.resolution ?? null,
      aspectRatio: row.aspect_ratio ?? null,
      audio: row.audio ?? null,
      colorGrade: row.color_grade ?? null,
      fps: row.fps ?? null,
    },
    cast: row.cast || [],
    awards: row.awards || [],
    streamPlatforms: row.stream_platforms || [],
    source: {
      id: row.source_id,
      name: row.source_name,
      url: row.source_url,
      verifiedAt: row.verified_at,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.added_at ? { addedAt: row.added_at } : {}),
  };
}

export async function getMoods(db: SqlClient) {
  const { rows } = await db.query(
    'SELECT id,label,tagline,accent_hue,match_genre_keys FROM taste_moods WHERE published AND source_id IS NOT NULL ORDER BY position,label,id LIMIT 200',
  );
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    tagline: row.tagline,
    accentHue: row.accent_hue,
    matchGenreKeys: row.match_genre_keys,
  }));
}
