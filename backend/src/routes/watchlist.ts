/** Authenticated watchlist reads and bounded, idempotent changes. */
import { Router, type Request, type Response } from 'express';
import type { Database } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { movieSelect, published, transformMovie } from '../catalog.js';
import { idSchema, pagination, paginationSchema } from '../validation.js';

export function createWatchlistRouter(db: Database) {
  const router = Router();
  router.get('/watchlist/ids', async (req, res) => {
    const { rows } = await db.query(
      `SELECT w.movie_id FROM user_watchlist w JOIN movies m ON m.id=w.movie_id
      WHERE w.firebase_uid=$1 AND ${published} ORDER BY w.added_at DESC,w.movie_id LIMIT 1000`,
      [req.identity!.uid],
    );
    res.json({ status: 'ok', data: rows.map((row) => row.movie_id), total: rows.length });
  });
  router.get('/watchlist', async (req, res) => {
    const query = paginationSchema.strict().parse(req.query);
    const uid = req.identity!.uid;
    const count = await db.query(
      `SELECT count(*)::int AS total FROM user_watchlist w JOIN movies m ON m.id=w.movie_id WHERE w.firebase_uid=$1 AND ${published}`,
      [uid],
    );
    const { rows } = await db.query(
      `${movieSelect} JOIN user_watchlist w ON w.movie_id=m.id WHERE w.firebase_uid=$1 AND ${published}
      ORDER BY w.added_at DESC,m.id LIMIT $2 OFFSET $3`,
      [uid, query.limit, query.offset],
    );
    // Obtain addedAt alongside full details without duplicating the SELECT list.
    const dates = await db.query(
      'SELECT movie_id,added_at FROM user_watchlist WHERE firebase_uid=$1 AND movie_id=ANY($2::text[])',
      [uid, rows.map((row) => row.id)],
    );
    const dateMap = new Map(dates.rows.map((row) => [row.movie_id, row.added_at]));
    res.json({
      status: 'ok',
      data: rows.map((row) => transformMovie({ ...row, added_at: dateMap.get(row.id) })),
      pagination: pagination(query.limit, query.offset, count.rows[0].total),
    });
  });
  router.put('/watchlist/:movieId', addWatchlist);
  router.post('/watchlist/:movieId', addWatchlist);
  async function addWatchlist(req: Request, res: Response) {
    const movieId = idSchema.parse(req.params.movieId);
    const uid = req.identity!.uid;
    await db.transaction(async (client) => {
      // A row lock serializes mutations for this user, including concurrent adds.
      await client.query(
        'SELECT firebase_uid FROM user_profiles WHERE firebase_uid=$1 FOR UPDATE',
        [uid],
      );
      const movie = await client.query(`SELECT id FROM movies m WHERE id=$1 AND ${published}`, [
        movieId,
      ]);
      if (!movie.rows.length) throw new AppError('Movie not found', 404);
      const existing = await client.query(
        'SELECT 1 FROM user_watchlist WHERE firebase_uid=$1 AND movie_id=$2',
        [uid, movieId],
      );
      if (existing.rows.length) return;
      const count = await client.query(
        'SELECT count(*)::int AS total FROM user_watchlist WHERE firebase_uid=$1',
        [uid],
      );
      if (count.rows[0].total >= 1000)
        throw new AppError('Your watchlist has reached its 1000 film limit', 409);
      await client.query(
        'INSERT INTO user_watchlist(firebase_uid,movie_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [uid, movieId],
      );
    });
    res.json({ status: 'ok', data: null });
  }
  router.delete('/watchlist/:movieId', async (req, res) => {
    const movieId = idSchema.parse(req.params.movieId);
    await db.query('DELETE FROM user_watchlist WHERE firebase_uid=$1 AND movie_id=$2', [
      req.identity!.uid,
      movieId,
    ]);
    res.json({ status: 'ok', data: null });
  });
  router.delete('/watchlist', async (req, res) => {
    await db.query('DELETE FROM user_watchlist WHERE firebase_uid=$1', [req.identity!.uid]);
    res.json({ status: 'ok', data: null });
  });

  return router;
}
