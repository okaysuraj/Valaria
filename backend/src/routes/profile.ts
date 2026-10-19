/** Account preferences and deletion after a recent sign-in. */
import { Router } from 'express';
import type { Database } from '../config/database.js';
import type { Identity } from '../auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { profileSchema } from '../validation.js';
import { deleteAccount, type DeleteIdentity } from '../accountDeletion.js';

async function readProfile(db: Database, identity: Identity) {
  const { rows } = await db.query(
    'SELECT display_name,selected_mood_id,newsletter_opt_in FROM user_profiles WHERE firebase_uid=$1',
    [identity.uid],
  );
  return {
    displayName: rows[0].display_name,
    selectedMoodId: rows[0].selected_mood_id,
    newsletterOptIn: rows[0].newsletter_opt_in,
    email: identity.email ?? null,
    emailVerified: identity.emailVerified,
  };
}

export function createProfileRouter(db: Database, deleteIdentity?: DeleteIdentity) {
  const router = Router();
  router.get('/profile', async (req, res) => {
    res.json({
      status: 'ok',
      data: await readProfile(db, req.identity!),
    });
  });
  router.put('/profile', async (req, res) => {
    const value = profileSchema.parse(req.body);
    if (value.selectedMoodId) {
      const mood = await db.query('SELECT id FROM taste_moods WHERE id=$1 AND published', [
        value.selectedMoodId,
      ]);
      if (!mood.rows.length) throw new AppError('Mood not found', 400);
    }
    if (value.newsletterOptIn && !req.identity!.emailVerified)
      throw new AppError('Verify your email before subscribing', 403);
    const fields: string[] = [];
    const values: unknown[] = [req.identity!.uid];
    for (const [key, column] of [
      ['displayName', 'display_name'],
      ['selectedMoodId', 'selected_mood_id'],
      ['newsletterOptIn', 'newsletter_opt_in'],
    ] as const) {
      if (value[key] !== undefined) {
        values.push(value[key]);
        fields.push(`${column}=$${values.length}`);
      }
    }
    if (value.newsletterOptIn !== undefined)
      fields.push(
        value.newsletterOptIn
          ? 'newsletter_consent_at=coalesce(newsletter_consent_at,now())'
          : 'newsletter_consent_at=NULL',
      );
    await db.query(`UPDATE user_profiles SET ${fields.join(',')} WHERE firebase_uid=$1`, values);
    res.json({
      status: 'ok',
      data: await readProfile(db, req.identity!),
    });
  });
  router.delete('/profile/account', async (req, res) => {
    const age = Math.floor(Date.now() / 1000) - req.identity!.authTime;
    if (!Number.isFinite(age) || age < -60 || age > 300)
      throw new AppError('Sign in again before deleting your account', 403);
    if (!deleteIdentity) throw new AppError('Account deletion is not configured', 503);
    await deleteAccount(db, req.identity!.uid, deleteIdentity);
    res.json({ status: 'ok', data: null });
  });

  return router;
}
