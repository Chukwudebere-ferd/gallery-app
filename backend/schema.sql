-- Campfire users
-- `email_verified` is the source of truth for email verification.
-- Admins are auto-verified on sign-in (see GET /auth/me).

CREATE TABLE IF NOT EXISTS users (
    uid            TEXT PRIMARY KEY,
    email          TEXT NOT NULL UNIQUE,
    username       TEXT NOT NULL DEFAULT '',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
