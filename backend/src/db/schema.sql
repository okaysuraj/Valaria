-- Canonical bootstrap. Legacy records remain unpublished until re-imported with
-- provenance. No catalog or user content is seeded.
CREATE TABLE IF NOT EXISTS catalog_sources (
  id text PRIMARY KEY CHECK (id ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$'),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  url text NOT NULL CHECK (url ~ '^https://[^[:space:]]+$'),
  license text NOT NULL CHECK (length(license) BETWEEN 1 AND 2000),
  retrieved_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS movies (
  id text PRIMARY KEY, title text NOT NULL, original_title text, tagline text,
  director text, year integer, runtime text, rating text, imdb_score text,
  curator_score integer, match_score integer,
  genres text[] NOT NULL DEFAULT '{}', moods text[] NOT NULL DEFAULT '{}',
  synopsis text, curator_note text, backdrop text, poster text, trailer_id text,
  trailer_embed_url text, featured_spotlight boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE movies
  ADD COLUMN IF NOT EXISTS source_id text REFERENCES catalog_sources(id),
  ADD COLUMN IF NOT EXISTS source_record_id text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS runtime_minutes integer,
  ADD COLUMN IF NOT EXISTS curated boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS editorial_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS curator_score_source text;
ALTER TABLE movies
  ALTER COLUMN tagline DROP NOT NULL, ALTER COLUMN director DROP NOT NULL,
  ALTER COLUMN year DROP NOT NULL, ALTER COLUMN runtime DROP NOT NULL,
  ALTER COLUMN rating DROP NOT NULL, ALTER COLUMN imdb_score DROP NOT NULL,
  ALTER COLUMN curator_score DROP NOT NULL, ALTER COLUMN match_score DROP NOT NULL,
  ALTER COLUMN synopsis DROP NOT NULL, ALTER COLUMN curator_note DROP NOT NULL,
  ALTER COLUMN backdrop DROP NOT NULL, ALTER COLUMN poster DROP NOT NULL;
ALTER TABLE movies ADD CONSTRAINT movies_published_provenance CHECK (
  NOT published OR (source_id IS NOT NULL AND source_record_id IS NOT NULL
    AND length(source_record_id) > 0 AND source_url IS NOT NULL
    AND source_url ~ '^https://[^[:space:]]+$' AND verified_at IS NOT NULL)
);
ALTER TABLE movies ADD CONSTRAINT movies_identity_valid CHECK (id ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$' AND length(trim(title)) BETWEEN 1 AND 500) NOT VALID;
ALTER TABLE movies ADD CONSTRAINT movies_year_valid CHECK (year IS NULL OR year BETWEEN 1880 AND 2200) NOT VALID;
ALTER TABLE movies ADD CONSTRAINT movies_runtime_valid CHECK (runtime_minutes IS NULL OR runtime_minutes BETWEEN 1 AND 14400);
ALTER TABLE movies ADD CONSTRAINT movies_curator_valid CHECK (curator_score IS NULL OR curator_score BETWEEN 0 AND 100) NOT VALID;
ALTER TABLE movies ADD CONSTRAINT movies_editorial_source CHECK (NOT published OR curator_score IS NULL OR (curator_score_source IS NOT NULL AND length(trim(curator_score_source)) > 0));
ALTER TABLE movies ADD CONSTRAINT movies_public_metadata CHECK (NOT published OR (
  (poster IS NULL OR poster ~ '^https://[^[:space:]]+$') AND
  (backdrop IS NULL OR backdrop ~ '^https://[^[:space:]]+$') AND
  (trailer_id IS NULL OR trailer_id ~ '^[A-Za-z0-9_-]{11}$') AND
  (imdb_score IS NULL OR imdb_score ~ '^([0-9](\.[0-9])?|10(\.0)?)$') AND
  cardinality(genres)<=30 AND cardinality(moods)<=30
));
CREATE UNIQUE INDEX IF NOT EXISTS movies_source_record_unique ON movies(source_id, source_record_id);
CREATE INDEX IF NOT EXISTS movies_public_year ON movies(year DESC, id) WHERE published;
CREATE INDEX IF NOT EXISTS movies_public_curator ON movies(curator_score DESC, id) WHERE published;
CREATE INDEX IF NOT EXISTS movies_public_title ON movies(title, id) WHERE published;
CREATE INDEX IF NOT EXISTS movies_public_genres ON movies USING gin(genres) WHERE published;
CREATE INDEX IF NOT EXISTS movies_public_moods ON movies USING gin(moods) WHERE published;
CREATE INDEX IF NOT EXISTS movies_search ON movies USING gin(to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(director,'') || ' ' || coalesce(synopsis,''))) WHERE published;
CREATE TABLE IF NOT EXISTS movie_cast (
  id bigserial PRIMARY KEY, movie_id text NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  name text NOT NULL, position integer NOT NULL DEFAULT 0 CHECK (position >= 0)
);
CREATE INDEX IF NOT EXISTS idx_movie_cast_movie ON movie_cast(movie_id, position);
CREATE TABLE IF NOT EXISTS movie_awards (
  id bigserial PRIMARY KEY, movie_id text NOT NULL REFERENCES movies(id) ON DELETE CASCADE, award text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_movie_awards_movie ON movie_awards(movie_id);
CREATE TABLE IF NOT EXISTS technical_specs (
  movie_id text PRIMARY KEY REFERENCES movies(id) ON DELETE CASCADE,
  resolution text, aspect_ratio text, audio text, color_grade text, fps text
);
ALTER TABLE technical_specs ALTER COLUMN resolution DROP NOT NULL,
  ALTER COLUMN aspect_ratio DROP NOT NULL, ALTER COLUMN audio DROP NOT NULL,
  ALTER COLUMN color_grade DROP NOT NULL, ALTER COLUMN fps DROP NOT NULL;
CREATE TABLE IF NOT EXISTS stream_platforms (
  id bigserial PRIMARY KEY, movie_id text NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  name text NOT NULL, type text NOT NULL CHECK (type IN ('subscription','free_curated','premiere')),
  logo_text text NOT NULL, badge_color text
);
ALTER TABLE stream_platforms
  ADD COLUMN IF NOT EXISTS url text, ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz, ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE stream_platforms ADD CONSTRAINT stream_https CHECK (url IS NULL OR url ~ '^https://[^[:space:]]+$');
ALTER TABLE stream_platforms ADD CONSTRAINT stream_region CHECK (region IS NULL OR region ~ '^[A-Z]{2}$');
ALTER TABLE stream_platforms ADD CONSTRAINT stream_freshness CHECK (expires_at IS NULL OR (verified_at IS NOT NULL AND expires_at > verified_at));
CREATE INDEX IF NOT EXISTS idx_stream_platforms_movie ON stream_platforms(movie_id);
CREATE TABLE IF NOT EXISTS taste_moods (
  id text PRIMARY KEY, label text NOT NULL, tagline text NOT NULL,
  accent_hue text NOT NULL DEFAULT '#E5A93C', match_genre_keys text[] NOT NULL DEFAULT '{}'
);
ALTER TABLE taste_moods ADD COLUMN IF NOT EXISTS source_id text REFERENCES catalog_sources(id),
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;
ALTER TABLE taste_moods ADD CONSTRAINT moods_published_provenance CHECK (NOT published OR source_id IS NOT NULL);
CREATE TABLE IF NOT EXISTS user_profiles (
  firebase_uid text PRIMARY KEY CHECK (length(firebase_uid) BETWEEN 1 AND 128),
  display_name text CHECK (display_name IS NULL OR length(display_name) BETWEEN 1 AND 100),
  selected_mood_id text REFERENCES taste_moods(id) ON DELETE SET NULL,
  newsletter_opt_in boolean NOT NULL DEFAULT false, newsletter_consent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT newsletter_opt_in OR newsletter_consent_at IS NOT NULL)
);
-- UID always comes from Firebase Admin verification, never a client session ID.
CREATE TABLE IF NOT EXISTS user_watchlist (
  firebase_uid text NOT NULL REFERENCES user_profiles(firebase_uid) ON DELETE CASCADE,
  movie_id text NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (firebase_uid, movie_id)
);
CREATE INDEX IF NOT EXISTS user_watchlist_order ON user_watchlist(firebase_uid, added_at DESC, movie_id);
CREATE TABLE IF NOT EXISTS catalog_import_runs (
  id bigserial PRIMARY KEY, source_id text NOT NULL REFERENCES catalog_sources(id),
  content_sha256 text NOT NULL CHECK (length(content_sha256) = 64),
  imported_count integer NOT NULL CHECK (imported_count >= 0), imported_at timestamptz NOT NULL DEFAULT now()
);
-- Durable cross-service deletion recovery. A pending request blocks all personal
-- access until Firebase and PostgreSQL deletion have both completed.
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  firebase_uid text PRIMARY KEY CHECK (length(firebase_uid) BETWEEN 1 AND 128),
  requested_at timestamptz NOT NULL DEFAULT now()
);
-- Two hour hashed tombstones prevent already-in-flight requests recreating a
-- deleted profile. Firebase tokens are also verified against revocation.
CREATE TABLE IF NOT EXISTS deleted_account_tokens (
  uid_hash text PRIMARY KEY CHECK (length(uid_hash)=64),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 hours')
);
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_movies_updated_at ON movies;
CREATE TRIGGER trg_movies_updated_at BEFORE UPDATE ON movies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
