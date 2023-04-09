BEGIN;

CREATE EXTENSION pg_trgm;

CREATE TABLE platforms (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  domain text NOT NULL
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  username text NOT NULL,
  password text NOT NULL,
  votes_up integer,
  votes_down integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  platform_id uuid NOT NULL REFERENCES platforms (id)
);

COMMIT;
