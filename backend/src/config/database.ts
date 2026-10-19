/** PostgreSQL pooling, verified remote TLS, and transaction boundaries. */
import pg from 'pg';

export type Row = Record<string, any>;
export interface SqlClient {
  query(sql: string, values?: unknown[]): Promise<{ rows: Row[]; rowCount: number | null }>;
}
export interface Database extends SqlClient {
  transaction<T>(work: (client: SqlClient) => Promise<T>): Promise<T>;
}

export function createPool(connectionString: string): pg.Pool {
  const url = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(url.protocol))
    throw new Error('DATABASE_URL must be a PostgreSQL URL');
  const local = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname);
  const max = Number(process.env.PG_POOL_MAX || 10);
  if (!Number.isInteger(max) || max < 1 || max > 50)
    throw new Error('PG_POOL_MAX must be an integer between 1 and 50');
  // Do not allow sslmode=require in a connection string to silently weaken
  // node-postgres certificate verification for remote database connections.
  ['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach((key) => url.searchParams.delete(key));
  const pool = new pg.Pool({
    connectionString: url.toString(),
    ssl: local ? false : { rejectUnauthorized: true },
    max,
    min: 0,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    statement_timeout: 10_000,
    query_timeout: 12_000,
    application_name: 'valaria-api',
  });
  pool.on('error', () =>
    console.error('[database] An idle connection failed; the pool will reconnect.'),
  );
  return pool;
}

export function databaseFromPool(pool: pg.Pool): Database {
  return {
    query: (sql, values) => pool.query(sql, values),
    async transaction(work) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await work(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
