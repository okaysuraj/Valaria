/** Import validated catalog records inside the caller's transaction. */
import { createHash } from 'node:crypto';
import type { SqlClient } from '../config/database.js';
import { catalogImportSchema, type CatalogManifest } from './importSchema.js';
type ImportedMovie = CatalogManifest['movies'][number];

/** Validate first; the caller's transaction rolls back every write on failure. */
export async function importCatalog(client: SqlClient, input: unknown, contentHash?: string) {
  const manifest = catalogImportSchema.parse(input);
  const source = manifest.source;
  await client.query(
    `INSERT INTO catalog_sources(id,name,url,license,retrieved_at) VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name,url=excluded.url,license=excluded.license,retrieved_at=excluded.retrieved_at`,
    [source.id, source.name, source.url, source.license, source.retrievedAt],
  );

  await saveMoods(client, source.id, manifest.moods);
  const knownMoods = new Set(
    (await client.query('SELECT id FROM taste_moods WHERE published')).rows.map((row) => row.id),
  );
  for (const movie of manifest.movies) {
    if (movie.moods.some((id) => !knownMoods.has(id)))
      throw new Error('A movie references an unknown or unpublished mood');
    await saveMovie(client, source.id, movie);
    await replaceMovieMetadata(client, movie);
  }
  await client.query(
    'INSERT INTO catalog_import_runs(source_id,content_sha256,imported_count) VALUES ($1,$2,$3)',
    [
      source.id,
      contentHash || createHash('sha256').update(JSON.stringify(manifest)).digest('hex'),
      manifest.movies.length,
    ],
  );
  return { importedMovies: manifest.movies.length, importedMoods: manifest.moods.length };
}

async function saveMoods(client: SqlClient, sourceId: string, moods: CatalogManifest['moods']) {
  for (const mood of moods) {
    const result = await client.query(
      `INSERT INTO taste_moods(id,label,tagline,accent_hue,match_genre_keys,source_id,published,position)
      VALUES ($1,$2,$3,$4,$5,$6,true,$7) ON CONFLICT(id) DO UPDATE SET label=excluded.label,tagline=excluded.tagline,
      accent_hue=excluded.accent_hue,match_genre_keys=excluded.match_genre_keys,source_id=excluded.source_id,published=true,position=excluded.position
      WHERE taste_moods.source_id IS NULL OR taste_moods.source_id=excluded.source_id RETURNING id`,
      [
        mood.id,
        mood.label,
        mood.tagline,
        mood.accentHue,
        mood.matchGenreKeys,
        sourceId,
        mood.position,
      ],
    );
    if (!result.rows.length) throw new Error('A mood ID belongs to another catalog source');
  }
}

async function saveMovie(client: SqlClient, sourceId: string, movie: ImportedMovie) {
  const columns: Record<string, unknown> = {
    id: movie.id,
    title: movie.title,
    original_title: movie.originalTitle ?? null,
    tagline: movie.tagline ?? null,
    director: movie.director ?? null,
    year: movie.year ?? null,
    runtime_minutes: movie.runtimeMinutes ?? null,
    runtime: null,
    rating: movie.rating ?? null,
    imdb_score: movie.imdbScore ?? null,
    curator_score: movie.curatorScore ?? null,
    curator_score_source: movie.curatorScoreSource ?? null,
    match_score: null,
    genres: movie.genres,
    moods: [...new Set(movie.moods)],
    synopsis: movie.synopsis ?? null,
    curator_note: movie.curatorNote ?? null,
    backdrop: movie.backdrop ?? null,
    poster: movie.poster ?? null,
    trailer_id: movie.trailerId ?? null,
    trailer_embed_url: null,
    featured_spotlight: movie.featuredSpotlight,
    curated: movie.curated,
    editorial_order: movie.editorialOrder,
    published: movie.published,
    source_id: sourceId,
    source_record_id: movie.sourceRecordId,
    source_url: movie.sourceUrl,
    verified_at: movie.verifiedAt,
  };
  const names = Object.keys(columns);
  const result = await client.query(
    `INSERT INTO movies(${names.join(',')}) VALUES (${names.map((_, index) => `$${index + 1}`).join(',')})
    ON CONFLICT(id) DO UPDATE SET ${names
      .filter((name) => name !== 'id')
      .map((name) => `${name}=excluded.${name}`)
      .join(',')}
    WHERE movies.source_id IS NULL OR movies.source_id=excluded.source_id RETURNING id`,
    Object.values(columns),
  );
  if (!result.rows.length) throw new Error('A movie ID belongs to another catalog source');
}

async function replaceMovieMetadata(client: SqlClient, movie: ImportedMovie) {
  await client.query('DELETE FROM movie_cast WHERE movie_id=$1', [movie.id]);
  await client.query('DELETE FROM movie_awards WHERE movie_id=$1', [movie.id]);
  await client.query('DELETE FROM technical_specs WHERE movie_id=$1', [movie.id]);
  await client.query('DELETE FROM stream_platforms WHERE movie_id=$1', [movie.id]);
  if (movie.cast.length)
    await client.query(
      `INSERT INTO movie_cast(movie_id,name,position)
    SELECT $1,name,(ordinality-1)::int FROM unnest($2::text[]) WITH ORDINALITY AS members(name,ordinality)`,
      [movie.id, movie.cast],
    );
  if (movie.awards.length)
    await client.query('INSERT INTO movie_awards(movie_id,award) SELECT $1,unnest($2::text[])', [
      movie.id,
      movie.awards,
    ]);
  if (movie.technicalSpecs) {
    const specs = movie.technicalSpecs;
    await client.query(
      'INSERT INTO technical_specs(movie_id,resolution,aspect_ratio,audio,color_grade,fps) VALUES ($1,$2,$3,$4,$5,$6)',
      [
        movie.id,
        specs.resolution ?? null,
        specs.aspectRatio ?? null,
        specs.audio ?? null,
        specs.colorGrade ?? null,
        specs.fps ?? null,
      ],
    );
  }
  if (movie.streamPlatforms.length)
    await client.query(
      `INSERT INTO stream_platforms(movie_id,name,type,logo_text,badge_color,url,region,verified_at,expires_at)
    SELECT $1,item->>'name',item->>'type',item->>'logoText',item->>'badgeColor',item->>'url',item->>'region',
    (item->>'verifiedAt')::timestamptz,(item->>'expiresAt')::timestamptz FROM jsonb_array_elements($2::jsonb) item`,
      [movie.id, JSON.stringify(movie.streamPlatforms)],
    );
}
