from typing import Literal

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from .. import db, firebase
from .. import otp
from ..config import settings
from ..email import reset_email, send_email, verification_email

router = APIRouter(prefix="/auth", tags=["auth"])


class SendCodeRequest(BaseModel):
    email: str
    purpose: Literal["verify", "reset"] = "verify"


class VerifyCodeRequest(BaseModel):
    email: str
    purpose: Literal["verify", "reset"]
    code: str


class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str


def _valid_email(email: str) -> bool:
    local, sep, domain = email.partition("@")
    return bool(sep and local and "." in domain)


@router.post("/code/send")
async def send_code(req: SendCodeRequest) -> dict:
    if not _valid_email(req.email):
        raise HTTPException(status_code=400, detail="Enter a valid email address")

    code = otp.create_code(req.email, req.purpose)
    if code is None:
        raise HTTPException(
            status_code=429,
            detail="Please wait a moment before requesting another code.",
        )

    if req.purpose == "reset":
        try:
            firebase.get_user_by_email(req.email)
        except Exception:
            # Don't reveal whether an account exists.
            return {"ok": True}

    subject, html = (
        verification_email(code) if req.purpose == "verify" else reset_email(code)
    )
    sent = await send_email(req.email, subject, html)

    if not sent:
        if settings.debug:
            return {"ok": True, "debugCode": code}
        raise HTTPException(
            status_code=502,
            detail="We couldn't send the email right now. Please try again.",
        )

    result = {"ok": True}
    if settings.debug:
        result["debugCode"] = code
    return result


@router.get("/me")
async def me(request: Request) -> dict:
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not signed in.")
    token = header[len("Bearer ") :].strip()

    try:
        decoded = firebase.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Session expired. Sign in again.")

    uid = decoded["uid"]
    email = decoded.get("email") or ""
    is_admin = bool(decoded.get("admin"))

    # Admins are auto-verified on sign-in.
    db.upsert_user(uid, email, username="", email_verified=is_admin)

    row = db.get_user(uid)
    verified = bool(row["email_verified"]) if row else is_admin

    return {
        "uid": uid,
        "email": email,
        "username": (row or {}).get("username", ""),
        "verified": verified,
        "admin": is_admin,
    }


@router.post("/code/verify")
async def verify_code(req: VerifyCodeRequest) -> dict:
    if not otp.check_code(req.email, req.purpose, req.code):
        raise HTTPException(status_code=400, detail="That code is invalid or has expired.")

    if req.purpose == "verify":
        otp.consume_code(req.email, "verify")
        try:
            firebase.mark_email_verified(req.email)
            user = firebase.get_user_by_email(req.email)
            db.upsert_user(user.uid, user.email, email_verified=True)
        except Exception:
            raise HTTPException(
                status_code=502,
                detail="We couldn't confirm your email right now. Please try again.",
            )
        return {"ok": True}

    otp.consume_code(req.email, "reset")
    token = otp.issue_token(req.email)
    return {"ok": True, "resetToken": token}


@router.post("/password/reset")
async def reset_password(req: ResetPasswordRequest) -> dict:
    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="Use at least 8 characters.")

    if not otp.check_token(req.email, req.token):
        raise HTTPException(
            status_code=400,
            detail="This reset session has expired. Please start over.",
        )

    otp.consume_token(req.email)
    try:
        firebase.reset_password(req.email, req.new_password)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="We couldn't reset your password right now. Please try again.",
        )
    return {"ok": True}
