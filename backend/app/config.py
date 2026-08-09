import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


class Settings:
    def __init__(self) -> None:
        # PostgreSQL
        self.database_url: str = os.getenv("DATABASE_URL", "")

        # Sendlib (email delivery)
        self.sendlib_api_url: str = os.getenv(
            "SENDLIB_API_URL", "https://sendlib.samueltuoyo.com/"
        )
        self.sendlib_api_key: str = os.getenv("SENDLIB_API_KEY", "")
        self.sendlib_from: str = os.getenv("SENDLIB_FROM", "")

        # Firebase Admin SDK
        self.firebase_credentials_path: str = os.getenv(
            "FIREBASE_CREDENTIALS_PATH", "firebase-admin.json"
        )
        self.firebase_storage_bucket: str = os.getenv("FIREBASE_STORAGE_BUCKET", "")

        # Auth codes
        self.debug: bool = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")
        self.code_length: int = int(os.getenv("AUTH_CODE_LENGTH", "6"))
        self.code_ttl_seconds: int = int(os.getenv("AUTH_CODE_TTL_SECONDS", "600"))
        self.code_max_attempts: int = int(os.getenv("AUTH_CODE_MAX_ATTEMPTS", "5"))
        self.resend_cooldown_seconds: int = int(
            os.getenv("AUTH_RESEND_COOLDOWN_SECONDS", "60")
        )


settings = Settings()
