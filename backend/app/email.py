import httpx

from .config import settings

SEND_ENDPOINT = settings.sendlib_api_url.rstrip("/") + "/api/send"


def _code_html(title: str, body: str, code: str, footer: str) -> str:
    return (
        "<div style='font-family:Arial,Helvetica,sans-serif;max-width:480px;"
        "margin:0 auto;padding:24px;color:#2b2319;background:#ffffff;'>"
        f"<h2 style='margin:0 0 12px;'>{title}</h2>"
        f"<p style='margin:0 0 16px;'>{body}</p>"
        f"<p style='font-size:34px;font-weight:bold;letter-spacing:8px;"
        f"margin:0 0 20px;'>{code}</p>"
        f"<p style='color:#6f6351;font-size:13px;margin:0;'>{footer}</p>"
        "</div>"
    )


def verification_email(code: str) -> tuple[str, str]:
    subject = "Verify your Campfire email"
    html = _code_html(
        "Your Campfire verification code",
        "Welcome! Use the code below to verify your account:",
        code,
        "This code expires in 10 minutes. If you didn't create an account, "
        "you can safely ignore this email.",
    )
    return subject, html


def reset_email(code: str) -> tuple[str, str]:
    subject = "Reset your Campfire password"
    html = _code_html(
        "Reset your password",
        "Use the code below to choose a new password:",
        code,
        "This code expires in 10 minutes. If you didn't request this, you can "
        "safely ignore this email.",
    )
    return subject, html


async def send_email(to: str, subject: str, html: str) -> bool:
    if not settings.sendlib_api_key:
        return False

    payload = {
        "to": to,
        "subject": subject,
        "html": html,
    }
    if settings.sendlib_from:
        payload["from"] = settings.sendlib_from
    headers = {
        "Authorization": f"Bearer {settings.sendlib_api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(SEND_ENDPOINT, json=payload, headers=headers)
    except httpx.HTTPError:
        return False

    return response.is_success
