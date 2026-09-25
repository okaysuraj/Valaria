import { Router, Request, Response } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

/**
 * GET /api/watchlist/:sessionId
 * Get all watchlisted movie IDs for a session.
 */
router.get('/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const { rows } = await pool.query(`
    SELECT w.movie_id, w.added_at,
      m.title, m.director, m.year, m.runtime, m.match_score, m.backdrop, m.poster
    FROM watchlist w
    JOIN movies m ON m.id = w.movie_id
    WHERE w.session_id = $1
    ORDER BY w.added_at DESC
  `, [sessionId]);

  const watchlist = rows.map((row) => ({
    movieId: row.movie_id,
    title: row.title,
    director: row.director,
    year: row.year,
    runtime: row.runtime,
    matchScore: row.match_score,
    backdrop: row.backdrop,
    poster: row.poster,
    addedAt: row.added_at,
  }));

  res.json({ status: 'ok', data: watchlist });
});

/**
 * POST /api/watchlist/:sessionId/:movieId
 * Add a movie to the session's watchlist.
 */
router.post('/:sessionId/:movieId', async (req: Request, res: Response) => {
  const { sessionId, movieId } = req.params;

  // Verify the movie exists
  const movieCheck = await pool.query('SELECT id FROM movies WHERE id = $1', [movieId]);
  if (movieCheck.rows.length === 0) {
    throw new AppError('Movie not found', 404);
  }

  await pool.query(`
    INSERT INTO watchlist (session_id, movie_id)
    VALUES ($1, $2)
    ON CONFLICT (session_id, movie_id) DO NOTHING
  `, [sessionId, movieId]);

  res.status(201).json({ status: 'ok', message: `Added "${movieId}" to watchlist` });
});

/**
 * DELETE /api/watchlist/:sessionId/:movieId
 * Remove a movie from the session's watchlist.
 */
router.delete('/:sessionId/:movieId', async (req: Request, res: Response) => {
  const { sessionId, movieId } = req.params;

  const result = await pool.query(`
    DELETE FROM watchlist
    WHERE session_id = $1 AND movie_id = $2
  `, [sessionId, movieId]);

  if (result.rowCount === 0) {
    throw new AppError('Movie not found in watchlist', 404);
  }

  res.json({ status: 'ok', message: `Removed "${movieId}" from watchlist` });
});

/**
 * DELETE /api/watchlist/:sessionId
 * Clear the entire watchlist for a session.
 */
router.delete('/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  await pool.query('DELETE FROM watchlist WHERE session_id = $1', [sessionId]);
  res.json({ status: 'ok', message: 'Watchlist cleared' });
});

export default router;
