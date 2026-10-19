/** Validate catalog manifests before they can change the database. */
import { z } from 'zod';
import { httpsUrl, idSchema } from '../validation.js';

const text = (max = 1000) => z.string().trim().min(1).max(max);
const optionalText = (max = 1000) => text(max).nullable().optional();
const timestamp = z
  .string()
  .datetime({ offset: true })
  .refine(
    (value) => Date.parse(value) <= Date.now() + 60_000,
    'Verification cannot be in the future',
  );
const strings = (max: number, length = 200) =>
  z
    .array(text(length))
    .max(max)
    .transform((values) => [...new Set(values)]);
const platformSchema = z
  .object({
    name: text(100),
    type: z.enum(['subscription', 'free_curated', 'premiere']),
    logoText: text(20),
    badgeColor: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .nullable()
      .optional(),
    url: httpsUrl,
    region: z.string().regex(/^[A-Z]{2}$/),
    verifiedAt: timestamp,
    expiresAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .refine(
    (value) =>
      Date.parse(value.expiresAt) > Date.parse(value.verifiedAt) &&
      Date.parse(value.expiresAt) - Date.parse(value.verifiedAt) <= 30 * 86400_000,
    'Provider availability must expire within 30 days of verification',
  );
const movieSchema = z
  .object({
    id: idSchema,
    title: text(500),
    sourceRecordId: text(200),
    sourceUrl: httpsUrl,
    verifiedAt: timestamp,
    originalTitle: optionalText(500),
    tagline: optionalText(),
    director: optionalText(500),
    year: z.number().int().min(1880).max(2200).nullable().optional(),
    runtimeMinutes: z.number().int().min(1).max(14400).nullable().optional(),
    rating: optionalText(50),
    imdbScore: z
      .string()
      .regex(/^(?:[0-9](?:\.[0-9])?|10(?:\.0)?)$/)
      .nullable()
      .optional(),
    curatorScore: z.number().int().min(0).max(100).nullable().optional(),
    curatorScoreSource: optionalText(),
    genres: strings(30, 100).default([]),
    moods: z.array(idSchema).max(30).default([]),
    synopsis: optionalText(20000),
    curatorNote: optionalText(10000),
    backdrop: httpsUrl.nullable().optional(),
    poster: httpsUrl.nullable().optional(),
    trailerId: z
      .string()
      .regex(/^[A-Za-z0-9_-]{11}$/)
      .nullable()
      .optional(),
    featuredSpotlight: z.boolean().default(false),
    curated: z.boolean().default(false),
    editorialOrder: z.number().int().min(0).max(100000).default(0),
    published: z.boolean().default(true),
    cast: strings(100).default([]),
    awards: strings(100, 1000).default([]),
    technicalSpecs: z
      .object({
        resolution: optionalText(200),
        aspectRatio: optionalText(200),
        audio: optionalText(500),
        colorGrade: optionalText(500),
        fps: optionalText(100),
      })
      .strict()
      .optional(),
    streamPlatforms: z.array(platformSchema).max(30).default([]),
  })
  .strict()
  .refine(
    (value) => value.curatorScore == null || Boolean(value.curatorScoreSource),
    'A curator score requires its actual editorial source',
  );

export const catalogImportSchema = z
  .object({
    rightsConfirmed: z.literal(true),
    source: z
      .object({
        id: idSchema,
        name: text(200),
        url: httpsUrl,
        license: text(2000),
        retrievedAt: timestamp,
      })
      .strict(),
    moods: z
      .array(
        z
          .object({
            id: idSchema,
            label: text(100),
            tagline: text(1000),
            accentHue: z.string().regex(/^#[0-9a-fA-F]{6}$/),
            matchGenreKeys: strings(30, 100),
            position: z.number().int().min(0).max(10000).default(0),
          })
          .strict(),
      )
      .max(100)
      .default([]),
    movies: z.array(movieSchema).max(1000),
  })
  .strict()
  .superRefine((value, ctx) => {
    for (const [key, items] of [
      ['movies', value.movies],
      ['moods', value.moods],
    ] as const) {
      if (new Set(items.map((item) => item.id)).size !== items.length)
        ctx.addIssue({ code: 'custom', path: [key], message: 'Duplicate IDs are not permitted' });
    }
  });

export type CatalogManifest = z.infer<typeof catalogImportSchema>;
