"""In-memory one-time code/token store.

Codes expire after `code_ttl_seconds`, allow up to `code_max_attempts`, and a
resend is throttled by `resend_cooldown_seconds`. Entries are wiped on backend
restart; swap this module for a Redis/Postgres-backed store before production.
"""

import secrets
import threading
import time

from .config import settings

_store: dict[str, dict] = {}
_lock = threading.Lock()


def _normalize(email: str) -> str:
    return email.strip().lower()


def _code_key(email: str, purpose: str) -> str:
    return f"{purpose}:{_normalize(email)}"


def _token_key(email: str) -> str:
    return f"token:{_normalize(email)}"


def _prune() -> None:
    now = time.time()
    expired = [k for k, v in _store.items() if v.get("expires_at", 0) < now]
    for k in expired:
        _store.pop(k, None)


def create_code(email: str, purpose: str) -> str | None:
    """Create a code, or return None if a resend is on cooldown."""
    with _lock:
        _prune()
        key = _code_key(email, purpose)
        existing = _store.get(key)
        if existing and (time.time() - existing.get("sent_at", 0)) < settings.resend_cooldown_seconds:
            return None
        code = f"{secrets.randbelow(10 ** settings.code_length):0{settings.code_length}d}"
        _store[key] = {
            "code": code,
            "purpose": purpose,
            "email": _normalize(email),
            "sent_at": time.time(),
            "expires_at": time.time() + settings.code_ttl_seconds,
            "attempts": 0,
        }
        return code


def check_code(email: str, purpose: str, code: str) -> bool:
    with _lock:
        _prune()
        key = _code_key(email, purpose)
        entry = _store.get(key)
        if not entry or entry.get("expires_at", 0) < time.time():
            return False
        entry["attempts"] = entry.get("attempts", 0) + 1
        if entry["attempts"] > settings.code_max_attempts:
            _store.pop(key, None)
            return False
        return secrets.compare_digest(entry["code"], code.strip())


def consume_code(email: str, purpose: str) -> None:
    with _lock:
        _store.pop(_code_key(email, purpose), None)


def issue_token(email: str) -> str:
    """Issue a single-use token (used to authorize a password reset)."""
    with _lock:
        _prune()
        token = secrets.token_urlsafe(24)
        _store[_token_key(email)] = {
            "token": token,
            "expires_at": time.time() + settings.code_ttl_seconds,
        }
        return token


def check_token(email: str, token: str) -> bool:
    with _lock:
        _prune()
        entry = _store.get(_token_key(email))
        if not entry or entry.get("expires_at", 0) < time.time():
            return False
        return secrets.compare_digest(entry["token"], token)


def consume_token(email: str) -> None:
    with _lock:
        _store.pop(_token_key(email), None)
