import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar .env desde el directorio del proyecto
root_env = Path(__file__).parent / ".env"
load_dotenv(root_env)

# Mapear variables con prefijo META_ o nombres viejos
APP_ID = os.getenv("META_APP_ID") or os.getenv("APP_ID")
APP_SECRET = os.getenv("META_APP_SECRET") or os.getenv("APP_SECRET")
ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN") or os.getenv("ACCESS_TOKEN")
AD_ACCOUNT_ID = os.getenv("META_AD_ACCOUNT_ID") or os.getenv("AD_ACCOUNT_ID")

# Asegurar que AD_ACCOUNT_ID tenga el prefijo "act_"
if AD_ACCOUNT_ID and not AD_ACCOUNT_ID.startswith("act_"):
    AD_ACCOUNT_ID = f"act_{AD_ACCOUNT_ID}"

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
PAGE_ID = os.getenv("META_PAGE_ID") or os.getenv("PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("META_PAGE_ACCESS_TOKEN") or os.getenv("PAGE_ACCESS_TOKEN", ACCESS_TOKEN)

def validate_config(require_anthropic=False, require_account_id=True):
    """Valida que las variables de config necesarias estén presentes."""
    missing = []

    if not ACCESS_TOKEN:
        missing.append("META_ACCESS_TOKEN (o ACCESS_TOKEN)")
    if require_account_id and not AD_ACCOUNT_ID:
        missing.append("META_AD_ACCOUNT_ID (o AD_ACCOUNT_ID)")
    if require_anthropic and not ANTHROPIC_API_KEY:
        missing.append("ANTHROPIC_API_KEY")

    if missing:
        raise ValueError(f"Missing env vars: {', '.join(missing)}")
