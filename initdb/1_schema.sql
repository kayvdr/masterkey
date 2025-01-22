BEGIN;

CREATE EXTENSION pg_trgm;

CREATE TABLE platforms (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL
);

CREATE TABLE accounts (
  id uuid PRIMARY KEY,
  username text NOT NULL,
  password text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  creator_id uuid NOT NULL,
  platform_id uuid NOT NULL REFERENCES platforms (id)
);

CREATE TABLE reported_accounts (
  id uuid NOT NULL,
  account_id uuid NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  creator_id uuid NOT NULL,
  reported_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE votes_values AS ENUM
  ( 'up'
  , 'down'
  );

CREATE TABLE votes (
  id uuid PRIMARY KEY,
  value votes_values NOT NULL,
  account_id uuid NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  creator_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_delete_request (
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;
