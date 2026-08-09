"""Assign or revoke the admin role for a Firebase user via custom claims.

Custom claims are the only safe way to track roles — they are set server-side
with the Admin SDK and cannot be forged by a client.

Usage (from the backend/ folder):
    python -m app.assign_admin you@camp.com          # grant admin
    python -m app.assign_admin you@camp.com --remove  # revoke admin
"""

import os
import sys

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import auth, credentials

load_dotenv()


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    revoke = "--remove" in sys.argv[1:]

    if not args:
        sys.exit("Usage: python -m app.assign_admin <email-or-uid> [--remove]")

    identifier = args[0]

    credentials_path = os.getenv(
        "FIREBASE_CREDENTIALS_PATH", "firebase-admin.json"
    )
    if not os.path.exists(credentials_path):
        sys.exit(
            f"Service account not found at {credentials_path}. "
            "Download it from Firebase Console -> Project settings -> "
            "Service accounts and save it as firebase-admin.json in backend/."
        )

    if not firebase_admin._apps:
        firebase_admin.initialize_app(credentials.Certificate(credentials_path))

    user = (
        auth.get_user(identifier)
        if "@" not in identifier
        else auth.get_user_by_email(identifier)
    )

    claims = dict(user.custom_claims or {})
    if revoke:
        claims.pop("admin", None)
    else:
        claims["admin"] = True
    auth.set_custom_user_claims(user.uid, claims)

    action = "revoked" if revoke else "granted"
    print(f"Admin role {action} for {user.email} ({user.uid})")
    print(f"Custom claims now: {claims}")


if __name__ == "__main__":
    main()
