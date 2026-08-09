"""Admin endpoints: overview stats, user listing, and user moderation.

Requires a Firebase ID token whose decoded claims include `admin: true`.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from pydantic import BaseModel

from .. import db, firebase

router = APIRouter(prefix="/admin", tags=["admin"])


def get_current_admin(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        decoded = firebase.verify_id_token(authorization.removeprefix("Bearer ").strip())
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not decoded.get("admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return decoded["uid"]


def _rows_by_uid() -> dict[str, dict]:
    return {row["uid"]: row for row in db.get_all_users()}


def _to_admin_user(fb_user, row: dict | None) -> dict:
    email = fb_user.email or ""
    local = email.split("@")[0] if email else fb_user.uid[:8]
    username = (row or {}).get("username") or ""
    created = getattr(fb_user.user_metadata, "creation_timestamp", None)
    if created:
        joined = datetime.fromtimestamp(created / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
    elif row and row.get("created_at"):
        joined = row["created_at"].strftime("%Y-%m-%d")
    else:
        joined = ""
    return {
        "id": fb_user.uid,
        "email": email,
        "name": fb_user.display_name or username or local,
        "handle": "@" + (username or local).lower(),
        "avatarUrl": fb_user.photo_url or "",
        "verified": bool((row or {}).get("email_verified", fb_user.email_verified)),
        "banned": bool((row or {}).get("banned", False)),
        "posts": 0,
        "joined": joined,
    }


def _merged_users() -> list[dict]:
    rows = _rows_by_uid()
    return [_to_admin_user(fb_user, rows.get(fb_user.uid)) for fb_user in firebase.list_users()]


class UserPatch(BaseModel):
    verified: bool | None = None
    banned: bool | None = None


@router.get("/overview")
def overview(_admin_uid: str = Depends(get_current_admin)) -> dict:
    users = _merged_users()
    return {
        "totalUsers": len(users),
        "emailSubscribers": 0,
        "verifiedUsers": sum(1 for u in users if u["verified"]),
        "bannedUsers": sum(1 for u in users if u["banned"]),
        "pendingPosts": 0,
    }


@router.get("/users")
def list_users(
    q: str = Query(default=""),
    filter: str = Query(default="all"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=100, ge=1, le=500),
    _admin_uid: str = Depends(get_current_admin),
) -> dict:
    needle = q.strip().lower()
    filtered: list[dict] = []
    for user in _merged_users():
        if filter == "verified" and not user["verified"]:
            continue
        if filter == "banned" and not user["banned"]:
            continue
        if needle and needle not in user["email"].lower() and needle not in user["name"].lower():
            continue
        filtered.append(user)

    total = len(filtered)
    start = (page - 1) * page_size
    return {
        "users": filtered[start : start + page_size],
        "total": total,
    }


@router.patch("/users/{uid}")
def update_user(uid: str, patch: UserPatch, _admin_uid: str = Depends(get_current_admin)) -> dict:
    try:
        fb_user = firebase.get_user(uid)
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")

    if patch.verified is True:
        firebase.mark_email_verified(fb_user.email or "")
    elif patch.verified is False:
        db.set_user_flags(uid, fb_user.email or "", verified=False)

    if patch.banned is not None:
        db.set_user_flags(uid, fb_user.email or "", banned=patch.banned)

    rows = _rows_by_uid()
    return _to_admin_user(fb_user, rows.get(uid))
