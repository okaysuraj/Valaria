/** Finish account deletion across Firebase and PostgreSQL with durable retries. */
import { createHash } from 'node:crypto';
import type { Database } from './config/database.js';

export const uidHash = (uid: string) => createHash('sha256').update(uid).digest('hex');
export type DeleteIdentity = (uid: string) => Promise<void>;

/** Firebase deletion is idempotent. A failed second phase is retried by the
 * recovery command; the durable request prevents access during partial failure. */
export async function deleteAccount(db: Database, uid: string, deleteIdentity: DeleteIdentity) {
  await db.transaction(async (client) => {
    await client.query(
      'INSERT INTO account_deletion_requests(firebase_uid) VALUES ($1) ON CONFLICT DO NOTHING',
      [uid],
    );
    await client.query(
      "INSERT INTO deleted_account_tokens(uid_hash) VALUES ($1) ON CONFLICT(uid_hash) DO UPDATE SET expires_at=now()+interval '2 hours'",
      [uidHash(uid)],
    );
  });
  await deleteIdentity(uid);
  await db.transaction(async (client) => {
    await client.query('DELETE FROM user_profiles WHERE firebase_uid=$1', [uid]);
    await client.query('DELETE FROM account_deletion_requests WHERE firebase_uid=$1', [uid]);
  });
}
