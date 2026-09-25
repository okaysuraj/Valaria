import { Router, Request, Response } from 'express';
import pool from '../config/database.js';

const router = Router();

/**
 * GET /api/movies
 * Fetch all movies with their related data (cast, awards, specs, platforms).
 * Supports optional query params: ?genre=, ?mood=, ?search=, ?sort=
 */
router.get('/', async (req: Request, res: Response) => {
  const { genre, mood, search, sort } = req.query;

  let baseQuery = `
    SELECT
      m.*,
      ts.resolution, ts.aspect_ratio, ts.audio, ts.color_grade, ts.fps,
      COALESCE(
        (SELECT json_agg(mc.name ORDER BY mc.position)
         FROM movie_cast mc WHERE mc.movie_id = m.id), '[]'
      ) AS cast,
      COALESCE(
        (SELECT json_agg(ma.award)
         FROM movie_awards ma WHERE ma.movie_id = m.id), '[]'
      ) AS awards,
      COALESCE(
        (SELECT json_agg(json_build_object(
           'name', sp.name,
           'type', sp.type,
           'logoText', sp.logo_text,
           'badgeColor', sp.badge_color
         ))
         FROM stream_platforms sp WHERE sp.movie_id = m.id), '[]'
      ) AS stream_platforms
    FROM movies m
    LEFT JOIN technical_specs ts ON ts.movie_id = m.id
    WHERE 1=1
  `;

  const params: string[] = [];
  let paramIdx = 1;

  if (genre && genre !== 'All') {
    baseQuery += ` AND $${paramIdx} = ANY(m.genres)`;
    params.push(genre as string);
    paramIdx++;
  }

  if (mood) {
    baseQuery += ` AND $${paramIdx} = ANY(m.moods)`;
    params.push(mood as string);
    paramIdx++;
  }

  if (search) {
    baseQuery += ` AND (
      m.title ILIKE $${paramIdx}
      OR m.director ILIKE $${paramIdx}
      OR m.synopsis ILIKE $${paramIdx}
    )`;
    params.push(`%${search}%`);
    paramIdx++;
  }

  // Sorting
  const sortMap: Record<string, string> = {
    match: 'm.match_score DESC',
    curator: 'm.curator_score DESC',
    year: 'm.year DESC',
    runtime: 'm.runtime DESC',
  };
  const orderBy = sortMap[(sort as string) || 'match'] || sortMap.match;
  baseQuery += ` ORDER BY ${orderBy}`;

  const { rows } = await pool.query(baseQuery, params);

  // Transform snake_case → camelCase for frontend consumption
  const movies = rows.map(transformMovie);
  res.json({ status: 'ok', data: movies });
});

/**
 * GET /api/movies/:id
 * Fetch a single movie by ID with all related data.
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { rows } = await pool.query(`
    SELECT
      m.*,
      ts.resolution, ts.aspect_ratio, ts.audio, ts.color_grade, ts.fps,
      COALESCE(
        (SELECT json_agg(mc.name ORDER BY mc.position)
         FROM movie_cast mc WHERE mc.movie_id = m.id), '[]'
      ) AS cast,
      COALESCE(
        (SELECT json_agg(ma.award)
         FROM movie_awards ma WHERE ma.movie_id = m.id), '[]'
      ) AS awards,
      COALESCE(
        (SELECT json_agg(json_build_object(
           'name', sp.name,
           'type', sp.type,
           'logoText', sp.logo_text,
           'badgeColor', sp.badge_color
         ))
         FROM stream_platforms sp WHERE sp.movie_id = m.id), '[]'
      ) AS stream_platforms
    FROM movies m
    LEFT JOIN technical_specs ts ON ts.movie_id = m.id
    WHERE m.id = $1
  `, [id]);

  if (rows.length === 0) {
    res.status(404).json({ status: 'error', message: 'Movie not found' });
    return;
  }

  res.json({ status: 'ok', data: transformMovie(rows[0]) });
});

/** Transform a raw DB row to camelCase API shape */
function transformMovie(row: any) {
  return {
    id: row.id,
    title: row.title,
    originalTitle: row.original_title,
    tagline: row.tagline,
    director: row.director,
    year: row.year,
    runtime: row.runtime,
    rating: row.rating,
    imdbScore: row.imdb_score,
    curatorScore: row.curator_score,
    matchScore: row.match_score,
    genres: row.genres,
    moods: row.moods,
    synopsis: row.synopsis,
    curatorNote: row.curator_note,
    backdrop: row.backdrop,
    poster: row.poster,
    trailerId: row.trailer_id,
    trailerEmbedUrl: row.trailer_embed_url,
    featuredSpotlight: row.featured_spotlight,
    technicalSpecs: {
      resolution: row.resolution,
      aspectRatio: row.aspect_ratio,
      audio: row.audio,
      colorGrade: row.color_grade,
      fps: row.fps,
    },
    cast: row.cast,
    awards: row.awards,
    streamPlatforms: row.stream_platforms,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default router;
