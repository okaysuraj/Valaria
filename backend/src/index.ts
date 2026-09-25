import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import moviesRouter from './routes/movies.js';
import moodsRouter from './routes/moods.js';
import watchlistRouter from './routes/watchlist.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// ─── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ─── Health Check ──────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time');
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      database: 'connected',
      serverTime: result.rows[0].server_time,
    });
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

// ─── API Routes ────────────────────────────────────────────
app.use('/api/movies', moviesRouter);
app.use('/api/moods', moodsRouter);
app.use('/api/watchlist', watchlistRouter);

// ─── Error Handling ────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   VALARIA CINEMA ARCHIVE — Backend API       ║
  ║   Local:   http://localhost:${PORT}             ║
  ║   Network: http://0.0.0.0:${PORT}               ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ╚══════════════════════════════════════════════╝
  `);
});

export default app;
