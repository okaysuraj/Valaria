/** Translate API, validation, and database failures into safe HTTP responses. */
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

function describeError(error: unknown) {
  if (error instanceof AppError) return { status: error.statusCode, message: error.message };
  if (error instanceof ZodError) {
    return { status: 400, message: 'Invalid request parameters or body' };
  }

  const details = error as { type?: string; code?: string } | null;
  if (details?.type === 'entity.too.large') {
    return { status: 413, message: 'Request body is too large' };
  }
  if (details?.type === 'entity.parse.failed') {
    return { status: 400, message: 'Invalid JSON body' };
  }
  const unavailable = ['57014', '53300', '57P01', 'ECONNREFUSED', 'ETIMEDOUT'];
  if (unavailable.includes(details?.code || '')) {
    return { status: 503, message: 'Service temporarily unavailable' };
  }
  return { status: 500, message: 'Internal server error' };
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error);
    return;
  }
  const { status, message } = describeError(error);
  // Never log authorization headers, credentials, SQL values, URLs, or user data.
  if (status >= 500) console.error(`[api] Request failed (${status})`);
  res.status(status).json({ status: 'error', message });
}
export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError('Route not found', 404));
}
