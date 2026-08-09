"""PostgreSQL store for user records and email-verification status.

The `users.email_verified` flag is the source of truth for "has the user
verified their email". Rows are created lazily via GET /auth/me and updated
by the verification flow.
"""

from psycopg2 import pool

from .config import settings

_pool: pool.SimpleConnectionPool | None = None

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    uid            TEXT PRIMARY KEY,
    email          TEXT NOT NULL UNIQUE,
    username       TEXT NOT NULL DEFAULT '',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    banned         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""

MIGRATIONS = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN NOT NULL DEFAULT FALSE",
]


def _conn():
    global _pool
    if _pool is None:
        if not settings.database_url:
            raise RuntimeError("DATABASE_URL is not set")
        _pool = pool.SimpleConnectionPool(1, 10, settings.database_url)
    return _pool.getconn()


def _release(conn) -> None:
    _pool.putconn(conn)


def init_db() -> None:
    conn = _conn()
    try:
        with conn.cursor() as cur:
            cur.execute(SCHEMA)
            for statement in MIGRATIONS:
                cur.execute(statement)
        conn.commit()
    finally:
        _release(conn)


def upsert_user(
    uid: str, email: str, username: str = "", email_verified: bool = False
) -> None:
    conn = _conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (uid, email, username, email_verified)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (uid) DO UPDATE SET
                    email = EXCLUDED.email,
                    username = CASE
                        WHEN users.username = '' THEN EXCLUDED.username
                        ELSE users.username
                    END,
                    email_verified = users.email_verified OR EXCLUDED.email_verified,
                    updated_at = now()
                """,
                (uid, email, username, email_verified),
            )
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        _release(conn)


def get_user(uid: str) -> dict | None:
    conn = _conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT uid, email, username, email_verified FROM users WHERE uid = %s",
                (uid,),
            )
            row = cur.fetchone()
        if not row:
            return None
        return {
            "uid": row[0],
            "email": row[1],
            "username": row[2],
            "email_verified": row[3],
        }
    finally:
        _release(conn)


def set_email_verified(uid: str) -> None:
    conn = _conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE users SET email_verified = TRUE, updated_at = now() "
                "WHERE uid = %s",
                (uid,),
            )
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        _release(conn)


def get_all_users() -> list[dict]:
    conn = _conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT uid, email, username, email_verified, banned, created_at "
                "FROM users ORDER BY created_at",
            )
            rows = cur.fetchall()
        return [
            {
                "uid": r[0],
                "email": r[1],
                "username": r[2],
                "email_verified": r[3],
                "banned": r[4],
                "created_at": r[5],
            }
            for r in rows
        ]
    finally:
        _release(conn)


def set_user_flags(
    uid: str,
    email: str,
    *,
    banned: bool | None = None,
    verified: bool | None = None,
) -> None:
    conn = _conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (uid, email, username, banned, email_verified)
                VALUES (%s, %s, '', %s, %s)
                ON CONFLICT (uid) DO UPDATE SET
                    email = EXCLUDED.email,
                    banned = CASE WHEN %s IS NULL THEN users.banned ELSE %s END,
                    email_verified = CASE WHEN %s IS NULL THEN users.email_verified ELSE %s END,
                    updated_at = now()
                """,
                (
                    uid,
                    email,
                    banned if banned is not None else False,
                    verified if verified is not None else False,
                    banned,
                    banned,
                    verified,
                    verified,
                ),
            )
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        _release(conn)
