/** Assemble HTTP middleware and routes; startup and configuration live in index.ts. */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { randomUUID } from 'node:crypto';
import type { Database } from './config/database.js';
import { requireAuth, type VerifyToken } from './auth.js';
import { AppError, errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import type { DeleteIdentity } from './accountDeletion.js';
import { requireAccount } from './middleware/account.js';
import { createCatalogRouter } from './routes/catalog.js';
import { createWatchlistRouter } from './routes/watchlist.js';
import { createProfileRouter } from './routes/profile.js';

export interface AppOptions {
  db: Database;
  verifyToken: VerifyToken;
  deleteIdentity?: DeleteIdentity;
  allowedOrigins: string[];
  trustProxy?: number;
  rateLimitMax?: number;
}
export function createApp({
  db,
  verifyToken,
  deleteIdentity,
  allowedOrigins,
  trustProxy = 0,
  rateLimitMax = 120,
}: AppOptions) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet());
  app.use((_req, res, next) => {
    res.setHeader('X-Request-Id', randomUUID());
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new AppError('Origin is not allowed', 403));
      },
      credentials: false,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Authorization', 'Content-Type'],
    }),
  );
  app.get('/api/health/live', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use(
    '/api',
    rateLimit({
      windowMs: 60_000,
      limit: rateLimitMax,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { status: 'error', message: 'Too many requests. Try again shortly.' },
    }),
  );
  app.use(express.json({ limit: '16kb', strict: true }));
  app.get(['/api/health', '/api/health/ready'], async (_req, res) => {
    try {
      await db.query('SELECT 1');
      res.json({ status: 'ok', database: 'connected' });
    } catch {
      res.status(503).json({ status: 'error', database: 'unavailable' });
    }
  });
  app.use('/api', createCatalogRouter(db));
  app.use(
    '/api',
    requireAuth(verifyToken),
    requireAccount(db),
    createWatchlistRouter(db),
    createProfileRouter(db, deleteIdentity),
  );
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
