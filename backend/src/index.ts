/** Start the API, validate deployment settings, and shut down connections cleanly. */
import 'dotenv/config';
import { createApp } from './app.js';
import { verifyFirebaseToken, deleteFirebaseIdentity } from './auth.js';
import { createPool, databaseFromPool } from './config/database.js';

const production = process.env.NODE_ENV === 'production';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. See .env.example.');
if (production && !process.env.CORS_ORIGINS)
  throw new Error('CORS_ORIGINS is required in production.');
if (production && !process.env.FIREBASE_PROJECT_ID)
  throw new Error('FIREBASE_PROJECT_ID is required in production.');
if (production && process.env.FIREBASE_AUTH_EMULATOR_HOST)
  throw new Error('Firebase emulator is forbidden in production.');
const origins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
if (
  origins.some((value) => {
    try {
      return new URL(value).origin !== value || (production && !value.startsWith('https://'));
    } catch {
      return true;
    }
  })
)
  throw new Error('CORS_ORIGINS must contain exact origins (HTTPS in production).');
const port = Number(process.env.PORT || 4000);
const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
if (!Number.isInteger(proxyHops) || proxyHops < 0 || proxyHops > 10)
  throw new Error('Invalid TRUST_PROXY_HOPS');
const pool = createPool(process.env.DATABASE_URL);
const app = createApp({
  db: databaseFromPool(pool),
  verifyToken: verifyFirebaseToken,
  deleteIdentity: deleteFirebaseIdentity,
  allowedOrigins: origins,
  trustProxy: proxyHops,
});
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Valaria API listening on port ${port}`);
});
server.requestTimeout = 20_000;
server.headersTimeout = 15_000;
server.keepAliveTimeout = 5_000;
server.maxRequestsPerSocket = 100;
let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  const deadline = setTimeout(() => {
    server.closeAllConnections();
    process.exit(1);
  }, 15_000);
  deadline.unref();
  server.close(async () => {
    await pool.end();
    clearTimeout(deadline);
  });
  server.closeIdleConnections();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
