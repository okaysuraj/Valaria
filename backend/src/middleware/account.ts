/** Create a profile lazily and block access while account deletion is pending. */
import type { RequestHandler } from 'express';
import type { Database } from '../config/database.js';
import { uidHash } from '../accountDeletion.js';
import { AppError } from './errorHandler.js';

export function requireAccount(db: Database): RequestHandler {
  return async (req, _res, next) => {
    if (req.method === 'DELETE' && req.path === '/profile/account') {
      next();
      return;
    }
    await db.transaction(async (client) => {
      await client.query(
        'INSERT INTO user_profiles(firebase_uid) VALUES ($1) ON CONFLICT DO NOTHING',
        [req.identity!.uid],
      );
      await client.query(
        'SELECT firebase_uid FROM user_profiles WHERE firebase_uid=$1 FOR UPDATE',
        [req.identity!.uid],
      );
      const blocked = await client.query(
        `SELECT 1 FROM account_deletion_requests WHERE firebase_uid=$1
        UNION ALL SELECT 1 FROM deleted_account_tokens WHERE uid_hash=$2 AND expires_at>now() LIMIT 1`,
        [req.identity!.uid, uidHash(req.identity!.uid)],
      );
      if (blocked.rows.length)
        throw new AppError('This account has been deleted or is pending deletion', 410);
    });
    next();
  };
}
