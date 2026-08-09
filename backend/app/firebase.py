import os

import firebase_admin
from firebase_admin import auth, credentials

from .config import settings

_app = None


def _initialize() -> None:
    global _app
    if _app is not None:
        return

    try:
        _app = firebase_admin.get_app()
        return
    except ValueError:
        pass

    path = settings.firebase_credentials_path
    if not os.path.exists(path):
        raise RuntimeError(
            f"Firebase credentials file not found at '{path}'. "
            "Download firebase-admin.json from Firebase Console -> Project "
            "settings -> Service accounts, or set FIREBASE_CREDENTIALS_PATH."
        )

    options = {}
    if settings.firebase_storage_bucket:
        options["storageBucket"] = settings.firebase_storage_bucket
    _app = firebase_admin.initialize_app(credentials.Certificate(path), options)


def get_user_by_email(email: str):
    _initialize()
    return auth.get_user_by_email(email)


def get_user(uid: str):
    _initialize()
    return auth.get_user(uid)


def list_users():
    _initialize()
    page = auth.list_users()
    while page is not None:
        yield from page.users
        if not page.next_page_token:
            break
        page = auth.list_users(page_token=page.next_page_token)


def verify_id_token(token: str) -> dict:
    _initialize()
    return auth.verify_id_token(token)


def mark_email_verified(email: str) -> None:
    _initialize()
    user = auth.get_user_by_email(email)
    auth.update_user(user.uid, email_verified=True)


def reset_password(email: str, new_password: str) -> None:
    _initialize()
    user = auth.get_user_by_email(email)
    auth.update_user(user.uid, password=new_password)
