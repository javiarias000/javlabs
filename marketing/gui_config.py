"""Config para GUI - usa el mismo config.py que el resto del proyecto."""

from config import (
    ACCESS_TOKEN,
    AD_ACCOUNT_ID,
    ANTHROPIC_API_KEY,
    PAGE_ID,
    PAGE_ACCESS_TOKEN,
    validate_config,
)

OPENAI_API_KEY = __import__("os").getenv("OPENIA_API_KEY")

def validate_gui_config():
    """Valida que existan las variables requeridas para la GUI."""
    validate_config(require_anthropic=False, require_account_id=True)

    if not OPENAI_API_KEY:
        raise ValueError("Missing env var: OPENIA_API_KEY")
