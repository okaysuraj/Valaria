/** CLI: retry interrupted account deletions; schedule this command every minute. */
import 'dotenv/config';
import { deleteFirebaseIdentity } from '../auth.js';
import { deleteAccount } from '../accountDeletion.js';
import { createPool, databaseFromPool } from '../config/database.js';

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const pool = createPool(process.env.DATABASE_URL);
  const db = databaseFromPool(pool);
  let failed = 0;
  try {
    const { rows } = await db.query(
      'SELECT firebase_uid FROM account_deletion_requests ORDER BY requested_at LIMIT 100',
    );
    for (const row of rows) {
      try {
        await deleteAccount(db, row.firebase_uid, deleteFirebaseIdentity);
      } catch {
        failed++;
      }
    }
    await db.query('DELETE FROM deleted_account_tokens WHERE expires_at<now()');
    console.log(`Account deletion recovery: ${rows.length - failed} completed, ${failed} pending.`);
    if (failed) process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
main().catch(() => {
  console.error('Account deletion recovery failed. Check database and Firebase configuration.');
  process.exitCode = 1;
});
