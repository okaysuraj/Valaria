import { Router, Request, Response } from 'express';
import pool from '../config/database.js';

const router = Router();

/**
 * GET /api/moods
 * Fetch all taste mood presets.
 */
router.get('/', async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT id, label, tagline, accent_hue, match_genre_keys
    FROM taste_moods
    ORDER BY label
  `);

  const moods = rows.map((row) => ({
    id: row.id,
    label: row.label,
    tagline: row.tagline,
    accentHue: row.accent_hue,
    matchGenreKeys: row.match_genre_keys,
  }));

  res.json({ status: 'ok', data: moods });
});

export default router;
