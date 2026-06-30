#!/usr/bin/env python3
"""
wizard_app.py — Meta Ads Campaign Wizard + Claude Code Assistant
Wizard paso a paso para crear campañas en Facebook/Instagram Ads,
con Claude Sonnet como asistente inteligente en cada pantalla.

Run: python3 -m streamlit run wizard_app.py
"""

import os, json, base64, requests, sys
from datetime import datetime
from pathlib import Path
import streamlit as st

# Ensure project root is in path for db imports
sys.path.insert(0, str(Path(__file__).parent))

from db.database import init_db
from db.auth import register_user, login_user, create_session, validate_session, delete_session
from db.storage import (
    save_meta_connection, load_meta_connection,
    save_wizard_draft, load_wizard_draft, list_wizard_drafts,
    delete_wizard_draft, rename_wizard_draft, mark_draft_created,
    save_business_profile, load_business_profile,
)

init_db()

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="JAV LABS · Marketing Meta",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── JAV LABS Brand Theme ──────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

/* Base font */
html, body, [class*="css"] {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

/* Sidebar brand header */
[data-testid="stSidebar"]::before {
    content: "JAV LABS";
    display: block;
    padding: 1.2rem 1.5rem 0.5rem;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.25em;
    color: #0d7ff2;
    text-transform: uppercase;
}

/* Metric cards */
[data-testid="stMetric"] {
    background: rgba(13, 127, 242, 0.05) !important;
    border: 1px solid rgba(13, 127, 242, 0.15) !important;
    border-radius: 12px !important;
    padding: 1rem 1.2rem !important;
}
[data-testid="stMetricValue"] {
    color: #f1f5f9 !important;
    font-weight: 700 !important;
}
[data-testid="stMetricLabel"] {
    color: #94a3b8 !important;
    font-size: 0.75rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
}

/* Primary buttons */
.stButton > button[kind="primary"],
.stButton > button[data-testid="baseButton-primary"] {
    background: linear-gradient(90deg, #0d7ff2, #8b5cf6) !important;
    border: none !important;
    color: white !important;
    font-weight: 700 !important;
    letter-spacing: 0.04em !important;
    border-radius: 8px !important;
    transition: all 0.2s ease !important;
}
.stButton > button[kind="primary"]:hover {
    background: linear-gradient(90deg, #0a68d9, #7c3aed) !important;
    box-shadow: 0 0 20px rgba(13, 127, 242, 0.4) !important;
    transform: translateY(-1px) !important;
}

/* Secondary buttons */
.stButton > button:not([kind="primary"]) {
    border-color: rgba(13, 127, 242, 0.3) !important;
    color: #94a3b8 !important;
    border-radius: 8px !important;
}
.stButton > button:not([kind="primary"]):hover {
    border-color: #0d7ff2 !important;
    color: #0d7ff2 !important;
}

/* Tab active indicator */
[data-baseweb="tab-highlight"] {
    background: linear-gradient(90deg, #0d7ff2, #8b5cf6) !important;
}
[data-baseweb="tab"][aria-selected="true"] {
    color: #0d7ff2 !important;
    font-weight: 700 !important;
}

/* Text inputs */
[data-testid="stTextInput"] input,
[data-testid="stTextArea"] textarea,
[data-testid="stNumberInput"] input {
    border-color: rgba(13, 127, 242, 0.25) !important;
    border-radius: 8px !important;
}
[data-testid="stTextInput"] input:focus,
[data-testid="stTextArea"] textarea:focus {
    border-color: #0d7ff2 !important;
    box-shadow: 0 0 0 1px rgba(13, 127, 242, 0.4) !important;
}

/* Select boxes */
[data-testid="stSelectbox"] > div > div {
    border-color: rgba(13, 127, 242, 0.25) !important;
    border-radius: 8px !important;
}

/* Progress bar */
[data-testid="stProgressBar"] > div > div {
    background: linear-gradient(90deg, #0d7ff2, #8b5cf6) !important;
}

/* Dividers */
hr {
    border-color: rgba(255, 255, 255, 0.08) !important;
    margin: 1.5rem 0 !important;
}

/* Success / Error / Warning boxes */
[data-testid="stAlert"][data-baseweb="notification"] {
    border-radius: 10px !important;
}

/* Expander */
[data-testid="stExpander"] {
    border: 1px solid rgba(13, 127, 242, 0.15) !important;
    border-radius: 10px !important;
    overflow: hidden !important;
}
[data-testid="stExpander"] summary {
    font-weight: 600 !important;
}

/* Header */
h1 { font-weight: 800 !important; letter-spacing: -0.02em !important; }
h2 { font-weight: 700 !important; }
h3 { font-weight: 600 !important; }
</style>
""", unsafe_allow_html=True)

# ── Constants ─────────────────────────────────────────────────────────────────
BASE_URL = "https://graph.facebook.com/v25.0"

STEPS = [
    (1, "Conectar"),
    (2, "Estrategia"),
    (3, "Campaña"),
    (4, "Audiencia"),
    (5, "Presupuesto"),
    (6, "Creativos"),
    (7, "Copy"),
    (8, "Revisión"),
    (9, "Crear"),
]

OBJECTIVES = {
    "💬 Mensajes / WhatsApp":   "OUTCOME_ENGAGEMENT",
    "📢 Alcance / Awareness":   "OUTCOME_AWARENESS",
    "🌐 Tráfico web":           "OUTCOME_TRAFFIC",
    "📋 Leads / Formulario":    "OUTCOME_LEADS",
    "🛒 Ventas / Conversiones": "OUTCOME_SALES",
}

OBJECTIVE_NOTES = {
    "OUTCOME_ENGAGEMENT":  "Meta mostrará el anuncio a personas más probables de enviarte un mensaje por WhatsApp.",
    "OUTCOME_AWARENESS":   "Meta maximiza el alcance — ideal para dar a conocer tu marca.",
    "OUTCOME_TRAFFIC":     "Meta enviará personas a tu sitio web.",
    "OUTCOME_LEADS":       "Meta recopilará datos de contacto mediante un formulario nativo.",
    "OUTCOME_SALES":       "Meta buscará personas con alta intención de compra.",
}

OPTIMIZATION_MAP = {
    "OUTCOME_ENGAGEMENT": "CONVERSATIONS",
    "OUTCOME_AWARENESS":  "REACH",
    "OUTCOME_TRAFFIC":    "LINK_CLICKS",
    "OUTCOME_LEADS":      "LEAD_GENERATION",
    "OUTCOME_SALES":      "OFFSITE_CONVERSIONS",
}

CTA_OPTIONS = {
    "WhatsApp":     "WHATSAPP_MESSAGE",
    "Aprender más": "LEARN_MORE",
    "Comprar":      "SHOP_NOW",
    "Contactar":    "CONTACT_US",
    "Registrarse":  "SIGN_UP",
    "Ver más":      "WATCH_MORE",
}


# ── Env loader ────────────────────────────────────────────────────────────────
def load_env():
    env_path = Path(__file__).parent / ".env"
    env = {}
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip()
    return env


ENV = load_env()


# ── OpenAI image analysis (GPT-4.1 mini) ─────────────────────────────────────
def analyze_image_with_openai(image_bytes, brand_brief=""):
    """Analiza imagen con GPT-4.1-mini Vision y devuelve sugerencias de copy."""
    api_key = ENV.get("OPENIA_API_KEY")
    if not api_key:
        return None

    b64    = base64.b64encode(image_bytes).decode()
    prompt = f"""Analiza esta imagen como experto en publicidad digital para Meta Ads (Facebook/Instagram).

{'Contexto del negocio: ' + brand_brief if brand_brief else ''}

Devuelve SOLO un JSON con esta estructura exacta:
{{
  "descripcion": "qué muestra la imagen y cómo se puede usar en un anuncio",
  "angulo": "qué ángulo funciona mejor (emocional / prueba_social / contrarian)",
  "hook_visual": "cómo arrancar el anuncio visualmente para detener el scroll",
  "texto_principal": "texto principal sugerido (los primeros 125 chars son los más vistos)",
  "titular": "titular sugerido (máx 40 chars)",
  "descripcion_ad": "descripción corta (máx 30 chars)",
  "consejo": "un consejo específico sobre cómo usar mejor este creativo"
}}"""

    try:
        r = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "gpt-4.1-mini",
                "max_tokens": 700,
                "messages": [{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}", "detail": "low"}},
                    ],
                }],
            },
            timeout=30,
        )
        resp = r.json()
        if "error" in resp:
            return {"error": resp["error"]["message"]}
        raw   = resp["choices"][0]["message"]["content"]
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        return json.loads(raw[start:end])
    except Exception as e:
        return {"error": str(e)}


# ── Meta API helpers ──────────────────────────────────────────────────────────
def api_get(token, endpoint, params=None):
    p = {"access_token": token}
    if params:
        p.update(params)
    r = requests.get(f"{BASE_URL}/{endpoint}", params=p, timeout=20)
    return r.json()


def api_post(token, endpoint, payload):
    r = requests.post(
        f"{BASE_URL}/{endpoint}",
        json=payload,
        params={"access_token": token},
        timeout=60,
    )
    return r.json()


def api_update(token, object_id, payload):
    resp = api_post(token, object_id, payload)
    if resp.get("success") or resp.get("id"):
        return {"success": True}
    err = resp.get("error", {})
    msg = err.get("message", str(resp)) if isinstance(err, dict) else str(err)
    return {"error": msg}


# ── Campaign / Ad controls ─────────────────────────────────────────────────────
def toggle_campaign_status(campaign_id, current_status):
    token      = st.session_state.token
    new_status = "PAUSED" if current_status == "ACTIVE" else "ACTIVE"
    result     = api_update(token, campaign_id, {"status": new_status})
    if result.get("success"):
        label = "pausada" if new_status == "PAUSED" else "activada"
        st.toast(f"Campaña {label} correctamente.", icon="✅")
        _dash_invalidate_cache()
        st.rerun()
    else:
        st.error(f"No se pudo cambiar el estado: {result['error']}")


def toggle_ad_status(ad_id, current_status):
    token      = st.session_state.token
    new_status = "PAUSED" if current_status == "ACTIVE" else "ACTIVE"
    result     = api_update(token, ad_id, {"status": new_status})
    if result.get("success"):
        label = "pausado" if new_status == "PAUSED" else "activado"
        st.toast(f"Anuncio {label} correctamente.", icon="✅")
        _dash_invalidate_cache()
        st.rerun()
    else:
        st.error(f"No se pudo cambiar el estado del anuncio: {result['error']}")


def edit_budget_form(campaign_id, adset_id, current_daily_budget_cents):
    token          = st.session_state.token
    current_dollars = round(int(current_daily_budget_cents or 100) / 100, 2)
    with st.form(key=f"budget_form_{campaign_id}_{adset_id}"):
        new_dollars = st.number_input(
            "Presupuesto diario (USD)", min_value=1.0, max_value=1000.0,
            value=float(current_dollars), step=1.0, format="%.2f",
        )
        submitted = st.form_submit_button("💾 Guardar presupuesto")
    if submitted:
        result = api_update(token, adset_id, {"daily_budget": int(new_dollars * 100)})
        if result.get("success"):
            st.toast(f"Presupuesto actualizado a ${new_dollars:.2f}/día.", icon="💰")
            _dash_invalidate_cache()
            st.rerun()
        else:
            st.error(f"No se pudo actualizar el presupuesto: {result['error']}")


def render_campaign_controls(campaign):
    col_badge, col_toggle, col_budget = st.columns([1, 1, 2])
    status    = campaign.get("status", "UNKNOWN")
    adset_id  = campaign.get("adset_id")
    camp_id   = campaign["id"]
    with col_badge:
        badge = {"ACTIVE": "🟢 **ACTIVA**", "PAUSED": "🟡 **PAUSADA**"}.get(status, f"⚫ {status}")
        st.markdown(badge)
    with col_toggle:
        label = "⏸ Pausar" if status == "ACTIVE" else "▶️ Activar"
        if status in ("ACTIVE", "PAUSED"):
            if st.button(label, key=f"toggle_camp_{camp_id}", use_container_width=True):
                toggle_campaign_status(camp_id, status)
    with col_budget:
        with st.expander("💰 Editar presupuesto"):
            if adset_id:
                edit_budget_form(camp_id, adset_id, campaign.get("daily_budget"))
            else:
                st.caption("No se encontró el conjunto de anuncios.")


def render_ad_controls(ad):
    col_badge, col_toggle = st.columns([1, 1])
    status = ad.get("status", "UNKNOWN")
    with col_badge:
        badge = {"ACTIVE": "🟢 **ACTIVO**", "PAUSED": "🟡 **PAUSADO**"}.get(status, f"⚫ {status}")
        st.markdown(badge)
    with col_toggle:
        label = "⏸ Pausar" if status == "ACTIVE" else "▶️ Activar"
        if status in ("ACTIVE", "PAUSED"):
            if st.button(label, key=f"toggle_ad_{ad['id']}", use_container_width=True):
                toggle_ad_status(ad["id"], status)


# ── Dashboard helpers ──────────────────────────────────────────────────────────
def _dash_fmt_currency(val):
    try:    return f"${float(val):,.2f}"
    except: return "$0.00"

def _dash_fmt_number(val):
    try:    return f"{int(float(val)):,}"
    except: return "0"

def _dash_fmt_pct(val):
    try:    return f"{float(val):.2f}%"
    except: return "0.00%"

def _dash_extract_conversations(actions):
    types = {
        "onsite_conversion.messaging_conversation_started_7d",
        "onsite_conversion.messaging_first_reply",
        "omni_initiated_conversation",
        "messaging_conversation_started_7d",
        "onsite_conversion.total_messaging_connection",
    }
    total = 0
    for a in (actions or []):
        if a.get("action_type") in types:
            try: total += int(float(a.get("value", 0)))
            except: pass
    return total

def _dash_invalidate_cache():
    for k in [k for k in st.session_state if k.startswith("dashboard_")]:
        del st.session_state[k]

def _dash_fetch_campaigns(token, account_id, date_preset):
    resp = api_get(token, account_id + "/campaigns", {
        "fields": "id,name,status,objective,daily_budget,lifetime_budget",
        "limit": 10,
    })
    if resp.get("error"):
        return {"campaigns": [], "totals": {}, "error": resp["error"]}

    campaigns = resp.get("data", [])
    result = []
    total_spend = 0.0; total_reach = 0; total_conv = 0

    for c in campaigns:
        ins_resp = api_get(token, c["id"] + "/insights", {
            "fields": "impressions,reach,clicks,ctr,spend,actions",
            "date_preset": date_preset,
        })
        insight = (ins_resp.get("data") or [None])[0]
        if insight:
            total_spend += float(insight.get("spend", 0) or 0)
            total_reach += int(float(insight.get("reach", 0) or 0))
            total_conv  += _dash_extract_conversations(insight.get("actions", []))

        # Fetch adset for budget editing
        as_resp = api_get(token, c["id"] + "/adsets", {"fields": "id,daily_budget", "limit": 1})
        adset   = (as_resp.get("data") or [{}])[0]

        result.append({**c, "insight": insight,
                       "adset_id": adset.get("id"),
                       "daily_budget": adset.get("daily_budget") or c.get("daily_budget")})

    return {"campaigns": result,
            "totals": {"spend": total_spend, "reach": total_reach, "conversations": total_conv},
            "error": None}

def _dash_fetch_ads(token, campaign_id, date_preset):
    cache_key = f"dashboard_ads_{campaign_id}_{date_preset}"
    if cache_key in st.session_state:
        return st.session_state[cache_key]
    ads_resp = api_get(token, campaign_id + "/ads", {"fields": "id,name,status,adset_id", "limit": 10})
    ads = []
    for ad in ads_resp.get("data", []):
        ins = api_get(token, ad["id"] + "/insights", {
            "fields": "impressions,reach,clicks,ctr,spend,actions",
            "date_preset": date_preset,
        })
        ad["insight"] = (ins.get("data") or [None])[0]
        ads.append(ad)
    st.session_state[cache_key] = ads
    return ads


# ── AI Campaign Analysis ──────────────────────────────────────────────────────
def ai_analyze_campaign(camp, date_preset):
    """Ask the AI for a structured marketing analysis of one campaign."""
    cache_key = f"ai_analysis_{camp['id']}_{date_preset}"
    if cache_key in st.session_state:
        return st.session_state[cache_key]

    ins = camp.get("insight") or {}
    actions = ins.get("actions", [])
    conv = _dash_extract_conversations(actions)
    video_views = next((int(a["value"]) for a in actions if a["action_type"] == "video_view"), 0)

    spend   = float(ins.get("spend", 0) or 0)
    reach   = int(float(ins.get("reach", 0) or 0))
    impr    = int(float(ins.get("impressions", 0) or 0))
    ctr     = float(ins.get("ctr", 0) or 0)
    budget  = round(int(camp.get("daily_budget") or 0) / 100, 2)

    system = (
        "Eres un experto en Meta Ads para negocios de servicios en LATAM. "
        "Responde en español. Sé directo, concreto y accionable. "
        "Estructura la respuesta con secciones: "
        "**Diagnóstico**, **Qué funciona**, **Qué no funciona**, **Acciones inmediatas** (máx 4 bullets numerados). "
        "Máximo 350 palabras."
    )
    user_msg = (
        f"Analiza esta campaña de Meta Ads:\n"
        f"- Nombre: {camp['name']}\n"
        f"- Objetivo: {camp.get('objective','')}\n"
        f"- Estado: {camp.get('status','')}\n"
        f"- Período: {date_preset}\n"
        f"- Presupuesto diario: ${budget}/día\n"
        f"- Gasto total: ${spend}\n"
        f"- Alcance: {reach:,} personas\n"
        f"- Impresiones: {impr:,}\n"
        f"- CTR: {ctr:.2f}%\n"
        f"- Conversaciones/leads: {conv}\n"
        f"- Vistas de video: {video_views:,}\n"
        f"- Costo por conversación: ${spend/conv:.2f}" if conv else f"- Conversaciones: 0\n"
        + "\nEl negocio es Golden Strings (música en vivo / violín para eventos en México). "
          "Meta: generar leads por WhatsApp/Messenger para cotizar eventos."
    )

    result = ai_chat_completion(system, [{"role": "user", "content": user_msg}], max_tokens=600)
    st.session_state[cache_key] = result
    return result


# ── Agent Panel ────────────────────────────────────────────────────────────────
def _agent_build_context(campaigns, account_id, date_preset):
    """Build a compact JSON context of all campaigns for the agent."""
    camps_summary = []
    for c in campaigns:
        ins = c.get("insight") or {}
        actions = ins.get("actions", [])
        conv = _dash_extract_conversations(actions)
        camps_summary.append({
            "id": c["id"],
            "nombre": c["name"],
            "estado": c.get("status"),
            "objetivo": c.get("objective"),
            "presupuesto_diario_usd": round(int(c.get("daily_budget") or 0) / 100, 2),
            "adset_id": c.get("adset_id"),
            "gasto_usd": float(ins.get("spend", 0) or 0),
            "alcance": int(float(ins.get("reach", 0) or 0)),
            "impresiones": int(float(ins.get("impressions", 0) or 0)),
            "ctr_pct": float(ins.get("ctr", 0) or 0),
            "conversaciones": conv,
        })
    return json.dumps({"cuenta": account_id, "periodo": date_preset, "campañas": camps_summary}, ensure_ascii=False, indent=2)


def _agent_parse_and_execute(token, response_text):
    """Extract ACTION blocks from agent response and execute them. Returns list of results."""
    import re
    results = []
    for match in re.finditer(r'\[ACTION:(\w+):([^\]]+)\]', response_text):
        action = match.group(1)
        args   = match.group(2).split(":")
        try:
            if action == "PAUSE_CAMPAIGN" and args:
                r = api_update(token, args[0], {"status": "PAUSED"})
                results.append(("Pausar campaña", r))
            elif action == "RESUME_CAMPAIGN" and args:
                r = api_update(token, args[0], {"status": "ACTIVE"})
                results.append(("Activar campaña", r))
            elif action == "SET_BUDGET" and len(args) >= 2:
                cents = int(float(args[1]) * 100)
                r = api_update(token, args[0], {"daily_budget": cents})
                results.append((f"Cambiar presupuesto a ${args[1]}/día", r))
        except Exception as e:
            results.append((action, {"error": str(e)}))
    return results


def render_agent_panel(token, campaigns, account_id, date_preset):
    """Full agent chat panel embedded in the dashboard."""
    if not has_ai():
        st.info("Agrega `ANTHROPIC_API_KEY` en tu `.env` para activar el agente.")
        return

    AGENT_SYSTEM = (
        "Eres un agente experto en Meta Ads integrado en un sistema de automatización. "
        "Tienes acceso a los datos de campañas en tiempo real y puedes ejecutar acciones.\n\n"
        "ACCIONES DISPONIBLES — úsalas en tu respuesta cuando el usuario lo pida, "
        "embebidas en el texto con este formato exacto:\n"
        "  [ACTION:PAUSE_CAMPAIGN:<campaign_id>]\n"
        "  [ACTION:RESUME_CAMPAIGN:<campaign_id>]\n"
        "  [ACTION:SET_BUDGET:<adset_id>:<daily_usd>]\n\n"
        "Reglas:\n"
        "- Siempre confirma qué acción vas a ejecutar antes de mostrar el ACTION block.\n"
        "- Responde en español, sé directo y accionable.\n"
        "- Si el usuario pide análisis, usa los datos del contexto JSON proporcionado.\n"
        "- Para cambios de presupuesto, recomienda subir máximo 30% a la vez.\n"
        "- Nunca inventes IDs; usa solo los del contexto.\n"
    )

    ctx = _agent_build_context(campaigns, account_id, date_preset)

    if "agent_history" not in st.session_state:
        st.session_state["agent_history"] = []

    # Chat history
    for msg in st.session_state["agent_history"]:
        with st.chat_message(msg["role"], avatar="🤖" if msg["role"] == "assistant" else "👤"):
            st.markdown(msg["content"])
            if msg.get("actions"):
                for label, res in msg["actions"]:
                    if res.get("success"):
                        st.success(f"✅ {label}")
                    else:
                        st.error(f"❌ {label}: {res.get('error','')}")

    user_input = st.chat_input("Escribe un comando o pregunta sobre tus campañas...")
    if user_input:
        st.session_state["agent_history"].append({"role": "user", "content": user_input})
        with st.chat_message("user", avatar="👤"):
            st.markdown(user_input)

        with st.chat_message("assistant", avatar="🤖"):
            with st.spinner("Pensando..."):
                history_for_api = [
                    {"role": m["role"], "content": m["content"]}
                    for m in st.session_state["agent_history"]
                ]
                # Inject campaign context in the first message
                history_for_api[0]["content"] = (
                    f"Contexto de campañas:\n```json\n{ctx}\n```\n\n"
                    + history_for_api[0]["content"]
                )
                response = ai_chat_completion(AGENT_SYSTEM, history_for_api, max_tokens=800)

            # Remove ACTION blocks from display text
            import re
            display = re.sub(r'\[ACTION:\w+:[^\]]+\]', '', response).strip()
            st.markdown(display)

            # Execute actions
            action_results = _agent_parse_and_execute(token, response)
            for label, res in action_results:
                if res.get("success"):
                    st.success(f"✅ {label}")
                    _dash_invalidate_cache()
                else:
                    st.error(f"❌ {label}: {res.get('error','')}")

        st.session_state["agent_history"].append({
            "role": "assistant",
            "content": response,
            "actions": action_results,
        })

        if action_results:
            st.rerun()

    if st.session_state["agent_history"] and st.button("🗑 Limpiar conversación", key="agent_clear"):
        st.session_state["agent_history"] = []
        st.rerun()


# ── Dashboard page ─────────────────────────────────────────────────────────────
def _dash_fetch_accounts(token):
    """Trae las cuentas publicitarias y páginas disponibles para el token."""
    accounts_resp = api_get(token, "me/adaccounts", {
        "fields": "id,name,account_status,currency",
        "limit": 25,
    })
    pages_resp = api_get(token, "me/accounts", {
        "fields": "id,name,fan_count,category",
        "limit": 25,
    })
    return (
        accounts_resp.get("data", []),
        pages_resp.get("data", []),
    )


def page_dashboard():
    token = st.session_state.get("token", "")
    if not token:
        st.warning("⚠️ Primero conecta tu cuenta Meta en el Paso 1 del wizard.")
        return

    col_title, col_btn = st.columns([6, 1])
    with col_title:
        st.title("📊 Mis Campañas")
    with col_btn:
        st.write("")
        if st.button("🔄 Actualizar", use_container_width=True, key="dash_refresh"):
            _dash_invalidate_cache()
            st.session_state.pop("dash_accounts", None)
            st.rerun()

    # ── Selector de cuenta publicitaria y página ───────────────────────────────
    if "dash_accounts" not in st.session_state:
        with st.spinner("Cargando cuentas y páginas..."):
            accounts, pages = _dash_fetch_accounts(token)
            st.session_state["dash_accounts"] = accounts
            st.session_state["dash_pages"]    = pages

    accounts = st.session_state.get("dash_accounts", [])
    pages    = st.session_state.get("dash_pages", [])

    STATUS_LABELS = {1: "✅ Activa", 2: "⚠️ Deshabilitada", 3: "⛔ Sin acceso",
                     7: "🔒 Cerrada", 9: "⚠️ Revisión pendiente"}

    sel_col, page_col = st.columns(2)

    with sel_col:
        if not accounts:
            st.error("No se encontraron cuentas publicitarias para este token.")
            return
        account_labels = {
            a["id"]: f"{a['name']}  ·  {STATUS_LABELS.get(a.get('account_status'), '—')}  ·  {a.get('currency','')}"
            for a in accounts
        }
        default_id = st.session_state.get("dash_selected_account") or st.session_state.get("account_id") or accounts[0]["id"]
        default_idx = next((i for i, a in enumerate(accounts) if a["id"] == default_id), 0)
        selected_account = st.selectbox(
            "🏢 Cuenta publicitaria",
            options=[a["id"] for a in accounts],
            format_func=lambda x: account_labels.get(x, x),
            index=default_idx,
            key="dash_account_select",
        )
        if selected_account != st.session_state.get("dash_selected_account"):
            st.session_state["dash_selected_account"] = selected_account
            _dash_invalidate_cache()
            st.rerun()

    with page_col:
        if pages:
            page_labels = {
                p["id"]: f"{p['name']}  ·  {p.get('fan_count', 0):,} seguidores  ·  {p.get('category','')}"
                for p in pages
            }
            default_pid = st.session_state.get("dash_selected_page") or st.session_state.get("page_id") or pages[0]["id"]
            default_pidx = next((i for i, p in enumerate(pages) if p["id"] == default_pid), 0)
            selected_page = st.selectbox(
                "📄 Página de Facebook",
                options=[p["id"] for p in pages],
                format_func=lambda x: page_labels.get(x, x),
                index=default_pidx,
                key="dash_page_select",
            )
            st.session_state["dash_selected_page"] = selected_page
        else:
            st.caption("No se encontraron páginas para este token.")

    account_id = st.session_state.get("dash_selected_account") or st.session_state.get("account_id", "")
    if not account_id:
        st.warning("Selecciona una cuenta publicitaria.")
        return

    st.divider()

    # ── Selector de período ────────────────────────────────────────────────────
    preset_map  = {"Últimos 7 días": "last_7d", "Últimos 30 días": "last_30d", "Últimos 90 días": "last_90d"}
    selected    = st.radio("Período", list(preset_map.keys()), index=1, horizontal=True, key="dash_range")
    date_preset = preset_map[selected]

    if st.session_state.get("dashboard_preset") != date_preset:
        _dash_invalidate_cache()
        st.session_state["dashboard_preset"] = date_preset

    # ── Cargar campañas ────────────────────────────────────────────────────────
    if "dashboard_data" not in st.session_state:
        with st.spinner("Cargando métricas..."):
            st.session_state["dashboard_data"] = _dash_fetch_campaigns(token, account_id, date_preset)

    data = st.session_state["dashboard_data"]
    if data.get("error"):
        err = data["error"]
        st.error(f"Error Meta API: {err.get('message', str(err)) if isinstance(err, dict) else err}")
        if st.button("Reintentar"):
            _dash_invalidate_cache()
            st.rerun()
        return

    campaigns = data["campaigns"]
    totals    = data["totals"]

    if not campaigns:
        st.info("No se encontraron campañas en esta cuenta para el período seleccionado.")
        return

    # ── Resumen general (siempre de todas las campañas) ───────────────────────
    st.markdown("### Resumen del período")
    s1, s2, s3 = st.columns(3)
    with s1: st.metric("💰 Gasto Total",    _dash_fmt_currency(totals["spend"]))
    with s2: st.metric("👥 Alcance Total",   _dash_fmt_number(totals["reach"]))
    with s3: st.metric("💬 Conversaciones",  _dash_fmt_number(totals["conversations"]))

    st.divider()

    # ── Selector de campaña ────────────────────────────────────────────────────
    TODAS = "— Todas las campañas —"
    camp_options = [TODAS] + [c["name"] for c in campaigns]
    prev_sel = st.session_state.get("dash_selected_campaign", TODAS)
    if prev_sel not in camp_options:
        prev_sel = TODAS
    selected_camp_name = st.selectbox(
        "🎯 Campaña",
        options=camp_options,
        index=camp_options.index(prev_sel),
        key="dash_campaign_select",
    )
    st.session_state["dash_selected_campaign"] = selected_camp_name

    if selected_camp_name == TODAS:
        filtered = campaigns
    else:
        filtered = [c for c in campaigns if c["name"] == selected_camp_name]

    st.markdown(f"### {'Todas las campañas' if selected_camp_name == TODAS else selected_camp_name}  ({len(filtered)})")

    for camp in filtered:
        insight = camp["insight"]
        st.markdown(f"#### {camp['name']}")
        budget_str = ""
        if camp.get("daily_budget"):
            budget_str = f"Presupuesto diario: **{_dash_fmt_currency(int(camp['daily_budget']) / 100)}**"
        if budget_str:
            st.caption(f"{camp.get('objective', '')}  ·  {budget_str}")

        render_campaign_controls(camp)

        if insight:
            m1, m2, m3, m4, m5 = st.columns(5)
            with m1: st.metric("💰 Gasto",         _dash_fmt_currency(insight.get("spend", "0")))
            with m2: st.metric("👥 Alcance",        _dash_fmt_number(insight.get("reach", "0")))
            with m3: st.metric("📢 Impresiones",    _dash_fmt_number(insight.get("impressions", "0")))
            with m4: st.metric("🖱️ CTR",            _dash_fmt_pct(insight.get("ctr", "0")))
            with m5: st.metric("💬 Conversaciones", _dash_fmt_number(_dash_extract_conversations(insight.get("actions", []))))
        else:
            st.info("Sin datos en este período")

        # ── AI Analysis button ────────────────────────────────────────────────
        if has_ai():
            analysis_key  = f"ai_analysis_{camp['id']}_{date_preset}"
            pending_key   = f"ai_pending_{camp['id']}"
            already_shown = analysis_key in st.session_state

            col_ai, col_clear = st.columns([3, 1])
            with col_ai:
                if st.button("🧠 Analizar con IA", key=f"analyze_{camp['id']}", use_container_width=True):
                    st.session_state.pop(analysis_key, None)
                    st.session_state[pending_key] = True
                    st.rerun()
            with col_clear:
                if already_shown:
                    if st.button("✕ Cerrar", key=f"close_analysis_{camp['id']}", use_container_width=True):
                        st.session_state.pop(analysis_key, None)
                        st.rerun()

            if st.session_state.pop(pending_key, False):
                with st.spinner("Analizando con IA..."):
                    ai_analyze_campaign(camp, date_preset)

            if analysis_key in st.session_state:
                with st.container(border=True):
                    st.markdown("##### 🧠 Análisis IA")
                    st.markdown(st.session_state[analysis_key])

        with st.expander("Ver anuncios", expanded=(selected_camp_name != TODAS)):
            with st.spinner("Cargando anuncios..."):
                ads = _dash_fetch_ads(token, camp["id"], date_preset)
            if not ads:
                st.caption("No hay anuncios en esta campaña.")
            else:
                for ad in ads:
                    st.markdown(f"**{ad['name']}**")
                    render_ad_controls(ad)
                    ad_ins = ad.get("insight")
                    if ad_ins:
                        a1, a2, a3, a4, a5 = st.columns(5)
                        with a1: st.caption(f"💰 {_dash_fmt_currency(ad_ins.get('spend','0'))}")
                        with a2: st.caption(f"👥 {_dash_fmt_number(ad_ins.get('reach','0'))}")
                        with a3: st.caption(f"📢 {_dash_fmt_number(ad_ins.get('impressions','0'))}")
                        with a4: st.caption(f"🖱️ {_dash_fmt_pct(ad_ins.get('ctr','0'))}")
                        with a5: st.caption(f"💬 {_dash_fmt_number(_dash_extract_conversations(ad_ins.get('actions',[])))}")
                    else:
                        st.caption("Sin datos en este período")
                    st.divider()
        st.markdown("---")

    # ── Agent Panel ───────────────────────────────────────────────────────────
    st.divider()
    st.markdown("## 🤖 Agente de Marketing")
    st.caption("Pregunta sobre tus campañas o dale órdenes directas: pausar, cambiar presupuesto, analizar.")
    render_agent_panel(token, campaigns, account_id, date_preset)


def upload_image(token, account_id, image_bytes):
    if not account_id.startswith("act_"):
        account_id = f"act_{account_id}"
    b64 = base64.b64encode(image_bytes).decode()
    r = requests.post(
        f"{BASE_URL}/{account_id}/adimages",
        data={"bytes": b64, "access_token": token},
        timeout=30,
    )
    resp = r.json()
    if "images" in resp:
        return list(resp["images"].values())[0].get("hash")
    err = resp.get("error", {})
    raise RuntimeError(err.get("message") or f"HTTP {r.status_code}: {r.text[:300]}")


def upload_video(token, account_id, video_bytes, filename):
    if not account_id.startswith("act_"):
        account_id = f"act_{account_id}"
    r = requests.post(
        f"{BASE_URL}/{account_id}/advideos",
        files={"source": (filename, video_bytes, "video/mp4")},
        data={"name": filename, "access_token": token},
        timeout=180,
    )
    resp = r.json()
    if resp.get("id"):
        return resp["id"]
    err = resp.get("error", {})
    raise RuntimeError(err.get("message") or f"HTTP {r.status_code}: {r.text[:300]}")


def text_only_spec(page_id, ad, link_url):
    cta_val = {"app_destination": "WHATSAPP"} if ad["cta"] == "WHATSAPP_MESSAGE" else {}
    return {
        "page_id": page_id,
        "link_data": {
            "message":     ad["body"],
            "name":        ad["headline"],
            "description": ad["description"],
            "link":        link_url,
            "call_to_action": {
                "type": ad["cta"],
                **({"value": cta_val} if cta_val else {}),
            },
        },
    }


# ── AI client — Anthropic preferred, OpenAI fallback ─────────────────────────
AI_BACKEND = None   # "anthropic" | "openai" | None — resolved at first call

def get_ai_client():
    """Returns (client, backend) or (None, None). Prefers Anthropic, falls back to OpenAI."""
    global AI_BACKEND

    # Anthropic
    if ENV.get("ANTHROPIC_API_KEY"):
        try:
            import anthropic
            AI_BACKEND = "anthropic"
            return anthropic.Anthropic(api_key=ENV["ANTHROPIC_API_KEY"]), "anthropic"
        except ImportError:
            pass

    # OpenAI fallback
    if ENV.get("OPENIA_API_KEY"):
        AI_BACKEND = "openai"
        return ENV["OPENIA_API_KEY"], "openai"   # return key directly; calls go via requests

    AI_BACKEND = None
    return None, None


def has_ai():
    """True if any AI backend is configured."""
    return bool(ENV.get("ANTHROPIC_API_KEY") or ENV.get("OPENIA_API_KEY"))


def ai_chat_completion(system_prompt, messages, max_tokens=700):
    """Unified chat completion — works with Anthropic or OpenAI."""
    client, backend = get_ai_client()
    if not client:
        return "⚠️ Configura ANTHROPIC_API_KEY o OPENIA_API_KEY en tu .env para usar el asistente."

    try:
        if backend == "anthropic":
            resp = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=max_tokens,
                system=system_prompt,
                messages=messages,
            )
            return resp.content[0].text

        elif backend == "openai":
            oai_messages = [{"role": "system", "content": system_prompt}] + messages
            r = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {client}", "Content-Type": "application/json"},
                json={"model": "gpt-4.1-mini", "max_tokens": max_tokens, "messages": oai_messages},
                timeout=30,
            )
            return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error: {e}"

    return "Sin backend configurado."


def build_wizard_context():
    """Build a concise JSON context of everything the wizard knows so far."""
    ctx = {
        "paso_actual": STEPS[st.session_state.step - 1][1] if st.session_state.step <= len(STEPS) else "Completado",
        "marca": st.session_state.get("brand_brief", ""),
        "cuenta": st.session_state.get("account_name", ""),
        "pagina": st.session_state.get("page_name", ""),
        "objetivo": st.session_state.get("objective", ""),
        "ciudad": st.session_state.get("city_name", ""),
        "radio_km": st.session_state.get("city_radius", 25),
        "edad": f"{st.session_state.get('age_min', 18)}-{st.session_state.get('age_max', 55)}",
        "presupuesto_diario_usd": round(st.session_state.get("daily_budget", 300) / 100, 2),
        "intereses": [i["name"] for i in st.session_state.get("interests", [])],
        "copy_a": {
            "body":     st.session_state.ads_copy[0]["body"] if "ads_copy" in st.session_state else "",
            "headline": st.session_state.ads_copy[0]["headline"] if "ads_copy" in st.session_state else "",
        },
    }
    return json.dumps(ctx, ensure_ascii=False, indent=2)


SIDEBAR_SYSTEM = """Eres Claude, asistente de marketing digital dentro de un wizard de Meta Ads.

Tu rol:
- Guiar al usuario paso a paso en la creación de su campaña en Facebook/Instagram Ads
- En cada paso, dar sugerencias concretas y accionables basadas en lo que el usuario ya llenó
- Cuando el usuario pida que generes copy, SIEMPRE responde con un JSON así:
  <copy_suggestion>
  {
    "A": {"body": "...", "headline": "...", "description": "..."},
    "B": {"body": "...", "headline": "...", "description": "..."},
    "C": {"body": "...", "headline": "...", "description": "..."}
  }
  </copy_suggestion>
  Seguido de una explicación breve de cada ángulo.

- Cuando el usuario pida que sugieras una ciudad, escríbela claramente.
- Cuando el usuario pida el objetivo, recomiéndalo directamente.
- Sé directo, usa bullet points, no te extiendas más de 200 palabras.
- Idioma: español latinoamericano.

Limits de Meta Ads:
- Texto principal: los primeros 125 chars son los más vistos
- Titular (headline): máx 40 chars
- Descripción: máx 30 chars"""


def ai_respond(user_message, chat_key):
    """Send message to AI with full wizard context."""
    history = st.session_state.get(chat_key, [])

    context_block = f"\n\nCONTEXTO ACTUAL DEL WIZARD:\n{build_wizard_context()}"
    if st.session_state.get("campaign_analysis"):
        context_block += f"\n\nANÁLISIS DE CAMPAÑAS ANTERIORES:\n{st.session_state.campaign_analysis}"

    messages = [{"role": m["role"], "content": m["content"]} for m in history]
    messages.append({"role": "user", "content": user_message + context_block})

    return ai_chat_completion(SIDEBAR_SYSTEM, messages, max_tokens=1200)


def parse_copy_suggestion(ai_text):
    """Extract <copy_suggestion>JSON</copy_suggestion> from AI response."""
    import re
    match = re.search(r"<copy_suggestion>(.*?)</copy_suggestion>", ai_text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except Exception:
            return None
    return None


def apply_copy_suggestion(suggestion):
    """Apply AI copy suggestion dict {A: {body, headline, description}, ...} to session state."""
    mapping = {"A": 0, "B": 1, "C": 2}
    for key, idx in mapping.items():
        if key in suggestion:
            fields = suggestion[key]
            st.session_state.ads_copy[idx]["body"]        = fields.get("body", st.session_state.ads_copy[idx]["body"])
            st.session_state.ads_copy[idx]["headline"]    = fields.get("headline", st.session_state.ads_copy[idx]["headline"])[:40]
            st.session_state.ads_copy[idx]["description"] = fields.get("description", st.session_state.ads_copy[idx]["description"])[:30]


# ── Campaign analysis ─────────────────────────────────────────────────────────
def analyze_account_campaigns():
    """Pull real campaign data and ask AI for strategic analysis."""
    if not has_ai():
        return None

    token      = st.session_state.token
    account_id = st.session_state.account_id

    # Get recent campaigns
    camp_resp = api_get(token, f"{account_id}/campaigns", {
        "fields": "id,name,status,objective,created_time",
        "limit": 8,
    })
    campaigns = camp_resp.get("data", [])
    if not campaigns:
        return "No se encontraron campañas anteriores en esta cuenta."

    # Get insights for top 4
    campaign_data = []
    for c in campaigns[:4]:
        ins = api_get(token, f"{c['id']}/insights", {
            "fields": "impressions,reach,clicks,ctr,spend,actions,cost_per_result",
            "date_preset": "last_30d",
        })
        data_row = {
            "nombre": c["name"],
            "objetivo": c.get("objective", ""),
            "estado": c.get("status", ""),
        }
        if ins.get("data"):
            d = ins["data"][0]
            data_row.update({
                "impresiones":   d.get("impressions", "0"),
                "alcance":       d.get("reach", "0"),
                "clics":         d.get("clicks", "0"),
                "ctr":           d.get("ctr", "0"),
                "gasto_usd":     d.get("spend", "0"),
                "acciones":      d.get("actions", []),
            })
        campaign_data.append(data_row)

    prompt = f"""Analiza estas campañas de Meta Ads y entrega un informe estratégico.

DATOS DE CUENTA:
{json.dumps(campaign_data, ensure_ascii=False, indent=2)}

MARCA (si disponible): {st.session_state.get("brand_brief", "No especificada")}

Entrega:
1. **Diagnóstico** — qué está funcionando, qué no (2-3 bullets)
2. **Oportunidad principal** — dónde está el mayor potencial de mejora (1 párrafo)
3. **Estrategia recomendada** — objetivo, audiencia, presupuesto (bullets)
4. **Próxima campaña** — qué probarías ahora mismo y por qué

Sé directo y accionable. Máximo 350 palabras. Español."""

    return ai_chat_completion("Eres un experto en marketing digital y Meta Ads.", [{"role": "user", "content": prompt}], max_tokens=700)


# ── State init ────────────────────────────────────────────────────────────────
# ══════════════════════════════════════════════════════════════════════════════
# AUTH — login, registro, sesión persistente via URL query param
# ══════════════════════════════════════════════════════════════════════════════

def get_session_token() -> str:
    return st.query_params.get("s", "")

def set_session_token(token: str):
    st.query_params["s"] = token

def clear_session_token():
    st.query_params.pop("s", None)

def get_current_user() -> dict | None:
    return st.session_state.get("_user")

def restore_user_state(user: dict):
    """Load saved Meta connection, business profile, and last draft from DB."""
    uid = user["user_id"]

    # Meta connection
    meta = load_meta_connection(uid)
    if meta and meta.get("access_token"):
        for k, v in [("token", meta["access_token"]),
                     ("account_id", meta["account_id"] or ""),
                     ("account_name", meta["account_name"] or ""),
                     ("page_id", meta["page_id"] or ""),
                     ("page_name", meta["page_name"] or "")]:
            st.session_state[k] = v

    # Business profile
    bp = load_business_profile(uid)
    if bp:
        st.session_state["brand_brief"]   = bp.get("brand_brief", "")
        st.session_state["brand_profile"] = bp.get("profile", {})
        st.session_state["profile_ready"] = bool(bp.get("brand_brief"))
        if bp.get("chat_history"):
            st.session_state["chat_intake"] = bp["chat_history"]

    # Last draft (unless user already has an active draft loaded)
    if not st.session_state.get("_draft_id"):
        drafts = list_wizard_drafts(uid)
        if drafts:
            latest = drafts[0]
            _apply_draft(latest["id"], uid)


def _apply_draft(draft_id: int, user_id: int):
    draft = load_wizard_draft(draft_id, user_id)
    if not draft:
        return
    state = draft["state"]
    for key, val in state.items():
        if key == "media_meta":
            # Restore media metadata (no bytes — user re-uploads if needed)
            metas = val or [{}, {}, {}]
            current_media = st.session_state.get("media", [{}, {}, {}])
            for i, meta in enumerate(metas[:3]):
                if i < len(current_media):
                    current_media[i].update({
                        "name":          meta.get("name", ""),
                        "type":          meta.get("type"),
                        "meta_hash":     meta.get("meta_hash"),
                        "meta_video_id": meta.get("meta_video_id"),
                        "bytes":         None,
                    })
            st.session_state["media"] = current_media
        else:
            st.session_state[key] = val
    st.session_state["_draft_id"] = draft_id


def do_auto_save():
    """Auto-save current wizard state to DB if user is logged in."""
    user = get_current_user()
    if not user:
        return
    uid      = user["user_id"]
    draft_id = st.session_state.get("_draft_id")
    new_id   = save_wizard_draft(uid, st.session_state, draft_id=draft_id)
    st.session_state["_draft_id"] = new_id


def page_login():
    """Login / registro — se muestra cuando no hay sesión activa."""
    _, col, _ = st.columns([1, 2, 1])
    with col:
        st.markdown("# 🎯 Meta Ads Wizard")
        st.caption("Gestiona campañas de Facebook e Instagram con asistencia de IA")
        st.markdown("---")

        tab_login, tab_register = st.tabs(["Iniciar sesión", "Crear cuenta"])

        with tab_login:
            with st.form("form_login"):
                email    = st.text_input("Email")
                password = st.text_input("Contraseña", type="password")
                remember = st.checkbox("Recordarme 30 días", value=True)
                submit   = st.form_submit_button("Entrar", use_container_width=True, type="primary")
            if submit:
                if not email or not password:
                    st.error("Ingresa email y contraseña.")
                else:
                    result = login_user(email, password)
                    if result["ok"]:
                        days  = 30 if remember else 1
                        token = create_session(result["user"]["id"], days=days)
                        set_session_token(token)
                        st.session_state["_user"] = {**result["user"], "user_id": result["user"]["id"]}
                        restore_user_state(st.session_state["_user"])
                        st.rerun()
                    else:
                        st.error(result["error"])

        with tab_register:
            with st.form("form_register"):
                r_name     = st.text_input("Nombre")
                r_email    = st.text_input("Email")
                r_password = st.text_input("Contraseña", type="password")
                r_submit   = st.form_submit_button("Crear cuenta", use_container_width=True, type="primary")
            if r_submit:
                if not r_name or not r_email or not r_password:
                    st.error("Completa todos los campos.")
                elif len(r_password) < 6:
                    st.error("La contraseña debe tener al menos 6 caracteres.")
                else:
                    result = register_user(r_email, r_name, r_password)
                    if result["ok"]:
                        token = create_session(result["user"]["id"], days=30)
                        set_session_token(token)
                        st.session_state["_user"] = {**result["user"], "user_id": result["user"]["id"]}
                        st.success("¡Cuenta creada! Bienvenido.")
                        st.rerun()
                    else:
                        st.error(result["error"])


def check_auth() -> bool:
    """Returns True if user is authenticated. Sets st.session_state._user."""
    if st.session_state.get("_user"):
        return True
    token = get_session_token()
    if not token:
        return False
    user = validate_session(token)
    if not user:
        clear_session_token()
        return False
    st.session_state["_user"] = user
    restore_user_state(user)
    return True


def page_drafts():
    """Pantalla de borradores guardados."""
    user = get_current_user()
    if not user:
        return
    uid = user["user_id"]

    st.title("📁 Mis Borradores")
    st.caption("Campañas guardadas — retoma donde dejaste")

    if st.button("➕ Nuevo wizard (campaña desde cero)", type="primary"):
        # Clear wizard state but keep user auth
        keys_to_keep = {"_user", "_draft_id", "app_mode",
                        "dash_accounts", "dash_pages", "dash_selected_account",
                        "dash_selected_page", "dashboard_preset"}
        for k in list(st.session_state.keys()):
            if k not in keys_to_keep:
                del st.session_state[k]
        st.session_state["_draft_id"] = None
        st.session_state["app_mode"]  = "wizard"
        st.rerun()

    st.markdown("---")
    drafts = list_wizard_drafts(uid)

    if not drafts:
        st.info("No tienes borradores guardados. Empieza una campaña nueva con el botón de arriba.")
        return

    STEP_NAMES = {1:"Conectar",2:"Estrategia",3:"Campaña",4:"Audiencia",
                  5:"Presupuesto",6:"Copy",7:"Creativos",8:"Revisión",9:"Crear"}
    STATUS_BADGE = {"draft": "📝 Borrador", "created": "✅ Creada"}

    for d in drafts:
        with st.container(border=True):
            col_info, col_rename, col_actions = st.columns([3, 2, 1])
            with col_info:
                badge = STATUS_BADGE.get(d["status"], d["status"])
                step_label = STEP_NAMES.get(d["step"], f"Paso {d['step']}")
                st.markdown(f"**{d['name']}**  ·  {badge}")
                st.caption(f"Último paso: **{step_label}**  ·  Actualizado: {d['updated_at'][:16]}")
            with col_rename:
                new_name = st.text_input("Renombrar", value=d["name"],
                                          key=f"rename_{d['id']}", label_visibility="collapsed")
                if new_name != d["name"]:
                    rename_wizard_draft(d["id"], uid, new_name)
            with col_actions:
                if st.button("▶️ Retomar", key=f"resume_{d['id']}", use_container_width=True, type="primary"):
                    keys_to_keep = {"_user", "app_mode",
                                    "dash_accounts", "dash_pages", "dash_selected_account",
                                    "dash_selected_page", "dashboard_preset"}
                    for k in list(st.session_state.keys()):
                        if k not in keys_to_keep:
                            del st.session_state[k]
                    st.session_state["_draft_id"] = None
                    # Re-init defaults then apply draft
                    init_state()
                    _apply_draft(d["id"], uid)
                    # Restore Meta connection
                    meta = load_meta_connection(uid)
                    if meta and meta.get("access_token"):
                        st.session_state["token"]        = meta["access_token"]
                        st.session_state["account_id"]   = meta["account_id"] or ""
                        st.session_state["account_name"] = meta["account_name"] or ""
                        st.session_state["page_id"]      = meta["page_id"] or ""
                        st.session_state["page_name"]    = meta["page_name"] or ""
                    st.session_state["app_mode"] = "wizard"
                    st.rerun()
                if st.button("🗑️ Eliminar", key=f"del_{d['id']}", use_container_width=True):
                    delete_wizard_draft(d["id"], uid)
                    if st.session_state.get("_draft_id") == d["id"]:
                        st.session_state["_draft_id"] = None
                    st.rerun()


def init_state():
    defaults = {
        "step":         1,
        "token":        ENV.get("META_ACCESS_TOKEN", ""),
        "account_id":   ENV.get("META_AD_ACCOUNT_ID", ""),
        "account_name": "",
        "page_id":      "",
        "page_name":    "",
        "accounts":     [],
        "pages":        [],
        # Step 2 — strategy / intake
        "brand_brief":        "",
        "brand_profile":      {},
        "profile_ready":      False,
        "campaign_analysis":  "",
        "analysis_done":      False,
        # Step 3 — campaign
        "campaign_name": f"Campaña {datetime.now().strftime('%Y-%m-%d')}",
        "objective":     "OUTCOME_ENGAGEMENT",
        # Step 4 — audience
        "city_key":    "",
        "city_name":   "",
        "city_radius": 25,
        "age_min":     28,
        "age_max":     50,
        "interests":   [],
        "city_results":     [],
        "interest_results": [],
        # Step 5 — budget
        "daily_budget": 300,
        "bid_amount":   200,
        # Step 6 — copy
        "ads_copy": [
            {"label": "A — Emocional",    "angle": "Apela al momento memorable. Hook ya probado.", "body": "", "headline": "", "description": "", "cta": "WHATSAPP_MESSAGE"},
            {"label": "B — Prueba Social","angle": "Credibilidad por experiencia y volumen.",       "body": "", "headline": "", "description": "", "cta": "WHATSAPP_MESSAGE"},
            {"label": "C — Contrarian",   "angle": "Rompe expectativa. Genera curiosidad.",         "body": "", "headline": "", "description": "", "cta": "WHATSAPP_MESSAGE"},
        ],
        "pending_copy_suggestion": None,
        # Step 7 — creatives
        "media": [
            {"type": None, "bytes": None, "name": ""},
            {"type": None, "bytes": None, "name": ""},
            {"type": None, "bytes": None, "name": ""},
        ],
        # Results
        "done":             False,
        "result_campaign":  "",
        "result_adset":     "",
        "result_creatives": [],
        "result_ads":       [],
        "result_errors":    [],
        "result_manifest":  {},
        # Chat histories per step (key = "chat_step_{n}")
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v


init_state()


# ── Sidebar: Claude assistant ─────────────────────────────────────────────────
def render_sidebar():
    with st.sidebar:
        st.markdown("## 🤖 Asistente IA")
        st.caption("Meta Ads · gpt-4.1-mini" if not ENV.get("ANTHROPIC_API_KEY") else "Meta Ads · Claude Sonnet")

        if not has_ai():
            st.warning("Agrega `OPENIA_API_KEY` o `ANTHROPIC_API_KEY` en tu `.env` para activar el asistente.")
            return

        step_name = STEPS[st.session_state.step - 1][1] if st.session_state.step <= len(STEPS) else "Completado"
        st.caption(f"📍 Paso actual: **{step_name}**")

        if st.session_state.brand_brief:
            with st.expander("📋 Marca", expanded=False):
                st.caption(st.session_state.brand_brief[:200])

        st.divider()

        chat_key = f"chat_step_{st.session_state.step}"
        if chat_key not in st.session_state:
            st.session_state[chat_key] = []

        # Hint by step
        hints = {
            1: "Después de conectar, pídeme que analice tu cuenta.",
            2: "Cuéntame de tu negocio y te propongo una estrategia.",
            3: "Pídeme que te sugiera el objetivo de campaña.",
            4: "Pregúntame qué ciudad y audiencia usar.",
            5: "Dime el presupuesto y te digo si es suficiente.",
            6: "Pídeme que escriba el copy — solo describe qué quieres anunciar.",
            7: "Pídeme consejos sobre el creativo (video vs foto, formato, hook visual).",
            8: "Reviso todo el briefing y te digo si cambiaría algo.",
            9: "Campaña creada. Pídeme qué hacer para que funcione.",
        }
        if st.session_state.step in hints:
            st.caption(f"💡 *{hints[st.session_state.step]}*")

        # Chat messages
        for msg in st.session_state[chat_key]:
            with st.chat_message(msg["role"], avatar="🤖" if msg["role"] == "assistant" else "👤"):
                # Render copy suggestions nicely
                text = msg["content"]
                if "<copy_suggestion>" in text:
                    import re
                    before = text[:text.find("<copy_suggestion>")]
                    after  = text[text.find("</copy_suggestion>") + len("</copy_suggestion>"):]
                    st.markdown(before)
                    suggestion = parse_copy_suggestion(text)
                    if suggestion:
                        with st.expander("📝 Ver copy sugerido", expanded=True):
                            for var, fields in suggestion.items():
                                st.markdown(f"**Variación {var}**")
                                st.text(f"Titular: {fields.get('headline','')}")
                                st.text(f"Descripción: {fields.get('description','')}")
                                st.caption(fields.get("body",""))
                        if st.button("✅ Aplicar estas variaciones", key=f"apply_{len(st.session_state[chat_key])}"):
                            apply_copy_suggestion(suggestion)
                            st.session_state.pending_copy_suggestion = None
                            st.success("Variaciones aplicadas — revisa la pestaña Copy.")
                            st.rerun()
                    st.markdown(after)
                else:
                    st.markdown(text)

        # Input
        user_input = st.chat_input("Pregunta o pide ayuda...", key=f"sidebar_input_{st.session_state.step}")
        if user_input:
            st.session_state[chat_key].append({"role": "user", "content": user_input})
            with st.spinner("Claude está pensando..."):
                reply = ai_respond(user_input, chat_key)
            st.session_state[chat_key].append({"role": "assistant", "content": reply})

            # Auto-apply copy if suggestion detected and we're on copy step
            if st.session_state.step == 6:
                suggestion = parse_copy_suggestion(reply)
                if suggestion:
                    st.session_state.pending_copy_suggestion = suggestion

            st.rerun()

        if st.session_state[chat_key]:
            if st.button("🗑 Limpiar chat", use_container_width=True):
                st.session_state[chat_key] = []
                st.rerun()


# ── Progress bar ──────────────────────────────────────────────────────────────
def render_progress():
    current = st.session_state.step
    total   = len(STEPS)
    st.progress((current - 1) / (total - 1))

    cols = st.columns(total)
    for i, (num, label) in enumerate(STEPS):
        with cols[i]:
            if num < current:
                color = "#0866ff"
                icon  = "✓"
                weight = "normal"
            elif num == current:
                color  = "#0866ff"
                icon   = str(num)
                weight = "700"
            else:
                color  = "#bbb"
                icon   = str(num)
                weight = "normal"
            st.markdown(
                f"<p style='text-align:center;font-size:10px;font-weight:{weight};color:{color};margin:0'>{icon}<br>{label}</p>",
                unsafe_allow_html=True,
            )
    st.markdown("---")


# ── Navigation ────────────────────────────────────────────────────────────────
def nav(back=True, next_label="Siguiente →", next_disabled=False):
    cols = st.columns([1, 4, 1])
    with cols[0]:
        if back and st.session_state.step > 1:
            if st.button("← Volver", use_container_width=True):
                do_auto_save()
                st.session_state.step -= 1
                st.rerun()
    with cols[2]:
        if st.button(next_label, type="primary", disabled=next_disabled, use_container_width=True):
            do_auto_save()
            st.session_state.step += 1
            st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# STEP 1 — Conectar
# ══════════════════════════════════════════════════════════════════════════════
def step_connect():
    st.title("🔌 Conectar tu cuenta de Meta")
    st.caption("Paso 1 de 9")

    with st.expander("¿Cómo obtengo el token?"):
        st.markdown("""
        1. Ve a **[developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)**
        2. Selecciona tu app → **Generate Access Token**
        3. Permisos: `ads_management`, `ads_read`, `pages_manage_ads`
        4. Copia y pega el token abajo
        """)

    token = st.text_input("Access Token", value=st.session_state.token, type="password", placeholder="EAAN...")
    if token != st.session_state.token:
        st.session_state.token      = token
        st.session_state.accounts   = []
        st.session_state.pages      = []
        st.session_state.analysis_done = False

    if st.button("🔗 Verificar conexión", type="primary", disabled=not token):
        with st.spinner("Verificando..."):
            r = api_get(token, "me", {"fields": "id,name"})
            if "error" in r:
                st.error(f"Token inválido: {r['error']['message']}")
            else:
                st.success(f"Conectado como **{r['name']}**")
                accs = api_get(token, "me/adaccounts", {"fields": "id,name,account_status", "limit": 20})
                st.session_state.accounts = accs.get("data", [])
                pgs = api_get(token, "me/accounts", {"fields": "id,name", "limit": 20})
                st.session_state.pages = pgs.get("data", [])
                st.rerun()

    if st.session_state.accounts:
        st.markdown("### Cuenta publicitaria")
        acc_map = {f"{a['name']}  ({a['id']})": a["id"] for a in st.session_state.accounts}
        default = 0
        if st.session_state.account_id in list(acc_map.values()):
            default = list(acc_map.values()).index(st.session_state.account_id)
        sel = st.selectbox("Selecciona la cuenta", list(acc_map.keys()), index=default)
        st.session_state.account_id   = acc_map[sel]
        st.session_state.account_name = next(a["name"] for a in st.session_state.accounts if a["id"] == acc_map[sel])

    if st.session_state.pages:
        st.markdown("### Página de Facebook")
        pg_map = {f"{p['name']}  ({p['id']})": p for p in st.session_state.pages}
        default_p = 0
        if st.session_state.page_id in [p["id"] for p in st.session_state.pages]:
            default_p = [p["id"] for p in st.session_state.pages].index(st.session_state.page_id)
        sel_pg = st.selectbox("Selecciona la página", list(pg_map.keys()), index=default_p)
        pg = pg_map[sel_pg]
        st.session_state.page_id   = pg["id"]
        st.session_state.page_name = pg["name"]

    st.markdown("---")
    can_go = bool(st.session_state.token and st.session_state.account_id and st.session_state.page_id)

    # Auto-save Meta connection to DB when all fields are ready
    if can_go:
        user = get_current_user()
        if user:
            save_meta_connection(
                user["user_id"],
                st.session_state.account_id,
                st.session_state.account_name,
                st.session_state.page_id,
                st.session_state.page_name,
                st.session_state.token,
            )

    nav(back=False, next_disabled=not can_go)
    if not can_go and st.session_state.token:
        st.caption("Verifica el token y selecciona cuenta + página para continuar.")


# ══════════════════════════════════════════════════════════════════════════════
# STEP 2 — Estrategia (análisis + brief de marca)
# ══════════════════════════════════════════════════════════════════════════════
INTAKE_SYSTEM = """Eres un consultor de marketing de respuesta directa. Tu trabajo es extraer en 3 preguntas la información que necesitas para escribir un anuncio que vende.

REGLAS ESTRICTAS:
- Haz UNA sola pregunta por turno. Nunca hagas listas.
- Máximo 3 preguntas en total antes de generar el perfil.
- Cada pregunta tiene un objetivo de copy específico — no preguntes por curiosidad.

SECUENCIA DE 3 PREGUNTAS (síguelas en este orden):

PREGUNTA 1 — El trigger:
"¿Qué situación o momento de vida lleva a alguien a contratarte? ¿Cuándo exactamente te buscan?"
→ Objetivo: encontrar el momento de máxima urgencia para el targeting y el hook del anuncio.

PREGUNTA 2 — El diferenciador real:
"¿Qué es lo que tus mejores clientes te dicen después de trabajar contigo? ¿Qué fue lo que más valoraron?"
→ Objetivo: extraer la propuesta de valor desde la voz del cliente, no desde el vendedor.

PREGUNTA 3 — El resultado concreto:
"¿Cuánto cobra por tu servicio/producto, y qué resultado concreto puede esperar el cliente?"
→ Objetivo: definir ticket, resultado prometido y la razón para actuar ahora.

DESPUÉS DE 3 RESPUESTAS SUSTANCIALES:
Sin avisar, genera directamente el perfil:

<business_profile>
{
  "tipo_negocio": "producto/servicio/mixto",
  "profesion_industria": "...",
  "descripcion_corta": "Una línea que resume el negocio",
  "propuesta_valor": "Qué problema resuelve y cómo",
  "cliente_ideal": "Quién es, en qué momento de vida está cuando te busca",
  "momento_compra": "El trigger exacto que los lleva a contratarte",
  "diferenciador": "Lo que los clientes más valoran (en sus propias palabras si es posible)",
  "ticket_promedio": "Precio o rango",
  "resultado_prometido": "Qué transformación o resultado concreto obtiene el cliente",
  "descripcion_completa": "2-3 líneas directas: quién eres, para quién, cuál es el resultado. Sin adjetivos vacíos. Listo para usar como brief de anuncio."
}
</business_profile>

TONO: Directo, sin rodeos. Una pregunta, una respuesta. Español latinoamericano.
INICIO: Saludo breve (1 línea) + primera pregunta directamente."""


def _save_profile_to_db():
    user = get_current_user()
    if not user:
        return
    save_business_profile(
        user["user_id"],
        st.session_state.get("brand_profile", {}),
        st.session_state.get("brand_brief", ""),
        st.session_state.get("chat_intake", []),
    )


def generate_business_profile_from_chat(chat_history):
    """Ask AI to generate the business profile based on interview so far."""
    messages = [{"role": m["role"], "content": m["content"]} for m in chat_history]
    messages.append({
        "role": "user",
        "content": "Con la información que tienes hasta ahora, genera el perfil completo del negocio en el formato <business_profile>. Si falta algún dato importante, usa lo que puedas inferir y márcalo como 'a confirmar'."
    })
    result = ai_chat_completion(INTAKE_SYSTEM, messages, max_tokens=1000)
    return result if result and not result.startswith("⚠️") else None


def _fetch_website_text(url: str) -> str:
    """Fetch a URL and return cleaned visible text (max 3000 chars)."""
    import re
    try:
        r = requests.get(url, timeout=12,
                         headers={"User-Agent": "Mozilla/5.0 (compatible; MetaAdsBot/1.0)"})
        r.raise_for_status()
        html = r.text
        og = {}
        for tag in re.findall(r'<meta[^>]+>', html, re.IGNORECASE):
            prop = re.search(r'(?:property|name)=["\']([^"\']+)["\']', tag)
            cont = re.search(r'content=["\']([^"\']+)["\']', tag)
            if prop and cont:
                og[prop.group(1).lower()] = cont.group(1)
        title = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
        title_text = title.group(1).strip() if title else ""
        meta_lines = []
        for key in ("og:title", "og:description", "og:site_name", "description", "keywords", "og:type"):
            if og.get(key):
                meta_lines.append(f"{key}: {og[key]}")
        html_clean = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html, flags=re.DOTALL | re.IGNORECASE)
        visible = re.sub(r'<[^>]+>', ' ', html_clean)
        visible = re.sub(r'\s+', ' ', visible).strip()
        parts = []
        if title_text:
            parts.append(f"TÍTULO: {title_text}")
        if meta_lines:
            parts.append("META TAGS:\n" + "\n".join(meta_lines))
        if visible:
            parts.append(f"CONTENIDO:\n{visible[:2000]}")
        return "\n\n".join(parts)
    except Exception as e:
        return f"ERROR: {e}"


def fetch_page_brand_profile(page_id: str, token: str) -> str:
    """
    Read the connected Facebook page via Graph API (info + recent posts)
    and return the raw AI response (may contain <business_profile>).
    """
    page_info = api_get(token, page_id, {
        "fields": "name,username,about,description,category,fan_count,website,general_info,mission"
    })
    if "error" in page_info:
        return f"ERROR: {page_info['error'].get('message', str(page_info['error']))}"

    lines = []
    for key in ("name", "username", "category", "fan_count", "about",
                 "description", "general_info", "mission", "website"):
        if page_info.get(key):
            lines.append(f"{key}: {page_info[key]}")
    page_text = "\n".join(lines)

    posts_data = api_get(token, f"{page_id}/posts", {"fields": "message,created_time", "limit": "6"})
    post_msgs  = [p.get("message", "") for p in posts_data.get("data", []) if p.get("message")][:4]
    posts_text = ("\n\nPUBLICACIONES RECIENTES:\n" + "\n---\n".join(post_msgs)) if post_msgs else ""

    prompt = f"""Analiza la información de la siguiente página de Facebook y genera un perfil de marca completo.

{page_text}{posts_text}

Instrucciones:
- Usa el nombre real de la marca y detalles concretos del negocio (no genéricos).
- Si algún campo no se puede determinar con certeza, infiere lo más razonable.
- Genera el perfil en el formato <business_profile>.
- Después del </business_profile>, escribe 2-3 oraciones resumiendo qué encontraste y qué fue inferido."""

    return ai_chat_completion(
        "Eres un experto en marketing digital que analiza páginas de Facebook para construir perfiles de marca precisos y útiles para campañas de anuncios.",
        [{"role": "user", "content": prompt}],
        max_tokens=950,
    )


def parse_business_profile(text):
    """Extract <business_profile>JSON</business_profile> from AI response."""
    import re
    match = re.search(r"<business_profile>(.*?)</business_profile>", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except Exception:
            return None
    return None


def _render_profile_chat_refine(chat_key: str, ai_label: str):
    """Mini-chat to refine an existing business profile."""
    if chat_key not in st.session_state:
        st.session_state[chat_key] = []

    chat_box = st.container(height=260)
    with chat_box:
        for msg in st.session_state[chat_key]:
            avatar = "🤖" if msg["role"] == "assistant" else "👤"
            with st.chat_message(msg["role"], avatar=avatar):
                text = msg["content"]
                if "<business_profile>" in text:
                    before = text[:text.find("<business_profile>")].strip()
                    after  = text[text.find("</business_profile>") + len("</business_profile>"):].strip()
                    if before:
                        st.markdown(before)
                    st.success("✓ Perfil actualizado")
                    if after:
                        st.markdown(after)
                else:
                    st.markdown(text)

    refine_system = (
        "Eres un consultor de marketing. Ya tienes el perfil inicial de este negocio. "
        "El usuario quiere agregar más contexto o corregir algo. Si la nueva información "
        "es suficiente para mejorar el perfil, genera un <business_profile> actualizado. "
        "Si solo es una aclaración puntual, responde brevemente y pide confirmación antes "
        "de regenerar el perfil completo."
    )
    user_msg = st.chat_input("Agrega contexto o corrige algo...", key="refine_input")
    if user_msg:
        st.session_state[chat_key].append({"role": "user", "content": user_msg})
        with st.spinner(f"{ai_label} actualizando..."):
            history = [{"role": m["role"], "content": m["content"]}
                       for m in st.session_state[chat_key]]
            reply = ai_chat_completion(refine_system, history, max_tokens=700)
        st.session_state[chat_key].append({"role": "assistant", "content": reply})
        profile = parse_business_profile(reply)
        if profile:
            st.session_state.brand_profile = profile
            st.session_state.brand_brief   = profile.get("descripcion_completa", "")
            st.session_state.profile_ready = True
            _save_profile_to_db()
        st.rerun()


def step_strategy():
    st.title("🧠 Conoce tu negocio")
    st.caption("Paso 2 de 9 · Construimos el perfil de tu marca a partir de tu página de Facebook")

    chat_key  = "chat_intake"
    ai_label  = "Claude Sonnet" if ENV.get("ANTHROPIC_API_KEY") else "GPT-4.1-mini"
    page_id   = st.session_state.get("page_id", "")
    page_name = st.session_state.get("page_name", "") or page_id
    token     = st.session_state.get("token", "")
    has_page  = bool(page_id and token)

    # ── AUTO-ANÁLISIS: dispara al entrar al paso si hay página conectada ──
    if has_page and not st.session_state.get("_page_auto_analyzed") and not st.session_state.get("brand_profile"):
        with st.spinner(f"Leyendo tu página **{page_name}** en Facebook..."):
            ai_text = fetch_page_brand_profile(page_id, token)
        st.session_state["_page_auto_analyzed"] = True
        if ai_text and not ai_text.startswith("ERROR"):
            st.session_state[chat_key] = [{"role": "assistant", "content": ai_text}]
            p = parse_business_profile(ai_text)
            if p:
                st.session_state.brand_profile = p
                st.session_state.brand_brief   = p.get("descripcion_completa", "")
                st.session_state.profile_ready = True
                _save_profile_to_db()
        else:
            st.session_state["_page_auto_analyzed_error"] = ai_text
        st.rerun()

    profile = st.session_state.get("brand_profile", {})

    # ══════════════════════════════════════════════════════════════════════
    # A) PERFIL YA GENERADO — vista de confirmación / edición
    # ══════════════════════════════════════════════════════════════════════
    if profile:
        st.success(f"Perfil generado automáticamente desde tu página de Facebook · **{page_name}**")

        col_left, col_right = st.columns([1, 1], gap="large")

        with col_left:
            st.markdown("### 📋 Perfil del negocio")
            fields = [
                ("Tipo de negocio",  "tipo_negocio"),
                ("Industria",        "profesion_industria"),
                ("Propuesta de valor","propuesta_valor"),
                ("Cliente ideal",    "cliente_ideal"),
                ("Diferenciador",    "diferenciador"),
                ("Ticket promedio",  "ticket_promedio"),
                ("Meta de ventas",   "objetivo_ventas"),
            ]
            for label, key in fields:
                val = profile.get(key, "")
                if val:
                    st.markdown(f"**{label}:** {val}")

            st.divider()
            if st.button("🔄 Re-analizar la página", use_container_width=True):
                for k in ("brand_profile", "brand_brief", "profile_ready",
                          "_page_auto_analyzed", "_page_auto_analyzed_error", chat_key):
                    st.session_state.pop(k, None)
                st.rerun()

        with col_right:
            st.markdown("### ✏️ Descripción completa")
            st.caption("Esta descripción se usa en todos los pasos del wizard. Edítala si necesitas ajustar algo.")
            desc = st.text_area(
                "Descripción",
                value=st.session_state.get("brand_brief", ""),
                height=180,
                key="brand_brief_edit",
                label_visibility="collapsed",
            )
            st.session_state.brand_brief = desc

            st.divider()
            with st.expander("💬 Agregar contexto o corregir con IA"):
                if not has_ai():
                    st.caption("Configura `OPENIA_API_KEY` o `ANTHROPIC_API_KEY` para activar este chat.")
                else:
                    _render_profile_chat_refine(chat_key, ai_label)

            # Análisis de campañas anteriores
            st.divider()
            st.markdown("### 📊 Campañas anteriores")
            if not st.session_state.analysis_done:
                if st.button("🔍 Analizar mi cuenta", type="primary", use_container_width=True):
                    with st.spinner("Leyendo campañas y métricas..."):
                        analysis = analyze_account_campaigns()
                        st.session_state.campaign_analysis = analysis or ""
                        st.session_state.analysis_done     = True
                    st.rerun()
                st.caption("Claude leerá tus últimas campañas y dirá qué mejorar.")
            else:
                st.markdown(st.session_state.campaign_analysis)
                if st.button("🔄 Re-analizar", use_container_width=True):
                    st.session_state.analysis_done = False
                    st.rerun()

    # ══════════════════════════════════════════════════════════════════════
    # B) SIN PERFIL — fallback: chat de entrevista o descripción manual
    # ══════════════════════════════════════════════════════════════════════
    else:
        if st.session_state.get("_page_auto_analyzed_error"):
            st.warning(f"No se pudo leer la página automáticamente: {st.session_state['_page_auto_analyzed_error']}\nResponde las preguntas del chat o ingresa la descripción manualmente.")

        if not has_page:
            st.info("Conecta tu cuenta de Meta en el Paso 1 para que analicemos tu página automáticamente. O describe tu negocio aquí:")

        col_chat, col_help = st.columns([1.1, 1], gap="large")

        with col_chat:
            if chat_key not in st.session_state:
                st.session_state[chat_key] = []

            # URL fallback (website) if no FB page
            if not has_page:
                with st.expander("🔗 Analizar sitio web", expanded=True):
                    url_col, btn_col = st.columns([4, 1])
                    with url_col:
                        url_input = st.text_input("URL", placeholder="https://mipagina.com",
                                                   key="brand_url_input", label_visibility="collapsed")
                    with btn_col:
                        analyze_btn = st.button("Analizar →", use_container_width=True,
                                                type="primary", key="analyze_url_btn")
                    if analyze_btn and url_input:
                        raw = url_input.strip()
                        if not raw.startswith("http"):
                            raw = "https://" + raw
                        with st.spinner(f"Analizando {raw}..."):
                            web_text = _fetch_website_text(raw)
                        if web_text.startswith("ERROR"):
                            st.error(web_text)
                        else:
                            prompt = (f"Analiza la siguiente información extraída de: {raw}\n\n{web_text}\n\n"
                                      "Genera un perfil completo del negocio en el formato <business_profile>. "
                                      "Después del </business_profile>, escribe 1 oración confirmando qué encontraste.")
                            with st.spinner("Generando perfil..."):
                                ai_text = ai_chat_completion(
                                    "Eres un experto en marketing que construye perfiles de marca desde sitios web.",
                                    [{"role": "user", "content": prompt}], max_tokens=900)
                            st.session_state[chat_key] = [{"role": "assistant", "content": ai_text}]
                            p = parse_business_profile(ai_text)
                            if p:
                                st.session_state.brand_profile = p
                                st.session_state.brand_brief   = p.get("descripcion_completa", "")
                                st.session_state.profile_ready = True
                                _save_profile_to_db()
                                st.toast("✅ Perfil extraído del sitio web", icon="🌐")
                            st.rerun()

            st.markdown(f"### 💬 Entrevista con {ai_label}")

            if not has_ai():
                st.warning("Agrega `OPENIA_API_KEY` en tu `.env` para activar la entrevista.")
            else:
                if not st.session_state[chat_key]:
                    with st.spinner(f"{ai_label} iniciando entrevista..."):
                        opening = ai_chat_completion(INTAKE_SYSTEM,
                                                     [{"role": "user", "content": "Inicia la entrevista."}],
                                                     max_tokens=300)
                        if opening.startswith("⚠️") or opening.startswith("Error"):
                            opening = "¡Hola! Para crear los mejores anuncios, necesito conocerte mejor.\n\n**¿A qué te dedicas?** ¿Vendes un producto, ofreces un servicio, o ambas cosas?"
                    st.session_state[chat_key].append({"role": "assistant", "content": opening})
                    st.rerun()

                chat_box = st.container(height=380)
                with chat_box:
                    for msg in st.session_state[chat_key]:
                        avatar = "🤖" if msg["role"] == "assistant" else "👤"
                        with st.chat_message(msg["role"], avatar=avatar):
                            text = msg["content"]
                            if "<business_profile>" in text:
                                before = text[:text.find("<business_profile>")].strip()
                                after  = text[text.find("</business_profile>") + len("</business_profile>"):].strip()
                                if before:
                                    st.markdown(before)
                                st.success("✓ Perfil generado — revísalo en el panel →")
                                if after:
                                    st.markdown(after)
                            else:
                                st.markdown(text)

                user_msg = st.chat_input("Responde aquí...", key="intake_input")
                if user_msg:
                    st.session_state[chat_key].append({"role": "user", "content": user_msg})
                    with st.spinner(f"{ai_label} analizando..."):
                        history = [{"role": m["role"], "content": m["content"]}
                                   for m in st.session_state[chat_key]]
                        reply = ai_chat_completion(INTAKE_SYSTEM, history, max_tokens=700)
                    st.session_state[chat_key].append({"role": "assistant", "content": reply})
                    p = parse_business_profile(reply)
                    if p:
                        st.session_state.brand_profile = p
                        st.session_state.brand_brief   = p.get("descripcion_completa", "")
                        st.session_state.profile_ready = True
                        _save_profile_to_db()
                    st.rerun()

                n_answers = sum(1 for m in st.session_state[chat_key] if m["role"] == "user")
                if n_answers >= 3 and not st.session_state.get("profile_ready"):
                    if st.button("📋 Generar perfil del negocio ahora", use_container_width=True):
                        with st.spinner("Generando perfil completo..."):
                            result = generate_business_profile_from_chat(st.session_state[chat_key])
                            if result:
                                st.session_state[chat_key].append({"role": "assistant", "content": result})
                                p = parse_business_profile(result)
                                if p:
                                    st.session_state.brand_profile = p
                                    st.session_state.brand_brief   = p.get("descripcion_completa", "")
                                    st.session_state.profile_ready = True
                                    _save_profile_to_db()
                        st.rerun()

        with col_help:
            st.markdown("### 📋 Tu perfil de negocio")
            st.info("Responde las preguntas del chat y aquí aparecerá el perfil completo.")
            st.markdown("**Claude preguntará sobre:**")
            st.markdown("""
- 🏷️ Tipo de negocio (producto / servicio)
- 👔 Profesión e industria
- 💎 Propuesta de valor y diferenciador
- 👤 Tu cliente ideal
- 📅 Cuándo y por qué te contratan
- 🎯 Objetivos de ventas mensuales
- 💰 Ticket promedio
            """)
            if not has_ai():
                st.divider()
                brief = st.text_area("Describe tu negocio (ingreso manual)",
                                     value=st.session_state.brand_brief, height=120,
                                     placeholder="Soy violinista en Ambato. Ofrezco música en vivo para bodas y graduaciones...")
                st.session_state.brand_brief = brief
                if brief and st.button("Usar esta descripción"):
                    st.session_state.profile_ready = True
                    st.rerun()

    st.markdown("---")
    can_go = bool(st.session_state.brand_brief)
    nav(next_disabled=not can_go)
    if not can_go:
        st.caption("Completa el perfil de tu negocio para continuar.")


# ══════════════════════════════════════════════════════════════════════════════
# STEP 3 — Campaña
# ══════════════════════════════════════════════════════════════════════════════
def step_campaign():
    st.title("📣 Nombre y objetivo")
    st.caption("Paso 3 de 9")

    name = st.text_input("Nombre de la campaña", value=st.session_state.campaign_name, max_chars=100)
    st.session_state.campaign_name = name

    st.markdown("### Objetivo")
    obj_label = st.radio(
        "¿Qué quieres lograr?",
        list(OBJECTIVES.keys()),
        index=list(OBJECTIVES.values()).index(st.session_state.objective),
    )
    st.session_state.objective = OBJECTIVES[obj_label]
    st.info(OBJECTIVE_NOTES[st.session_state.objective])

    st.caption("💡 Pídele al asistente Claude que te recomiende el objetivo basado en tu tipo de negocio.")
    st.markdown("---")
    nav(next_disabled=not name)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 4 — Audiencia
# ══════════════════════════════════════════════════════════════════════════════
def step_audience():
    st.title("🎯 Audiencia")
    st.caption("Paso 4 de 9")

    st.markdown("### 📍 Ciudad objetivo")
    col_q, col_btn = st.columns([3, 1])
    with col_q:
        city_q = st.text_input("Buscar ciudad", placeholder="Ej: Ambato, Quito...", key="city_input")
    with col_btn:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("Buscar", key="btn_city"):
            if city_q:
                with st.spinner("Buscando..."):
                    r = api_get(st.session_state.token, "search", {
                        "type": "adgeolocation",
                        "q": city_q,
                        "limit": 10,
                    })
                    st.session_state.city_results = [loc for loc in r.get("data", []) if loc.get("type") in ("city", "subcity")]

    if st.session_state.city_results:
        city_map = {f"{l['name']}, {l.get('region','')} — {l.get('country_code','')}": l for l in st.session_state.city_results}
        sel_key  = st.selectbox("Selecciona la ciudad", list(city_map.keys()))
        if st.button("✓ Usar esta ciudad"):
            loc = city_map[sel_key]
            st.session_state.city_key     = loc["key"]
            st.session_state.city_name    = f"{loc['name']}, {loc.get('region','')}"
            st.session_state.city_results = []
            st.rerun()

    if st.session_state.city_key:
        st.success(f"Ciudad: **{st.session_state.city_name}** (key `{st.session_state.city_key}`)")
        radius = st.slider("Radio (km)", 5, 80, st.session_state.city_radius, 5)
        st.session_state.city_radius = radius

    st.divider()
    st.markdown("### 👥 Edad")
    age = st.slider("Rango", 13, 65, (st.session_state.age_min, st.session_state.age_max))
    st.session_state.age_min, st.session_state.age_max = age[0], age[1]

    st.divider()
    st.markdown("### 💡 Intereses (opcional)")
    col_i, col_ib = st.columns([3, 1])
    with col_i:
        int_q = st.text_input("Buscar interés", placeholder="Ej: bodas, graduaciones...", key="int_input")
    with col_ib:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("Buscar", key="btn_int") and int_q:
            with st.spinner():
                r = api_get(st.session_state.token, "search", {"type": "adinterest", "q": int_q, "locale": "es_LA", "limit": 8})
                st.session_state.interest_results = r.get("data", [])

    if st.session_state.interest_results:
        int_map  = {i["name"]: i for i in st.session_state.interest_results}
        sel_int  = st.selectbox("Selecciona", list(int_map.keys()))
        if st.button("➕ Agregar"):
            existing = [x["id"] for x in st.session_state.interests]
            chosen   = int_map[sel_int]
            if chosen["id"] not in existing:
                st.session_state.interests.append({"id": chosen["id"], "name": chosen["name"]})
                st.session_state.interest_results = []
                st.rerun()

    for i, interest in enumerate(list(st.session_state.interests)):
        c1, c2 = st.columns([5, 1])
        with c1: st.write(f"• {interest['name']}")
        with c2:
            if st.button("✕", key=f"del_int_{i}"):
                st.session_state.interests.pop(i)
                st.rerun()

    st.caption("💡 Pídele al asistente que te sugiera intereses relevantes para tu negocio.")
    st.markdown("---")
    nav(next_disabled=not st.session_state.city_key)


# ══════════════════════════════════════════════════════════════════════════════
# STEP 5 — Presupuesto
# ══════════════════════════════════════════════════════════════════════════════
def step_budget():
    st.title("💰 Presupuesto")
    st.caption("Paso 5 de 9")

    budget_usd = st.number_input(
        "Presupuesto diario (USD)",
        min_value=1.0, max_value=1000.0,
        value=round(st.session_state.daily_budget / 100, 2),
        step=0.5, format="%.2f",
    )
    st.session_state.daily_budget = int(round(budget_usd * 100))

    col1, col2 = st.columns(2)
    with col1: st.metric("Semana",  f"${budget_usd * 7:.0f}")
    with col2: st.metric("Mes",     f"${budget_usd * 30:.0f}")

    if st.session_state.objective == "OUTCOME_ENGAGEMENT":
        st.divider()
        st.markdown("### 🎯 Puja máxima por conversación")
        bid_usd = st.number_input(
            "Máximo a pagar por mensaje WhatsApp (USD)",
            min_value=0.5, max_value=50.0,
            value=round(st.session_state.bid_amount / 100, 2),
            step=0.5, format="%.2f",
        )
        st.session_state.bid_amount = int(round(bid_usd * 100))
        st.caption(f"Referencia Ecuador: $1.00–$3.00 por conversación.")

    st.caption("💡 Pregúntale al asistente si tu presupuesto es suficiente para el objetivo y la ciudad.")
    st.markdown("---")
    nav()


# ══════════════════════════════════════════════════════════════════════════════
# STEP 6 — Copy (con chat inline + sidebar)
# ══════════════════════════════════════════════════════════════════════════════
def _fb_ad_preview(ad: dict, media: dict, page_name: str, var_label: str):
    """Render a Facebook-style ad preview card (3-part: header, image, footer)."""
    import io
    body      = (ad.get("body") or "").strip()
    headline  = (ad.get("headline") or "Titular del anuncio").strip()
    desc      = (ad.get("description") or "").strip()
    cta_label = next((k for k, v in CTA_OPTIONS.items() if v == ad.get("cta", "")), "Enviar mensaje")
    initial   = page_name[0].upper() if page_name else "P"
    trunc     = body[:220] + ("…" if len(body) > 220 else "")

    st.markdown(f"""
<div style="background:#1877f2;color:white;text-align:center;padding:4px 8px;border-radius:6px 6px 0 0;font-size:11px;font-weight:700;letter-spacing:.5px">{var_label}</div>
<div style="border:1px solid #dde1e7;border-top:none;border-radius:0 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff">
  <div style="padding:10px 12px 6px;display:flex;align-items:center;gap:8px">
    <div style="width:36px;height:36px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:15px;flex-shrink:0">{initial}</div>
    <div>
      <div style="font-weight:700;font-size:13px;color:#1c1e21">{page_name}</div>
      <div style="font-size:11px;color:#8a8d91">Patrocinado · 🌐</div>
    </div>
  </div>
  <div style="padding:4px 12px 10px;font-size:13px;color:#1c1e21;line-height:1.5">{trunc if trunc else '<span style="color:#bec3c9">Texto del anuncio aparecerá aquí</span>'}</div>
</div>""", unsafe_allow_html=True)

    # Media slot
    if media.get("bytes") and media.get("type") == "image":
        try:
            from PIL import Image as PILImage
            img = PILImage.open(io.BytesIO(media["bytes"]))
            st.image(img, use_container_width=True)
        except Exception:
            st.markdown('<div style="background:#f0f2f5;height:140px;display:flex;align-items:center;justify-content:center;font-size:32px;border:1px solid #dde1e7">📷</div>', unsafe_allow_html=True)
    elif media.get("bytes") and media.get("type") == "video":
        st.video(media["bytes"])
    else:
        st.markdown('<div style="background:#f0f2f5;height:140px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#bec3c9;border:1px solid #dde1e7">📷</div>', unsafe_allow_html=True)

    desc_html = f'<div style="font-size:12px;color:#606770;margin-top:2px">{desc}</div>' if desc else ""
    st.markdown(f"""
<div style="border:1px solid #dde1e7;border-top:none;border-radius:0 0 12px 12px;overflow:hidden">
  <div style="background:#f0f2f5;padding:10px 12px">
    <div style="font-size:10px;color:#8a8d91;text-transform:uppercase;letter-spacing:.5px">Anuncio</div>
    <div style="font-weight:700;font-size:14px;color:#1c1e21;margin-top:2px">{headline}</div>
    {desc_html}
  </div>
  <div style="padding:8px 12px;background:#fff">
    <div style="background:#e7e7e7;border-radius:6px;padding:9px;text-align:center;font-size:13px;font-weight:600;color:#1c1e21">{cta_label}</div>
  </div>
</div>""", unsafe_allow_html=True)


def step_copy():
    st.title("✍️ Copy del anuncio")
    st.caption("Paso 7 de 9 · La IA genera las 3 variaciones — tú revisas y ajustas")

    ai_label = "Claude" if ENV.get("ANTHROPIC_API_KEY") else "GPT-4.1-mini"
    chat_key = "chat_copy_inline"
    if chat_key not in st.session_state:
        st.session_state[chat_key] = []

    # ── TOP ROW: AI panel | Variation forms ───────────────────────────────
    col_ai, col_vars = st.columns([1, 1.6], gap="large")

    # ── AI PANEL ──────────────────────────────────────────────────────────
    with col_ai:
        st.markdown(f"""
<div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:12px;padding:14px 18px 12px;margin-bottom:14px">
  <div style="color:#fff;font-size:15px;font-weight:700;letter-spacing:-.2px">🤖 Asistente de Copy</div>
  <div style="color:#90aac8;font-size:12px;margin-top:3px">Powered by {ai_label}</div>
</div>""", unsafe_allow_html=True)

        if not st.session_state[chat_key]:
            brand    = st.session_state.get("brand_brief", "")
            campaign = st.session_state.get("campaign_name", "")
            welcome  = (
                f"Tengo el perfil de tu marca listo. Haz clic en **Generar copy** y escribo "
                f"las 3 variaciones optimizadas para **{campaign}** en segundos.\n\nO cuéntame "
                "qué quieres destacar en este anuncio y lo personalizo."
                if brand else
                "Cuéntame qué quieres anunciar y escribo las 3 variaciones."
            )
            st.session_state[chat_key].append({"role": "assistant", "content": welcome})

        chat_box = st.container(height=310)
        with chat_box:
            for msg in st.session_state[chat_key]:
                with st.chat_message(msg["role"], avatar="🤖" if msg["role"] == "assistant" else "👤"):
                    text = msg["content"]
                    if "<copy_suggestion>" in text:
                        before = text[:text.find("<copy_suggestion>")].strip()
                        after  = text[text.rfind("</copy_suggestion>") + len("</copy_suggestion>"):].strip()
                        if before:
                            st.markdown(before)
                        st.success("Copy generado ✓ — haz clic en **Aplicar** para llenar las variaciones")
                        if after:
                            st.markdown(after)
                    else:
                        st.markdown(text)

        # Quick-generate button
        if st.button("⚡ Generar copy ahora", type="primary", use_container_width=True, key="quick_gen_btn"):
            brand    = st.session_state.get("brand_brief", "No especificada")
            campaign = st.session_state.get("campaign_name", "")
            obj      = st.session_state.get("objective", "")
            qmsg     = f"Escribe las 3 variaciones de copy para la campaña '{campaign}' con objetivo {obj}. Negocio: {brand[:350]}"
            st.session_state[chat_key].append({"role": "user", "content": "Genera el copy para las 3 variaciones."})
            with st.spinner(f"{ai_label} escribiendo copy..."):
                copy_sys = (SIDEBAR_SYSTEM +
                            f"\n\nDescripción del negocio: {brand}\n\n"
                            "SIEMPRE genera las 3 variaciones (A, B, C) en formato <copy_suggestion>.")
                history  = [{"role": m["role"], "content": m["content"]}
                             for m in st.session_state[chat_key][:-1]]
                history.append({"role": "user", "content": qmsg + f"\n\nCONTEXTO:\n{build_wizard_context()}"})
                reply = ai_chat_completion(copy_sys, history, max_tokens=1500)
            st.session_state[chat_key].append({"role": "assistant", "content": reply})
            sug = parse_copy_suggestion(reply)
            if sug:
                st.session_state.pending_copy_suggestion = sug
            st.rerun()

        user_copy_msg = st.chat_input(f"Pide algo específico a {ai_label}...", key="copy_chat_input")
        if user_copy_msg:
            st.session_state[chat_key].append({"role": "user", "content": user_copy_msg})
            with st.spinner(f"{ai_label} escribiendo..."):
                copy_sys = (SIDEBAR_SYSTEM +
                            f"\n\nDescripción del negocio: {st.session_state.get('brand_brief','')}\n\n"
                            "Si te piden copy, genera las 3 variaciones (A, B, C) en formato <copy_suggestion>.")
                history  = [{"role": m["role"], "content": m["content"]}
                             for m in st.session_state[chat_key][:-1]]
                history.append({"role": "user", "content": user_copy_msg + f"\n\nCONTEXTO:\n{build_wizard_context()}"})
                reply = ai_chat_completion(copy_sys, history, max_tokens=1500)
            st.session_state[chat_key].append({"role": "assistant", "content": reply})
            sug = parse_copy_suggestion(reply)
            if sug:
                st.session_state.pending_copy_suggestion = sug
            st.rerun()

        # Apply block — appears only when suggestion is ready
        if st.session_state.get("pending_copy_suggestion"):
            sug = st.session_state.pending_copy_suggestion
            st.markdown("---")
            st.markdown("**Copy listo para aplicar:**")
            for var_key, fields in sug.items():
                hl = fields.get("headline", "")
                st.markdown(f"• **{var_key}:** {hl}")
            if st.button("✅ Aplicar las 3 variaciones", type="primary",
                         use_container_width=True, key="apply_copy_btn"):
                apply_copy_suggestion(sug)
                st.session_state.pending_copy_suggestion = None
                st.toast("Variaciones aplicadas en los formularios", icon="✍️")
                st.rerun()

    # ── VARIATION FORMS ───────────────────────────────────────────────────
    with col_vars:
        applied = not any(ad["pending_apply"] for ad in st.session_state.ads_copy) \
                  if any("pending_apply" in ad for ad in st.session_state.ads_copy) else False

        # Banner when just applied
        if st.session_state.get("_copy_just_applied"):
            st.success("✅ Las 3 variaciones fueron completadas con el copy generado — revisa y ajusta si necesitas.")
            del st.session_state["_copy_just_applied"]

        st.markdown("### 📝 Las 3 variaciones")
        tabs = st.tabs([ad["label"] for ad in st.session_state.ads_copy])
        for i, (tab, ad) in enumerate(zip(tabs, st.session_state.ads_copy)):
            with tab:
                angle_colors = ["#e3f2fd", "#f3e5f5", "#e8f5e9"]
                st.markdown(
                    f'<div style="background:{angle_colors[i]};border-radius:6px;padding:6px 10px;'
                    f'font-size:12px;color:#444;margin-bottom:8px">🎯 {ad["angle"]}</div>',
                    unsafe_allow_html=True,
                )
                body = st.text_area(
                    "Texto principal del anuncio",
                    value=ad["body"],
                    height=150,
                    placeholder="El hook va en las primeras 2 líneas. Máximo 125 caracteres antes del «ver más».",
                    key=f"body_{i}",
                )
                c1, c2 = st.columns(2)
                with c1:
                    headline = st.text_input("Titular", value=ad["headline"],
                                             max_chars=40, key=f"hl_{i}")
                    st.caption(f"{len(headline)}/40 caracteres")
                with c2:
                    description = st.text_input("Descripción del enlace",
                                                value=ad["description"],
                                                max_chars=30, key=f"desc_{i}")
                    st.caption(f"{len(description)}/30 caracteres")
                cta_disp = st.selectbox(
                    "Llamada a la acción (CTA)",
                    list(CTA_OPTIONS.keys()),
                    index=list(CTA_OPTIONS.values()).index(ad["cta"])
                          if ad["cta"] in CTA_OPTIONS.values() else 0,
                    key=f"cta_{i}",
                )
                st.session_state.ads_copy[i]["body"]        = body
                st.session_state.ads_copy[i]["headline"]    = headline
                st.session_state.ads_copy[i]["description"] = description
                st.session_state.ads_copy[i]["cta"]         = CTA_OPTIONS[cta_disp]

    # ── BOTTOM: Full-width ad previews ────────────────────────────────────
    st.markdown("---")
    st.markdown("## 👁️ Vista previa del anuncio")
    st.caption("Así se verán tus anuncios en el feed de Facebook e Instagram. La imagen/video se asigna en el siguiente paso.")

    page_name  = st.session_state.get("page_name", "Tu Página") or "Tu Página"
    media_list = st.session_state.get("media", [{}, {}, {}])

    prev_c1, prev_c2, prev_c3 = st.columns(3, gap="medium")
    for col, i in zip([prev_c1, prev_c2, prev_c3], range(3)):
        with col:
            ad    = st.session_state.ads_copy[i]
            media = media_list[i] if i < len(media_list) else {}
            _fb_ad_preview(ad, media, page_name, var_label=ad.get("label", f"Ad {i+1}"))

    all_filled = all(ad["body"].strip() and ad["headline"].strip() for ad in st.session_state.ads_copy)
    st.markdown("---")
    nav(next_disabled=not all_filled)
    if not all_filled:
        st.caption("Completa texto y titular de las 3 variaciones para continuar.")


# ══════════════════════════════════════════════════════════════════════════════
# STEP 7 — Creativos
# ══════════════════════════════════════════════════════════════════════════════
def _render_ad_preview(ad, media):
    """Renderiza una tarjeta de preview del anuncio con imagen/video + copy."""
    import io
    st.markdown("**Vista previa del anuncio:**")
    preview_html_top = f"""
<div style="border:1px solid #ddd;border-radius:10px;overflow:hidden;font-family:sans-serif;max-width:320px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.1)">
<div style="padding:8px 10px;display:flex;align-items:center;gap:8px">
  <div style="width:34px;height:34px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px">P</div>
  <div><div style="font-weight:600;font-size:13px">Tu Página</div><div style="font-size:11px;color:#888">Publicidad · 🌐</div></div>
</div>
<div style="padding:0 10px 8px;font-size:13px;color:#1c1e21;line-height:1.4">{(ad.get('body',''))[:120]}{"..." if len(ad.get('body',''))>120 else ""}</div>"""
    st.markdown(preview_html_top, unsafe_allow_html=True)

    if media.get("bytes"):
        if media["type"] == "image":
            try:
                from PIL import Image
                img = Image.open(io.BytesIO(media["bytes"]))
                img.thumbnail((320, 320))
                st.image(img, use_container_width=True)
            except Exception:
                pass
        else:
            st.video(media["bytes"])

    preview_html_bottom = f"""
<div style="background:#f0f2f5;padding:10px;border-top:1px solid #ddd">
  <div style="font-size:11px;color:#888;text-transform:uppercase">página web</div>
  <div style="font-weight:600;font-size:14px">{ad.get('headline','Titular') or 'Titular'}</div>
  <div style="font-size:12px;color:#555">{ad.get('description','') or ''}</div>
</div>
<div style="padding:8px 10px">
  <div style="background:#e7e7e7;border-radius:6px;padding:8px;text-align:center;font-size:13px;font-weight:600;color:#1c1e21">
    {next((k for k,v in CTA_OPTIONS.items() if v == ad.get('cta','')), 'WhatsApp')} →
  </div>
</div>
</div>"""
    st.markdown(preview_html_bottom, unsafe_allow_html=True)


def step_creatives():
    st.title("🖼️ Creativos")
    st.caption("Paso 6 de 9 · Sube imagen o video — se suben a Meta ahora para validarlos")

    token      = st.session_state.get("token", "")
    account_id = st.session_state.get("account_id", "")

    tabs = st.tabs([ad["label"] for ad in st.session_state.ads_copy])
    for i, tab in enumerate(tabs):
        with tab:
            media = st.session_state.media[i]
            ad    = st.session_state.ads_copy[i]

            if media.get("bytes"):
                col_prev, col_info, col_ad = st.columns([1, 1, 1])

                # ── Columna 1: archivo + botón cambiar ──────────────────────
                with col_prev:
                    if media["type"] == "image":
                        try:
                            from PIL import Image
                            import io
                            st.image(Image.open(io.BytesIO(media["bytes"])), width=220)
                        except Exception:
                            pass
                    else:
                        st.video(media["bytes"])

                    st.caption(f"📄 {media['name']}")
                    if st.button("🔄 Cambiar archivo", key=f"clear_{i}", use_container_width=True):
                        st.session_state.media[i] = {"type": None, "bytes": None, "name": "",
                                                      "meta_hash": None, "meta_video_id": None}
                        st.session_state.pop(f"img_analysis_{i}", None)
                        st.rerun()

                # ── Columna 2: estado Meta + análisis IA ────────────────────
                with col_info:
                    # Estado de subida a Meta
                    meta_hash     = media.get("meta_hash")
                    meta_video_id = media.get("meta_video_id")

                    if meta_hash:
                        st.success("✅ **Subida a Meta**")
                        st.caption(f"Hash: `{meta_hash[:16]}...`")
                    elif meta_video_id:
                        st.success("✅ **Video subido a Meta**")
                        st.caption(f"Video ID: `{meta_video_id}`")
                    else:
                        st.warning("⏳ Pendiente de subir a Meta")
                        if media["type"] == "image":
                            if st.button("📤 Subir imagen a Meta", key=f"upload_meta_{i}", use_container_width=True, type="primary"):
                                with st.spinner("Subiendo imagen a Meta Ads..."):
                                    try:
                                        img_hash = upload_image(token, account_id, media["bytes"])
                                        st.session_state.media[i]["meta_hash"] = img_hash
                                        st.toast("✅ Imagen subida correctamente a Meta", icon="✅")
                                        st.rerun()
                                    except RuntimeError as e:
                                        st.error(f"Error al subir imagen: {e}")
                        else:
                            if st.button("📤 Subir video a Meta", key=f"upload_meta_{i}", use_container_width=True, type="primary"):
                                with st.spinner("Subiendo video a Meta Ads... (puede tardar 30-60 seg)"):
                                    try:
                                        vid_id = upload_video(token, account_id, media["bytes"], media["name"])
                                        st.session_state.media[i]["meta_video_id"] = vid_id
                                        st.toast("✅ Video subido correctamente a Meta", icon="✅")
                                        st.rerun()
                                    except RuntimeError as e:
                                        st.error(f"Error al subir video: {e}")

                    st.divider()

                    # Análisis IA de imagen
                    analysis = st.session_state.get(f"img_analysis_{i}")
                    if analysis and "error" not in analysis:
                        st.markdown("**🤖 Análisis IA:**")
                        st.caption(f"📌 `{analysis.get('angulo', '')}`")
                        st.caption(f"🎣 {analysis.get('hook_visual', '')}")
                        st.caption(f"💡 {analysis.get('consejo', '')}")
                        if st.button(f"✅ Aplicar copy sugerido", key=f"apply_img_{i}", use_container_width=True):
                            st.session_state.ads_copy[i]["body"]        = analysis.get("texto_principal", "")
                            st.session_state.ads_copy[i]["headline"]    = analysis.get("titular", "")[:40]
                            st.session_state.ads_copy[i]["description"] = analysis.get("descripcion_ad", "")[:30]
                            st.toast("Copy aplicado — ya está en Paso 6.", icon="✅")
                            st.rerun()
                    elif media["type"] == "image" and ENV.get("OPENIA_API_KEY"):
                        if st.button("🔍 Analizar con IA", key=f"analyze_{i}", use_container_width=True):
                            with st.spinner("Analizando imagen..."):
                                result = analyze_image_with_openai(media["bytes"], st.session_state.get("brand_brief", ""))
                                if result:
                                    st.session_state[f"img_analysis_{i}"] = result
                            st.rerun()
                    elif media["type"] == "video":
                        st.caption("💡 Para video: pídele al asistente sugerencias de copy basadas en el concepto del video.")

                # ── Columna 3: preview del anuncio ──────────────────────────
                with col_ad:
                    _render_ad_preview(ad, media)

            else:
                # ── Sin archivo: uploader + copiar de otra variación ────────
                st.markdown(f"#### Variación {ad['label']} — sin archivo")
                up = st.file_uploader(
                    "Arrastra o selecciona JPG / PNG / MP4 / MOV",
                    type=["jpg", "jpeg", "png", "mp4", "mov"],
                    key=f"up_{i}",
                )
                if up:
                    ftype      = "video" if up.type.startswith("video") else "image"
                    file_bytes = up.getvalue()
                    st.session_state.media[i] = {
                        "type": ftype, "bytes": file_bytes,
                        "name": up.name, "content_type": up.type,
                        "meta_hash": None, "meta_video_id": None,
                    }
                    if ftype == "image" and ENV.get("OPENIA_API_KEY"):
                        with st.spinner("🤖 Analizando imagen con IA..."):
                            analysis = analyze_image_with_openai(file_bytes, st.session_state.get("brand_brief", ""))
                            if analysis and "error" not in analysis:
                                st.session_state[f"img_analysis_{i}"] = analysis
                    st.rerun()

                others = [j for j in range(3) if j != i and st.session_state.media[j].get("bytes")]
                if others:
                    st.markdown("**O copia de otra variación:**")
                    for j in others:
                        lbl = st.session_state.ads_copy[j]["label"]
                        if st.button(f"Copiar archivo de Variación {lbl}", key=f"copy_{i}_{j}", use_container_width=True):
                            st.session_state.media[i] = dict(st.session_state.media[j])
                            st.session_state.media[i].update({"meta_hash": None, "meta_video_id": None})
                            st.rerun()

                st.info("Sin archivo → el ad se crea solo con texto. Puedes agregar el creativo después en Ads Manager.")

                # Preview con solo copy
                if ad.get("body") or ad.get("headline"):
                    _render_ad_preview(ad, {})

    # Resumen de estado de subidas
    st.markdown("---")
    uploaded = sum(1 for m in st.session_state.media if m.get("meta_hash") or m.get("meta_video_id"))
    total    = sum(1 for m in st.session_state.media if m.get("bytes"))
    if total > 0:
        if uploaded == total:
            st.success(f"✅ {uploaded}/{total} archivos subidos a Meta — listos para crear el anuncio")
        else:
            st.warning(f"⏳ {uploaded}/{total} archivos subidos a Meta — sube los restantes para validarlos antes de crear")

    st.caption("💡 Pídele al asistente sugerencias sobre el tipo de creativo (video vs foto, formato, hook visual).")
    nav()


# ══════════════════════════════════════════════════════════════════════════════
# STEP 8 — Revisión
# ══════════════════════════════════════════════════════════════════════════════
def step_review():
    st.title("👁️ Revisión final")
    st.caption("Paso 8 de 9 · Revisa todo antes de crear")

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("#### Campaña")
        st.markdown(f"**Nombre:** {st.session_state.campaign_name}\n\n**Objetivo:** {st.session_state.objective}\n\n**Cuenta:** {st.session_state.account_name}\n\n**Página:** {st.session_state.page_name}")
        st.markdown("#### Audiencia")
        st.markdown(f"**Ciudad:** {st.session_state.city_name} ({st.session_state.city_radius}km)\n\n**Edad:** {st.session_state.age_min}–{st.session_state.age_max}")
        for interest in st.session_state.interests:
            st.markdown(f"• {interest['name']}")
    with c2:
        st.markdown("#### Presupuesto")
        opt_goal = OPTIMIZATION_MAP.get(st.session_state.objective, "")
        st.markdown(f"**Diario:** ${st.session_state.daily_budget/100:.2f}\n\n**Optimización:** {opt_goal}")
        if st.session_state.objective == "OUTCOME_ENGAGEMENT":
            st.markdown(f"**Puja máx:** ${st.session_state.bid_amount/100:.2f}/conversación")
        st.markdown("#### Creativos")
        for i, m in enumerate(st.session_state.media):
            lbl = st.session_state.ads_copy[i]["label"]
            st.markdown(f"{'✓' if m.get('bytes') else '○'} {lbl}: {m['name'] if m.get('bytes') else 'sin archivo'}")

    st.divider()
    st.markdown("#### Copy — 3 variaciones")
    for ad in st.session_state.ads_copy:
        with st.expander(f"**{ad['label']}**"):
            st.markdown(f"**Titular:** {ad['headline']}  ·  **CTA:** {ad['cta']}")
            st.markdown(ad["body"])

    st.caption("💡 Pídele al asistente que revise el briefing completo y te diga si cambiaría algo antes de crear.")
    st.markdown("---")
    if not st.session_state.done:
        nav(next_label="🚀 Crear campaña →")
    else:
        st.success("Campaña ya creada.")
        if st.button("Ver resultados →", type="primary"):
            st.session_state.step = 9
            st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# STEP 9 — Crear
# ══════════════════════════════════════════════════════════════════════════════
def step_create():
    st.title("🚀 Crear campaña")
    st.caption("Paso 9 de 9")

    if st.session_state.done:
        _show_results()
        return

    st.markdown("Se creará todo como **PAUSED** (borrador). La activas cuando quieras.")
    st.markdown("---")

    _, col_btn, _ = st.columns([1, 2, 1])
    with col_btn:
        if st.button("🚀 Crear campaña ahora", type="primary", use_container_width=True):
            _run_creation()

    st.markdown("---")
    if st.button("← Volver a revisar"):
        st.session_state.step -= 1
        st.rerun()


def _run_creation():
    token      = st.session_state.token
    account_id = st.session_state.account_id
    page_id    = st.session_state.page_id

    bar    = st.progress(0.0)
    status = st.empty()
    res    = {"campaign_id": None, "adset_id": None, "creatives": [], "ads": [], "errors": []}

    # 1 — Campaign
    status.info("**1/5** · Creando campaña...")
    r = api_post(token, f"{account_id}/campaigns", {
        "name": st.session_state.campaign_name,
        "objective": st.session_state.objective,
        "status": "PAUSED",
        "special_ad_categories": [],
    })
    if "error" in r:
        status.error(f"Error: {r['error']['message']}")
        return
    res["campaign_id"] = r["id"]
    bar.progress(0.15)

    # 2 — Ad Set
    status.info("**2/5** · Creando audiencia...")
    opt_goal = OPTIMIZATION_MAP.get(st.session_state.objective, "REACH")
    adset_payload = {
        "name":              f"{st.session_state.city_name.split(',')[0]} | {st.session_state.age_min}-{st.session_state.age_max}",
        "campaign_id":       res["campaign_id"],
        "daily_budget":      st.session_state.daily_budget,
        "billing_event":     "IMPRESSIONS",
        "optimization_goal": opt_goal,
        "status":            "PAUSED",
        "targeting": {
            "age_min": st.session_state.age_min,
            "age_max": st.session_state.age_max,
            "geo_locations": {
                "cities": [{"key": str(st.session_state.city_key), "radius": st.session_state.city_radius, "distance_unit": "kilometer"}]
            },
            "publisher_platforms":  ["facebook", "instagram"],
            "targeting_automation": {"advantage_audience": 0},
        },
    }
    if st.session_state.interests:
        adset_payload["targeting"]["flexible_spec"] = [{"interests": [{"id": i["id"], "name": i["name"]} for i in st.session_state.interests]}]
    if opt_goal == "CONVERSATIONS":
        adset_payload["bid_amount"] = st.session_state.bid_amount

    r = api_post(token, f"{account_id}/adsets", adset_payload)
    if "error" in r:
        status.error(f"Error: {r['error']['message']}")
        return
    res["adset_id"] = r["id"]
    bar.progress(0.35)

    # 3 — Creatives
    link_url = f"https://www.facebook.com/{page_id}"
    for i, ad in enumerate(st.session_state.ads_copy):
        status.info(f"**3/5** · Creativo {ad['label']}...")
        media   = st.session_state.media[i]
        spec    = None
        cta_val = {"app_destination": "WHATSAPP"} if ad["cta"] == "WHATSAPP_MESSAGE" else {}
        cta_blk = {"type": ad["cta"], **({"value": cta_val} if cta_val else {})}

        if media.get("bytes"):
            if media["type"] == "image":
                img_hash = media.get("meta_hash")
                if not img_hash:
                    try:
                        img_hash = upload_image(token, account_id, media["bytes"])
                        st.session_state.media[i]["meta_hash"] = img_hash
                    except RuntimeError as e:
                        res["errors"].append(f"Imagen {ad['label']}: {e}")
                        continue
                if img_hash:
                    spec = {"page_id": page_id, "link_data": {"message": ad["body"], "name": ad["headline"], "description": ad["description"], "link": link_url, "image_hash": img_hash, "call_to_action": cta_blk}}
            elif media["type"] == "video":
                vid_id = media.get("meta_video_id")
                if not vid_id:
                    status.info(f"**3/5** · Subiendo video {ad['label']}... (puede tardar)")
                    try:
                        vid_id = upload_video(token, account_id, media["bytes"], media["name"])
                        st.session_state.media[i]["meta_video_id"] = vid_id
                    except RuntimeError as e:
                        res["errors"].append(f"Video {ad['label']}: {e}")
                        continue
                if vid_id:
                    spec = {"page_id": page_id, "video_data": {"video_id": vid_id, "message": ad["body"], "title": ad["headline"], "call_to_action": cta_blk}}

        if not spec:
            spec = text_only_spec(page_id, ad, link_url)

        r = api_post(token, f"{account_id}/adcreatives", {"name": f"Creative | {ad['label']}", "object_story_spec": spec})
        if "error" in r:
            msg = r["error"].get("error_user_msg") or r["error"].get("message", "")
            res["errors"].append(f"Creativo {ad['label']}: {msg}")
            res["creatives"].append(None)
        else:
            res["creatives"].append(r["id"])

    bar.progress(0.65)

    # 4 — Ads
    status.info("**4/5** · Creando anuncios...")
    for creative_id, ad in zip(res["creatives"], st.session_state.ads_copy):
        if not creative_id:
            res["ads"].append(None)
            continue
        r = api_post(token, f"{account_id}/ads", {"name": f"Ad | {ad['label']}", "adset_id": res["adset_id"], "creative": {"creative_id": creative_id}, "status": "PAUSED"})
        if "error" in r:
            msg = r["error"].get("error_user_msg") or r["error"].get("message", "")
            res["errors"].append(f"Ad {ad['label']}: {msg}")
            res["ads"].append(None)
        else:
            res["ads"].append(r["id"])

    bar.progress(0.85)

    # 5 — Manifest
    status.info("**5/5** · Guardando manifiesto...")
    manifest = {
        "created_at": datetime.now().isoformat(),
        "status":     "DRAFT_COMPLETE",
        "campaign":   {"id": res["campaign_id"], "name": st.session_state.campaign_name, "objective": st.session_state.objective, "status": "PAUSED"},
        "adset":      {"id": res["adset_id"], "city": st.session_state.city_name, "age": f"{st.session_state.age_min}-{st.session_state.age_max}", "daily_budget_usd": st.session_state.daily_budget / 100},
        "ads":        [{"label": ad["label"], "ad_id": res["ads"][i] if i < len(res["ads"]) else None, "creative_id": res["creatives"][i] if i < len(res["creatives"]) else None, "headline": ad["headline"], "body": ad["body"]} for i, ad in enumerate(st.session_state.ads_copy)],
        "errors":     res["errors"],
        "review_url": f"https://adsmanager.facebook.com/adsmanager/manage/ads?act={account_id}",
    }
    (Path(__file__).parent / f"manifest_{res['campaign_id']}.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2))

    bar.progress(1.0)
    status.success("✅ ¡Campaña creada!")

    st.session_state.done             = True
    st.session_state.result_campaign  = res["campaign_id"]
    st.session_state.result_adset     = res["adset_id"]
    st.session_state.result_creatives = res["creatives"]
    st.session_state.result_ads       = res["ads"]
    st.session_state.result_errors    = res["errors"]
    st.session_state.result_manifest  = manifest
    st.rerun()


def _show_results():
    campaign_id = st.session_state.result_campaign
    account_id  = st.session_state.account_id

    st.success("### ✅ Campaña creada como borrador (PAUSED)")

    rows = [
        f"| Campaña | `{campaign_id}` |",
        f"| Ad Set  | `{st.session_state.result_adset}` |",
    ] + [
        f"| Ad {st.session_state.ads_copy[i]['label']} | `{st.session_state.result_ads[i] if i < len(st.session_state.result_ads) else 'error'}` |"
        for i in range(3)
    ]
    st.markdown("| Elemento | ID |\n|---|---|")
    for row in rows:
        st.markdown(row)

    if st.session_state.result_errors:
        with st.expander("⚠️ Errores"):
            for e in st.session_state.result_errors:
                st.error(e)

    c1, c2 = st.columns(2)
    with c1:
        st.link_button("🔗 Abrir Meta Ads Manager", f"https://adsmanager.facebook.com/adsmanager/manage/ads?act={account_id}", use_container_width=True)
    with c2:
        if st.session_state.result_manifest:
            st.download_button("⬇️ Descargar manifiesto JSON", data=json.dumps(st.session_state.result_manifest, ensure_ascii=False, indent=2), file_name=f"manifest_{campaign_id}.json", mime="application/json", use_container_width=True)

    st.divider()
    st.markdown("### Próximos pasos")
    st.markdown("""
1. Abre Ads Manager → agrega video/imagen en los ads que no tienen creativo
2. Revisa preview en móvil de cada anuncio
3. Activa el toggle de la **campaña** cuando estés listo
4. Monitorea los primeros 3 días: CTR > 1.5%, costo/mensaje < $3

💡 Pídele al asistente Claude qué optimizar una vez el anuncio esté corriendo.
    """)

    st.divider()
    if st.button("🔄 Crear otra campaña", use_container_width=True):
        keys_to_keep = {"_user", "_draft_id", "app_mode",
                        "dash_accounts", "dash_pages", "dash_selected_account",
                        "dash_selected_page", "dashboard_preset"}
        for k in list(st.session_state.keys()):
            if k not in keys_to_keep:
                del st.session_state[k]
        st.session_state["_draft_id"] = None
        st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# ANALYTICS PAGE
# ══════════════════════════════════════════════════════════════════════════════

def _analytics_compute_derived(insight):
    """Derive CPM, CPC, CPR, frequency from a raw insight dict."""
    if not insight:
        return {}
    spend       = float(insight.get("spend", 0) or 0)
    impressions = int(float(insight.get("impressions", 0) or 0))
    clicks      = int(float(insight.get("clicks", 0) or 0))
    reach       = int(float(insight.get("reach", 0) or 0))
    convs       = _dash_extract_conversations(insight.get("actions", []))
    ctr         = float(insight.get("ctr", 0) or 0)
    cpm         = (spend / impressions * 1000) if impressions > 0 else 0
    cpc         = (spend / clicks) if clicks > 0 else 0
    cpr         = (spend / convs) if convs > 0 else 0
    freq        = (impressions / reach) if reach > 0 else 0
    return {
        "spend": spend, "impressions": impressions, "clicks": clicks,
        "reach": reach, "conversations": convs, "ctr": ctr,
        "cpm": cpm, "cpc": cpc, "cpr": cpr, "frequency": freq,
    }


def _analytics_ai_analysis(campaigns_data, brand_brief, date_label):
    """Claude/GPT analysis of campaign performance."""
    prompt = f"""Eres un experto en Meta Ads. Analiza el rendimiento de las siguientes campañas del período: {date_label}.

DATOS DE CAMPAÑAS:
{json.dumps(campaigns_data, ensure_ascii=False, indent=2)}

MARCA: {brand_brief or 'No especificada'}

Entrega un análisis ejecutivo con EXACTAMENTE esta estructura:

## Diagnóstico Rápido
[2-3 bullets con lo más importante — positivo y negativo, con cifras reales]

## Campaña Destacada
[La que mejor rinde y por qué, con métricas concretas]

## Alerta
[La campaña o métrica más preocupante y por qué]

## Recomendaciones (Semana Próxima)
1. [Acción concreta con número específico]
2. [Acción concreta con número específico]
3. [Acción concreta con número específico]

## Oportunidad
[Una cosa que podrías probar ahora mismo para mejorar resultados]

Sé directo, usa cifras reales de los datos, máximo 350 palabras. Español latinoamericano."""
    return ai_chat_completion(
        "Eres un analista senior de performance en Meta Ads. Das diagnósticos precisos y accionables.",
        [{"role": "user", "content": prompt}],
        max_tokens=800,
    )


def _analytics_invalidate_cache():
    for k in [k for k in st.session_state if k.startswith("analytics_")]:
        del st.session_state[k]


def page_analytics():
    """Analytics page — deep performance analysis with AI insights."""
    import pandas as pd

    token = st.session_state.get("token", "")
    if not token:
        st.warning("⚠️ Primero conecta tu cuenta Meta en el Paso 1 del wizard.")
        return

    col_title, col_btn = st.columns([6, 1])
    with col_title:
        st.title("📈 Análisis de Campañas")
        st.caption("Performance, métricas derivadas y recomendaciones IA — actualizado al día de hoy")
    with col_btn:
        st.write("")
        if st.button("🔄 Actualizar", use_container_width=True, key="analytics_refresh"):
            _analytics_invalidate_cache()
            st.rerun()

    # ── Account selector ──────────────────────────────────────────────────────
    if "dash_accounts" not in st.session_state:
        with st.spinner("Cargando cuentas..."):
            accounts, pages = _dash_fetch_accounts(token)
            st.session_state["dash_accounts"] = accounts
            st.session_state["dash_pages"]    = pages

    accounts   = st.session_state.get("dash_accounts", [])
    account_id = st.session_state.get("dash_selected_account") or st.session_state.get("account_id", "")

    if not accounts:
        st.error("No se encontraron cuentas publicitarias para este token.")
        _show_token_error_help()
        return

    STATUS_LABELS = {1: "✅ Activa", 2: "⚠️ Deshabilitada", 7: "🔒 Cerrada", 9: "⚠️ Revisión"}
    account_labels = {
        a["id"]: f"{a['name']}  ·  {STATUS_LABELS.get(a.get('account_status'), '—')}"
        for a in accounts
    }
    default_idx = next((i for i, a in enumerate(accounts) if a["id"] == account_id), 0)
    selected_account = st.selectbox(
        "🏢 Cuenta publicitaria",
        options=[a["id"] for a in accounts],
        format_func=lambda x: account_labels.get(x, x),
        index=default_idx,
        key="analytics_account_select",
    )
    if selected_account != st.session_state.get("dash_selected_account"):
        st.session_state["dash_selected_account"] = selected_account
        _analytics_invalidate_cache()
        st.rerun()
    account_id = selected_account

    st.divider()

    # ── Filters ───────────────────────────────────────────────────────────────
    filter_col1, filter_col2 = st.columns([3, 2])
    with filter_col1:
        preset_map = {
            "Hoy":             "today",
            "Ayer":            "yesterday",
            "Últimos 7 días":  "last_7d",
            "Últimos 30 días": "last_30d",
            "Últimos 90 días": "last_90d",
        }
        selected_period = st.radio(
            "Período", list(preset_map.keys()), index=3,
            horizontal=True, key="analytics_period",
        )
        date_preset = preset_map[selected_period]
    with filter_col2:
        status_filter = st.selectbox(
            "Estado de campañas",
            ["Activas y Pausadas", "Solo Activas", "Solo Pausadas"],
            key="analytics_status_filter",
        )

    # Invalidate if period changed
    if st.session_state.get("analytics_last_preset") != date_preset:
        for k in [k for k in st.session_state if k.startswith("analytics_data_")]:
            del st.session_state[k]
        st.session_state["analytics_last_preset"] = date_preset

    # ── Fetch campaigns + insights ────────────────────────────────────────────
    cache_key = f"analytics_data_{account_id}_{date_preset}"
    if cache_key not in st.session_state:
        with st.spinner(f"Cargando campañas y métricas — {selected_period}..."):
            raw = api_get(token, account_id + "/campaigns", {
                "fields": "id,name,status,objective,created_time,daily_budget,lifetime_budget",
                "limit": 20,
            })
            if raw.get("error"):
                err = raw["error"]
                msg = err.get("message", str(err)) if isinstance(err, dict) else str(err)
                st.error(f"Error Meta API: {msg}")
                if "expired" in msg.lower() or "Session has expired" in msg:
                    _show_token_error_help()
                return

            all_camps = raw.get("data", [])
            result = []
            for c in all_camps:
                ins_resp = api_get(token, c["id"] + "/insights", {
                    "fields": "impressions,reach,clicks,ctr,spend,actions,frequency",
                    "date_preset": date_preset,
                })
                insight = (ins_resp.get("data") or [None])[0]
                derived = _analytics_compute_derived(insight)
                as_resp = api_get(token, c["id"] + "/adsets", {
                    "fields": "id,name,status,daily_budget,optimization_goal",
                    "limit": 5,
                })
                adsets = as_resp.get("data", [])
                result.append({
                    "id":           c["id"],
                    "name":         c["name"],
                    "status":       c.get("status"),
                    "objective":    c.get("objective", ""),
                    "created_time": c.get("created_time", ""),
                    "daily_budget": adsets[0].get("daily_budget") if adsets else c.get("daily_budget"),
                    "insight":      insight,
                    "metrics":      derived,
                    "adsets":       adsets,
                    "adset_id":     adsets[0].get("id") if adsets else None,
                })
            st.session_state[cache_key] = result

    all_campaigns = st.session_state.get(cache_key, [])

    # Apply status filter
    if status_filter == "Solo Activas":
        campaigns = [c for c in all_campaigns if c["status"] == "ACTIVE"]
    elif status_filter == "Solo Pausadas":
        campaigns = [c for c in all_campaigns if c["status"] == "PAUSED"]
    else:
        campaigns = all_campaigns

    if not campaigns:
        st.info("No hay campañas para el filtro seleccionado.")
        return

    # ── KPI Totals ────────────────────────────────────────────────────────────
    total_spend  = sum(c["metrics"].get("spend", 0) for c in campaigns)
    total_reach  = sum(c["metrics"].get("reach", 0) for c in campaigns)
    total_convs  = sum(c["metrics"].get("conversations", 0) for c in campaigns)
    total_clicks = sum(c["metrics"].get("clicks", 0) for c in campaigns)
    total_imps   = sum(c["metrics"].get("impressions", 0) for c in campaigns)
    avg_ctr      = (total_clicks / total_imps * 100) if total_imps > 0 else 0
    avg_cpr      = (total_spend / total_convs) if total_convs > 0 else 0
    avg_cpm      = (total_spend / total_imps * 1000) if total_imps > 0 else 0
    active_count = sum(1 for c in campaigns if c["status"] == "ACTIVE")

    st.markdown(f"### Resumen — {selected_period} · {len(campaigns)} campañas ({active_count} activas)")
    k1, k2, k3, k4, k5, k6 = st.columns(6)
    with k1: st.metric("💰 Gasto Total",    _dash_fmt_currency(total_spend))
    with k2: st.metric("👥 Alcance",        _dash_fmt_number(total_reach))
    with k3: st.metric("💬 Conversaciones", _dash_fmt_number(total_convs))
    with k4: st.metric("🖱️ CTR Promedio",   _dash_fmt_pct(avg_ctr))
    with k5: st.metric("📊 CPM Promedio",   _dash_fmt_currency(avg_cpm))
    with k6: st.metric("💬 Costo/Conv",     _dash_fmt_currency(avg_cpr) if avg_cpr > 0 else "—")

    st.divider()

    # ── AI Analysis ───────────────────────────────────────────────────────────
    st.markdown("### 🤖 Análisis IA")
    if not has_ai():
        st.info("Agrega `ANTHROPIC_API_KEY` o `OPENIA_API_KEY` en tu `.env` para activar el análisis IA.")
    else:
        ai_cache_key = f"analytics_ai_{account_id}_{date_preset}_{status_filter}"
        col_ai, col_clr = st.columns([3, 1])
        with col_ai:
            if st.button("🧠 Generar análisis con IA", use_container_width=True,
                         type="primary", key="analytics_ai_btn"):
                summary = []
                for c in campaigns:
                    m = c["metrics"]
                    summary.append({
                        "nombre":            c["name"],
                        "estado":            c["status"],
                        "objetivo":          c["objective"],
                        "gasto_usd":         round(m.get("spend", 0), 2),
                        "alcance":           m.get("reach", 0),
                        "impresiones":       m.get("impressions", 0),
                        "clics":             m.get("clicks", 0),
                        "ctr_pct":           round(m.get("ctr", 0), 2),
                        "cpm_usd":           round(m.get("cpm", 0), 2),
                        "cpc_usd":           round(m.get("cpc", 0), 2),
                        "conversaciones":    m.get("conversations", 0),
                        "costo_conv_usd":    round(m.get("cpr", 0), 2) if m.get("cpr", 0) > 0 else None,
                        "frecuencia":        round(m.get("frequency", 0), 2),
                        "presupuesto_diario": round(int(c.get("daily_budget") or 0) / 100, 2),
                    })
                with st.spinner("Analizando campañas con IA..."):
                    analysis = _analytics_ai_analysis(
                        summary,
                        st.session_state.get("brand_brief", ""),
                        selected_period,
                    )
                st.session_state[ai_cache_key] = analysis
        with col_clr:
            if st.session_state.get(ai_cache_key):
                if st.button("🗑 Limpiar", use_container_width=True, key="analytics_ai_clear"):
                    del st.session_state[ai_cache_key]
                    st.rerun()

        if ai_cache_key in st.session_state:
            with st.container(border=True):
                st.markdown(st.session_state[ai_cache_key])

    st.divider()

    # ── Comparison Table ──────────────────────────────────────────────────────
    st.markdown("### Comparativa de campañas")
    table_rows = []
    for c in campaigns:
        m = c["metrics"]
        table_rows.append({
            "Campaña":          c["name"],
            "Estado":           "🟢 ACTIVA" if c["status"] == "ACTIVE" else "🟡 PAUSADA",
            "Gasto ($)":        round(m.get("spend", 0), 2),
            "Alcance":          m.get("reach", 0),
            "Impresiones":      m.get("impressions", 0),
            "CTR (%)":          round(m.get("ctr", 0), 2),
            "CPM ($)":          round(m.get("cpm", 0), 2),
            "CPC ($)":          round(m.get("cpc", 0), 2),
            "Conversaciones":   m.get("conversations", 0),
            "Costo/Conv ($)":   round(m.get("cpr", 0), 2) if m.get("cpr", 0) > 0 else 0,
            "Frecuencia":       round(m.get("frequency", 0), 2),
        })
    if table_rows:
        df = pd.DataFrame(table_rows)
        st.dataframe(df, use_container_width=True, hide_index=True)
        col_dl, _ = st.columns([1, 4])
        with col_dl:
            csv = df.to_csv(index=False).encode("utf-8")
            st.download_button(
                "⬇️ Exportar CSV", csv,
                file_name=f"campanas_{date_preset}.csv",
                mime="text/csv",
                use_container_width=True,
            )

    st.divider()

    # ── Per-campaign drilldown ────────────────────────────────────────────────
    st.markdown("### Detalle por campaña")
    for camp in campaigns:
        m = camp["metrics"]
        icon = "🟢" if camp["status"] == "ACTIVE" else "🟡"
        budget_str = _dash_fmt_currency(int(camp.get("daily_budget") or 0) / 100) + "/día"
        with st.expander(f"{icon} **{camp['name']}**  ·  {_dash_fmt_currency(m.get('spend', 0))} gastados  ·  {budget_str}"):
            d1, d2, d3, d4 = st.columns(4)
            with d1:
                st.metric("Alcance",     _dash_fmt_number(m.get("reach", 0)))
                st.metric("Impresiones", _dash_fmt_number(m.get("impressions", 0)))
                st.metric("Frecuencia",  f"{m.get('frequency', 0):.2f}x")
            with d2:
                st.metric("Clics",   _dash_fmt_number(m.get("clicks", 0)))
                st.metric("CTR",     _dash_fmt_pct(m.get("ctr", 0)))
            with d3:
                st.metric("CPM", _dash_fmt_currency(m.get("cpm", 0)))
                st.metric("CPC", _dash_fmt_currency(m.get("cpc", 0)))
            with d4:
                st.metric("Conversaciones", _dash_fmt_number(m.get("conversations", 0)))
                st.metric("Costo/Conv",
                           _dash_fmt_currency(m.get("cpr", 0)) if m.get("cpr", 0) > 0 else "—")

            st.caption(f"Objetivo: **{camp.get('objective', '—')}**  ·  ID: `{camp['id']}`")

            if camp.get("adsets"):
                st.markdown("**Conjuntos de anuncios:**")
                for adset in camp["adsets"]:
                    s_icon  = "🟢" if adset.get("status") == "ACTIVE" else "🟡"
                    b_str   = _dash_fmt_currency(int(adset.get("daily_budget", 0)) / 100) + "/día" \
                              if adset.get("daily_budget") else "—"
                    st.caption(
                        f"{s_icon} {adset['name']}  ·  {b_str}  ·  {adset.get('optimization_goal', '')}"
                    )

            st.markdown("**Controles rápidos:**")
            render_campaign_controls(camp)


def _show_token_error_help():
    with st.expander("🔑 ¿Cómo renovar el token?"):
        st.markdown("""
1. Ve a **[developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)**
2. Selecciona tu app → **Generate Access Token**
3. Permisos necesarios: `ads_management`, `ads_read`, `pages_manage_ads`
4. Copia el token y pégalo en **Paso 1 → Conectar**
5. Vuelve a esta página — las métricas se cargarán automáticamente

> Los tokens de usuario de corta duración expiran en ~1 hora.
> Para evitar expirar constantemente, convierte el token a largo plazo (60 días) en la **[API de Facebook](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived)**.
        """)


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

# ── Auth check ─────────────────────────────────────────────────────────────────
if not check_auth():
    page_login()
    st.stop()

# ── Sidebar with user info + logout ───────────────────────────────────────────
user = get_current_user()
with st.sidebar:
    st.divider()
    st.caption(f"👤 **{user.get('name','')}**  ·  {user.get('email','')}")
    if st.button("🚪 Cerrar sesión", use_container_width=True):
        delete_session(get_session_token())
        clear_session_token()
        for k in list(st.session_state.keys()):
            del st.session_state[k]
        st.rerun()

render_sidebar()

# ── Top navigation ─────────────────────────────────────────────────────────────
mode = st.session_state.get("app_mode", "wizard")
nav_col1, nav_col2, nav_col3, nav_col4 = st.columns(4)
with nav_col1:
    if st.button("🎯 Crear Campaña", use_container_width=True,
                 type="primary" if mode == "wizard" else "secondary",
                 key="nav_wizard"):
        st.session_state["app_mode"] = "wizard"
        st.rerun()
with nav_col2:
    if st.button("📊 Mis Campañas", use_container_width=True,
                 type="primary" if mode == "dashboard" else "secondary",
                 key="nav_dashboard"):
        st.session_state["app_mode"] = "dashboard"
        st.rerun()
with nav_col3:
    if st.button("📈 Análisis", use_container_width=True,
                 type="primary" if mode == "analytics" else "secondary",
                 key="nav_analytics"):
        st.session_state["app_mode"] = "analytics"
        st.rerun()
with nav_col4:
    if st.button("📁 Borradores", use_container_width=True,
                 type="primary" if mode == "drafts" else "secondary",
                 key="nav_drafts"):
        st.session_state["app_mode"] = "drafts"
        st.rerun()

st.markdown("---")

# ── Route ─────────────────────────────────────────────────────────────────────
if mode == "dashboard":
    page_dashboard()
elif mode == "analytics":
    page_analytics()
elif mode == "drafts":
    page_drafts()
else:
    render_progress()
    STEP_FNS = {
        1: step_connect,
        2: step_strategy,
        3: step_campaign,
        4: step_audience,
        5: step_budget,
        6: step_creatives,
        7: step_copy,
        8: step_review,
        9: step_create,
    }
    STEP_FNS.get(st.session_state.step, step_connect)()
