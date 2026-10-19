/** Public catalog browsing, filtering, and movie details. */
import { Router } from 'express';
import type { Database } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { getMoods, movieSelect, published, transformMovie } from '../catalog.js';
import { idSchema, movieQuerySchema, pagination } from '../validation.js';

export function createCatalogRouter(db: Database) {
  const router = Router();
  router.get('/moods', async (_req, res) => {
    res.json({ status: 'ok', data: await getMoods(db) });
  });
  router.get('/catalog', async (_req, res) => {
    const [spotlights, curated, moods, genres, count] = await Promise.all([
      db.query(
        `${movieSelect} WHERE ${published} AND m.featured_spotlight ORDER BY m.editorial_order,m.id LIMIT 8`,
      ),
      db.query(
        `${movieSelect} WHERE ${published} AND m.curated ORDER BY m.editorial_order,m.id LIMIT 12`,
      ),
      getMoods(db),
      db.query(
        `SELECT DISTINCT unnest(m.genres) AS genre FROM movies m WHERE ${published} ORDER BY genre LIMIT 200`,
      ),
      db.query(`SELECT count(*)::int AS total FROM movies m WHERE ${published}`),
    ]);
    res.json({
      status: 'ok',
      data: {
        spotlights: spotlights.rows.map(transformMovie),
        curated: curated.rows.map(transformMovie),
        moods,
        genres: genres.rows.map((row) => row.genre),
        total: count.rows[0].total,
      },
    });
  });
  router.get('/movies', async (req, res) => {
    const query = movieQuerySchema.parse(req.query);
    const params: unknown[] = [];
    const where = [published];
    const add = (value: unknown) => {
      params.push(value);
      return `$${params.length}`;
    };
    if (query.genre && query.genre !== 'All') where.push(`${add(query.genre)}=ANY(m.genres)`);
    if (query.mood) where.push(`${add(query.mood)}=ANY(m.moods)`);
    if (query.search)
      where.push(
        `to_tsvector('simple',coalesce(m.title,'') || ' ' || coalesce(m.director,'') || ' ' || coalesce(m.synopsis,'')) @@ plainto_tsquery('simple',${add(query.search)})`,
      );
    const filters = where.join(' AND ');
    const sort = {
      match: 'm.title ASC',
      title: 'm.title ASC',
      curator: 'm.curator_score DESC NULLS LAST',
      year: 'm.year DESC NULLS LAST',
      runtime: 'm.runtime_minutes ASC NULLS LAST',
    }[query.sort];
    const count = await db.query(
      `SELECT count(*)::int AS total FROM movies m WHERE ${filters}`,
      params,
    );
    const values = [...params, query.limit, query.offset];
    const result = await db.query(
      `${movieSelect} WHERE ${filters} ORDER BY ${sort},m.id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      values,
    );
    const movies = result.rows.map(transformMovie).map((movie) =>
      query.region
        ? {
            ...movie,
            streamPlatforms: movie.streamPlatforms.filter(
              (offer: { region: string }) => offer.region === query.region,
            ),
          }
        : movie,
    );
    res.json({
      status: 'ok',
      data: movies,
      pagination: pagination(query.limit, query.offset, count.rows[0].total),
    });
  });
  router.get('/movies/:movieId', async (req, res) => {
    const id = idSchema.parse(req.params.movieId);
    const { rows } = await db.query(`${movieSelect} WHERE ${published} AND m.id=$1`, [id]);
    if (!rows.length) throw new AppError('Movie not found', 404);
    res.json({ status: 'ok', data: transformMovie(rows[0]) });
  });

  return router;
}
