# CLAUDE.md — Marketing / Meta Ads Wizard

Este directorio contiene el módulo de Marketing: wizard de campañas Meta Ads + dashboard con asistente IA (Claude/OpenAI).

**Rama de trabajo: `marketing/meta-ads`**
Todo cambio en este directorio debe hacerse en la rama `marketing/meta-ads`.
Para subir a producción: merge a `main` → EasyPanel reconstruye el servicio `Dockerfile.marketing`.

```bash
# Trabajar en la rama correcta
git checkout marketing/meta-ads

# Subir a producción
git push origin marketing/meta-ads:main
```

## Commands

```bash
# PRIMARY — Wizard web (9-step campaign creator)
streamlit run wizard_app.py

# Legacy GUI (OpenAI image analysis, manual ad creation)
streamlit run gui_app.py

# CLI
python main.py --help
python main.py analyze
python main.py status --nombre "Mi Idea"
python main.py plan --empresa "Descripción" --objetivo REACH --presupuesto 100 --diario 10
python main.py create --empresa "Descripción" --image-hash <hash>

# Page management (CLI)
python main.py page info
python main.py page feed --limit 25
python main.py page post --message "texto"
python main.py page insights --preset last_30d

# Utility scripts (now in scripts/)
python scripts/schedule_daily_posts.py --folder /path/to/images --dry-run
python scripts/schedule_daily_posts.py --folder /path/to/images --message-file scripts/messages_daily.txt

# Test API connection
python test_connection.py
```

## Environment Setup

The `.env` file lives in the **project directory** (`/home/javlabs/meta-ads-automation/.env`). `config.py` loads it from `Path(__file__).parent / ".env"`. Same for `wizard_app.py`.

Required env vars:
```
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=          # Long-lived user token
META_AD_ACCOUNT_ID=         # Will auto-prefix with "act_" if missing
META_PAGE_ID=
META_PAGE_ACCESS_TOKEN=     # Falls back to ACCESS_TOKEN if not set
OPENIA_API_KEY=             # OpenAI key — used by wizard and gui (intentional typo, missing N)
ANTHROPIC_API_KEY=          # Optional — Claude is preferred over OpenAI when both are set
```

## Architecture

Three entry points:

**Wizard (`wizard_app.py`)** — PRIMARY. Streamlit 9-step wizard. Uses unified AI backend: prefers Anthropic (`claude-sonnet-4-6`), falls back to OpenAI (`gpt-4.1-mini`) via `OPENIA_API_KEY`. Creates campaigns via `meta/campaign.py`.

**CLI (`main.py`)** — Click-based tool. Uses Claude Haiku via `ai/strategist.py` to generate `CampaignPlan` objects, then creates campaigns via `meta/campaign.py`.

**GUI (`gui_app.py`)** — Legacy Streamlit app. Uses OpenAI GPT-4o (`openai_helper.py`) for image analysis. Superseded by wizard but still functional.

### Module layout

| Module | Role |
|---|---|
| `config.py` | Central env loader; exports `ACCESS_TOKEN`, `AD_ACCOUNT_ID`, `PAGE_ID`, etc. |
| `meta/client.py` | Initializes `FacebookAdsApi` singleton; provides `get_ad_account()` |
| `meta/campaign.py` | Campaign/adset/ad CRUD — **direct REST calls to v25.0** (not SDK) |
| `meta/pages.py` | `FacebookPagesAPI` class for page content; uses Graph API v19.0 |
| `meta/analyzer.py` | Account insights and campaign listing via the SDK |
| `ai/strategist.py` | Calls Claude Haiku to generate a `CampaignPlan` from JSON response |
| `ai/prompts.py` | Prompt templates |
| `models/campaign_plan.py` | `CampaignPlan` and `Audience` dataclasses |
| `openai_helper.py` | GPT-4o vision calls for image analysis (legacy GUI only) |
| `gui_config.py` | Re-exports `config.py` values; validates `OPENIA_API_KEY` for GUI |
| `scripts/` | One-off scripts and scheduling utilities |
| `docs/` | Technical documentation and API notes |

### Data flow

Wizard: `wizard_app.py` → AI chat (Anthropic/OpenAI) → user fills fields → `meta/campaign.py` → Meta REST API v25.0

CLI: `main.py` → `ai/strategist.py` → `CampaignPlan` → `meta/campaign.py` → Meta REST API v25.0

GUI: `gui_app.py` → `openai_helper.py` (image analysis) → manual fields → `meta/campaign.py` → Meta REST API v25.0

### Wizard AI backend

`wizard_app.py` contains a unified AI backend:
- `has_ai()` — returns True if either `ANTHROPIC_API_KEY` or `OPENIA_API_KEY` is set
- `get_ai_client()` — returns `(client, backend)` tuple; prefers Anthropic
- `ai_chat_completion(system, messages, max_tokens)` — works transparently with both backends

### Critical quirks

- **Mixed SDK and REST**: `meta/client.py` and `meta/analyzer.py` use `facebook-business` SDK (v19), but `meta/campaign.py` calls `https://graph.facebook.com/v25.0/...` directly via `requests`. This was done to work around SDK limitations with newer API versions.
- **Hardcoded PAGE_ID**: `meta/campaign.py` has `PAGE_ID = "1130355880150943"` hardcoded inside `create_ad()`. This overrides the env var for ad creative creation.
- **OpenAI key typo**: The env var is `OPENIA_API_KEY` (missing `N`). This is intentional/established — do not rename it without updating `gui_config.py` and the `.env`.
- **Scheduling scripts**: `scripts/schedule_daily_posts.py` reads `PAGE_ID`/`PAGE_ACCESS_TOKEN` directly via `os.getenv()` (not from `config.py`), so they must be set without the `META_` prefix.
- **Interest exclusions**: Deprecated in Meta API v25.0 — do not add `exclusions` to targeting specs.
- **CONVERSATIONS optimization**: Requires `bid_amount` field in the adset payload.
