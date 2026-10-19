/** CLI: apply the checksummed schema once under a database transaction lock. */
import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createPool } from '../config/database.js';

async function main() {
  const connection = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
  if (!connection) throw new Error('DATABASE_DIRECT_URL or DATABASE_URL is required');
  const pool = createPool(connection);
  let client;
  try {
    client = await pool.connect();
    // Use the direct Neon endpoint for migrations; the transaction lock prevents
    // two deploy jobs from applying the bootstrap concurrently.
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(882403921)');
    await client.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations(version text PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())',
    );
    const sql = await readFile(resolve(__dirname, 'schema.sql'), 'utf8');
    const hash = createHash('sha256').update(sql).digest('hex');
    const prior = await client.query('SELECT checksum FROM schema_migrations WHERE version=$1', [
      '001_production_foundation',
    ]);
    if (prior.rows.length && prior.rows[0].checksum !== hash)
      throw new Error(
        'Applied migration checksum differs. Add a new migration instead of editing an applied one.',
      );
    if (!prior.rows.length) {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations(version,checksum) VALUES ($1,$2)', [
        '001_production_foundation',
        hash,
      ]);
    }
    await client.query('COMMIT');
    console.log(
      prior.rows.length
        ? 'Database is up to date.'
        : 'Production foundation migration applied. Catalog remains empty/unpublished until import.',
    );
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    throw error;
  } finally {
    client?.release();
    await pool.end();
  }
}
main().catch(() => {
  console.error(
    'Migration failed. Check connectivity, database permissions, and migration compatibility. No partial migration was committed.',
  );
  process.exitCode = 1;
});
