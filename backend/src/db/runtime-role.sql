-- Run as the migration owner after db:migrate, in a dedicated database.
-- Grant this NOLOGIN role to the API's separately created Neon login. Keep the
-- migration owner credentials out of the deployed runtime environment.
CREATE ROLE valaria_runtime NOLOGIN;
GRANT CONNECT ON DATABASE neondb TO valaria_runtime;
GRANT USAGE ON SCHEMA public TO valaria_runtime;
GRANT SELECT ON movies,movie_cast,movie_awards,technical_specs,stream_platforms,taste_moods,catalog_sources TO valaria_runtime;
GRANT SELECT,INSERT,UPDATE,DELETE ON user_profiles,user_watchlist TO valaria_runtime;
GRANT SELECT,INSERT,UPDATE,DELETE ON account_deletion_requests,deleted_account_tokens TO valaria_runtime;
-- Example administrative action: GRANT valaria_runtime TO your_api_login;
-- Adapt the database name above if your Neon database is not named neondb.
