# Meta Ads Automation

Herramienta para crear y gestionar campañas en Meta Ads (Facebook/Instagram) con asistencia de IA. Incluye un wizard web paso a paso y una CLI para usuarios avanzados.

---

## Inicio rápido

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Configurar variables de entorno
cp .env.example .env
nano .env   # Llenar con tus tokens

# 3. Verificar conexión
python test_connection.py

# 4. Lanzar el wizard
streamlit run wizard_app.py
```

---

## Características

- **Wizard web** (9 pasos) para crear campañas desde cero con guía de IA
- **Entrevista de negocio** — la IA hace 3 preguntas estratégicas y genera el perfil automáticamente
- **Copy asistido** — chat con IA para generar texto principal, titular y descripción del anuncio
- **Análisis de imágenes** — GPT-4.1-mini Vision analiza creativos subidos y sugiere copy
- **CLI** para análisis de campañas, gestión de páginas y creación programática
- **Análisis de campañas anteriores** — diagnóstico estratégico con IA sobre historial de Meta Ads

---

## Variables de entorno

Crear `.env` en la raíz del proyecto (ver `.env.example`):

| Variable | Descripción | Requerida |
|---|---|---|
| `META_ACCESS_TOKEN` | Token de usuario de Meta (long-lived) | Sí |
| `META_AD_ACCOUNT_ID` | ID de cuenta publicitaria (`act_XXXX`) | Sí |
| `META_PAGE_ID` | ID de la página de Facebook | Para ads |
| `META_PAGE_ACCESS_TOKEN` | Token de la página (fallback a `ACCESS_TOKEN`) | Para ads |
| `META_APP_ID` | App ID de Meta for Developers | Para SDK |
| `META_APP_SECRET` | App Secret de Meta | Para SDK |
| `OPENIA_API_KEY` | Clave de OpenAI (gpt-4.1-mini) | Para IA |
| `ANTHROPIC_API_KEY` | Clave de Anthropic (Claude) — preferida sobre OpenAI | Para IA |

> **Nota:** `OPENIA_API_KEY` tiene un typo intencional (falta la N). No renombrar sin actualizar `gui_config.py`.

---

## Estructura del proyecto

```
meta-ads-automation/
│
├── wizard_app.py          # Aplicación principal — wizard Streamlit de 9 pasos
├── gui_app.py             # GUI alternativa (OpenAI + creación manual)
├── main.py                # CLI (Click) para análisis y creación
├── config.py              # Cargador central de .env
├── gui_config.py          # Config para gui_app.py
├── openai_helper.py       # Helper de visión con GPT-4o (usado por gui_app)
├── test_connection.py     # Verifica conexión con Meta API
│
├── meta/                  # Módulos de Meta API
│   ├── client.py          # Inicializa FacebookAdsApi (SDK)
│   ├── campaign.py        # CRUD campañas/adsets/ads via REST v25.0
│   ├── pages.py           # API de páginas de Facebook
│   └── analyzer.py        # Insights y listado de campañas
│
├── ai/                    # Módulos de IA
│   ├── strategist.py      # Genera CampaignPlan con Claude Haiku (CLI)
│   └── prompts.py         # Templates de prompts
│
├── models/
│   └── campaign_plan.py   # Dataclasses: CampaignPlan, Audience
│
├── scripts/               # Scripts de un solo uso y utilidades
│   ├── schedule_daily_posts.py     # Publica desde carpeta de imágenes
│   ├── create_golden_strings_campaign.py  # Campaña específica GS
│   └── ...
│
└── docs/                  # Documentación técnica
    ├── META_API_V25_CAMPAIGN_CREATION.md
    ├── API_MIGRATION_V19_TO_V25.md
    ├── PAGES_API.md
    └── ...
```

---

## Wizard web (wizard_app.py)

El wizard guía el proceso en 9 pasos:

| Paso | Nombre | Descripción |
|---|---|---|
| 1 | Conectar | Valida token y cuenta de Meta |
| 2 | Estrategia | Entrevista de negocio con IA (3 preguntas) → perfil automático |
| 3 | Campaña | Nombre, objetivo, fechas |
| 4 | Audiencia | Ubicación, edad, intereses |
| 5 | Presupuesto | Diario o total |
| 6 | Copy | Chat con IA para generar texto del anuncio (3 variaciones A/B/C) |
| 7 | Creativos | Subir imágenes/videos — análisis automático con visión IA |
| 8 | Revisión | Resumen completo antes de crear |
| 9 | Crear | Envío a Meta API → Campaign + AdSet + Ads en estado PAUSED |

### Backend de IA

El wizard usa el primer backend disponible en este orden:

1. **Anthropic** (`ANTHROPIC_API_KEY`) → `claude-sonnet-4-6`
2. **OpenAI** (`OPENIA_API_KEY`) → `gpt-4.1-mini`

Si no hay ninguna clave configurada, las funciones de IA se deshabilitan pero el wizard sigue funcionando manualmente.

---

## CLI (main.py)

```bash
python main.py --help

# Analizar campañas activas
python main.py analyze

# Estado de una campaña
python main.py status --nombre "Mi campaña"

# Planificar campaña (usa Claude Haiku)
python main.py plan --empresa "Descripción" --objetivo REACH --presupuesto 100 --diario 10

# Crear campaña desde plan
python main.py create --empresa "Descripción" --image-hash <hash>

# Gestión de página
python main.py page info
python main.py page feed --limit 25
python main.py page post --message "texto"
python main.py page insights --preset last_30d
```

---

## Quirks técnicos

- **REST + SDK mezclados**: `meta/client.py` y `meta/analyzer.py` usan el SDK `facebook-business` (v19), pero `meta/campaign.py` llama directamente a `https://graph.facebook.com/v25.0/` vía `requests`. Esto fue necesario para compatibilidad con la API más nueva.
- **PAGE_ID hardcodeado**: `meta/campaign.py` tiene `PAGE_ID = "1130355880150943"` dentro de `create_ad()`. Overrides el env var para creación de creativos.
- **Exclusiones deprecadas**: Las exclusiones de intereses fueron removidas de la API en v25.0.
- **`schedule_daily_posts.py`**: Lee `PAGE_ID` y `PAGE_ACCESS_TOKEN` directamente vía `os.getenv()` (sin prefijo `META_`).

---

## Publicar posts programados

```bash
# Preview (dry-run)
python scripts/schedule_daily_posts.py --folder /ruta/imagenes --dry-run

# Publicar con mensajes desde archivo
python scripts/schedule_daily_posts.py --folder /ruta/imagenes --message-file scripts/messages_daily.txt
```
