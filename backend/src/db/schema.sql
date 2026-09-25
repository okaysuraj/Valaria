-- ============================================================
-- Valaria Cinema Archive — PostgreSQL Schema
-- ============================================================

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- MOVIES — Core film catalog
-- -------------------------------------------------------
CREATE TABLE movies (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  original_title  TEXT,
  tagline         TEXT NOT NULL,
  director        TEXT NOT NULL,
  year            INTEGER NOT NULL,
  runtime         TEXT NOT NULL,
  rating          TEXT NOT NULL,
  imdb_score      TEXT NOT NULL,
  curator_score   INTEGER NOT NULL,
  match_score     INTEGER NOT NULL,
  genres          TEXT[] NOT NULL DEFAULT '{}',
  moods           TEXT[] NOT NULL DEFAULT '{}',
  synopsis        TEXT NOT NULL,
  curator_note    TEXT NOT NULL,
  backdrop        TEXT NOT NULL,
  poster          TEXT NOT NULL,
  trailer_id      TEXT,
  trailer_embed_url TEXT,
  featured_spotlight BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- MOVIE_CAST — Ordered cast members per film
-- -------------------------------------------------------
CREATE TABLE movie_cast (
  id        SERIAL PRIMARY KEY,
  movie_id  TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  position  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_movie_cast_movie ON movie_cast(movie_id);

-- -------------------------------------------------------
-- MOVIE_AWARDS — Awards & festival honors
-- -------------------------------------------------------
CREATE TABLE movie_awards (
  id        SERIAL PRIMARY KEY,
  movie_id  TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  award     TEXT NOT NULL
);

CREATE INDEX idx_movie_awards_movie ON movie_awards(movie_id);

-- -------------------------------------------------------
-- TECHNICAL_SPECS — Archival technical specifications
-- -------------------------------------------------------
CREATE TABLE technical_specs (
  movie_id    TEXT PRIMARY KEY REFERENCES movies(id) ON DELETE CASCADE,
  resolution  TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  audio       TEXT NOT NULL,
  color_grade TEXT NOT NULL,
  fps         TEXT NOT NULL
);

-- -------------------------------------------------------
-- STREAM_PLATFORMS — Where each film is available
-- -------------------------------------------------------
CREATE TABLE stream_platforms (
  id          SERIAL PRIMARY KEY,
  movie_id    TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('subscription', 'free_curated', 'premiere')),
  logo_text   TEXT NOT NULL,
  badge_color TEXT
);

CREATE INDEX idx_stream_platforms_movie ON stream_platforms(movie_id);

-- -------------------------------------------------------
-- TASTE_MOODS — Aesthetic atmosphere presets
-- -------------------------------------------------------
CREATE TABLE taste_moods (
  id              TEXT PRIMARY KEY,
  label           TEXT NOT NULL,
  tagline         TEXT NOT NULL,
  accent_hue      TEXT NOT NULL DEFAULT '#E5A93C',
  match_genre_keys TEXT[] NOT NULL DEFAULT '{}'
);

-- -------------------------------------------------------
-- WATCHLIST — Per-session watchlisted movies
-- (Using a session_id approach for anonymous users)
-- -------------------------------------------------------
CREATE TABLE watchlist (
  id          SERIAL PRIMARY KEY,
  session_id  TEXT NOT NULL,
  movie_id    TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, movie_id)
);

CREATE INDEX idx_watchlist_session ON watchlist(session_id);

-- -------------------------------------------------------
-- Updated-at auto-trigger
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
