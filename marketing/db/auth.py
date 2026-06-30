import hashlib
import secrets
import sqlite3
from datetime import datetime, timedelta

from db.database import get_conn


def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key  = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000)
    return f"{salt}:{key.hex()}"


def _verify_password(password: str, stored: str) -> bool:
    try:
        salt, key_hex = stored.split(":", 1)
        key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000)
        return secrets.compare_digest(key.hex(), key_hex)
    except Exception:
        return False


def register_user(email: str, name: str, password: str) -> dict:
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
            (email.lower().strip(), name.strip(), _hash_password(password)),
        )
        conn.commit()
        row = conn.execute(
            "SELECT id, email, name FROM users WHERE email = ?",
            (email.lower().strip(),),
        ).fetchone()
        return {"ok": True, "user": dict(row)}
    except sqlite3.IntegrityError:
        return {"ok": False, "error": "Este email ya está registrado."}
    finally:
        conn.close()


def login_user(email: str, password: str) -> dict:
    conn = get_conn()
    try:
        row = conn.execute(
            "SELECT id, email, name, password_hash FROM users WHERE email = ?",
            (email.lower().strip(),),
        ).fetchone()
        if not row or not _verify_password(password, row["password_hash"]):
            return {"ok": False, "error": "Email o contraseña incorrectos."}
        return {"ok": True, "user": {"id": row["id"], "email": row["email"], "name": row["name"]}}
    finally:
        conn.close()


def create_session(user_id: int, days: int = 30) -> str:
    token   = secrets.token_urlsafe(32)
    expires = datetime.now() + timedelta(days=days)
    conn    = get_conn()
    conn.execute(
        "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
        (token, user_id, expires.isoformat()),
    )
    conn.commit()
    conn.close()
    return token


def validate_session(token: str) -> dict | None:
    if not token:
        return None
    conn = get_conn()
    row  = conn.execute(
        """SELECT s.token, s.user_id, u.email, u.name
           FROM sessions s JOIN users u ON s.user_id = u.id
           WHERE s.token = ? AND s.expires_at > datetime('now')""",
        (token,),
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def delete_session(token: str):
    conn = get_conn()
    conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()


def list_users() -> list:
    conn = get_conn()
    rows = conn.execute(
        "SELECT id, email, name, created_at FROM users ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
