/** Validate API parameters and request bodies before they reach database queries. */
import { z } from 'zod';

export const idSchema = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/);
export const httpsUrl = z
  .string()
  .max(2048)
  .url()
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  }, 'An HTTPS URL without embedded credentials is required');
const integerQuery = (fallback: number, max: number, min = 0) =>
  z
    .string()
    .regex(/^\d{1,7}$/)
    .transform(Number)
    .pipe(z.number().int().min(min).max(max))
    .default(fallback);
export const paginationSchema = z.object({
  limit: integerQuery(24, 100, 1),
  offset: integerQuery(0, 100000),
});
export const movieQuerySchema = paginationSchema
  .extend({
    genre: z.string().trim().min(1).max(100).optional(),
    mood: idSchema.optional(),
    search: z.string().trim().min(1).max(200).optional(),
    sort: z.enum(['match', 'curator', 'year', 'runtime', 'title']).default('title'),
    region: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional(),
  })
  .strict();
export const profileSchema = z
  .object({
    selectedMoodId: idSchema.nullable().optional(),
    newsletterOptIn: z.boolean().optional(),
    displayName: z.string().trim().min(1).max(100).nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0);

export function pagination(limit: number, offset: number, total: number) {
  return { limit, offset, total, hasMore: offset + limit < total };
}
