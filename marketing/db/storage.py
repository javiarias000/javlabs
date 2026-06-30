import json
from db.database import get_conn

# Keys saved in wizard draft (bytes excluded — media re-uploaded by user)
DRAFT_STATE_KEYS = [
    "step", "campaign_name", "objective",
    "city_name", "city_key", "city_radius",
    "age_min", "age_max", "interests",
    "daily_budget", "bid_amount",
    "ads_copy",
    "brand_brief", "brand_profile", "profile_ready",
    "account_id", "account_name", "page_id", "page_name",
    "chat_intake", "pending_copy_suggestion",
]


def _dumps(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, default=str)


def _loads(s: str):
    try:
        return json.loads(s or "{}")
    except Exception:
        return {}


# ── Meta connections ───────────────────────────────────────────────────────────

def save_meta_connection(user_id, account_id, account_name, page_id, page_name, access_token):
    conn = get_conn()
    conn.execute(
        """INSERT INTO meta_connections
               (user_id, account_id, account_name, page_id, page_name, access_token, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
           ON CONFLICT(user_id) DO UPDATE SET
               account_id=excluded.account_id, account_name=excluded.account_name,
               page_id=excluded.page_id, page_name=excluded.page_name,
               access_token=excluded.access_token, updated_at=excluded.updated_at""",
        (user_id, account_id, account_name, page_id, page_name, access_token),
    )
    conn.commit()
    conn.close()


def load_meta_connection(user_id) -> dict | None:
    conn = get_conn()
    row  = conn.execute(
        "SELECT * FROM meta_connections WHERE user_id = ?", (user_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ── Wizard drafts ──────────────────────────────────────────────────────────────

def _extract_draft_state(ss) -> dict:
    """Extract serializable wizard state from session_state."""
    state = {}
    for key in DRAFT_STATE_KEYS:
        if key in ss:
            state[key] = ss[key]
    # Save media metadata only (no bytes)
    media_meta = []
    for m in ss.get("media", [{}, {}, {}]):
        media_meta.append({
            "name":          m.get("name", ""),
            "type":          m.get("type"),
            "meta_hash":     m.get("meta_hash"),
            "meta_video_id": m.get("meta_video_id"),
        })
    state["media_meta"] = media_meta
    return state


def save_wizard_draft(user_id: int, ss, draft_id=None, name: str = None) -> int:
    state     = _extract_draft_state(ss)
    step      = state.get("step", 1)
    camp_name = state.get("campaign_name", "")
    draft_name = name or (camp_name if camp_name else "Borrador")

    conn = get_conn()
    if draft_id:
        conn.execute(
            """UPDATE wizard_drafts
               SET state_json=?, step=?, name=?, updated_at=datetime('now')
               WHERE id=? AND user_id=?""",
            (_dumps(state), step, draft_name, draft_id, user_id),
        )
    else:
        cur = conn.execute(
            "INSERT INTO wizard_drafts (user_id, name, step, state_json) VALUES (?,?,?,?)",
            (user_id, draft_name, step, _dumps(state)),
        )
        draft_id = cur.lastrowid
    conn.commit()
    conn.close()
    return draft_id


def load_wizard_draft(draft_id: int, user_id: int) -> dict | None:
    conn = get_conn()
    row  = conn.execute(
        "SELECT * FROM wizard_drafts WHERE id=? AND user_id=?", (draft_id, user_id)
    ).fetchone()
    conn.close()
    if not row:
        return None
    r         = dict(row)
    r["state"] = _loads(r.get("state_json"))
    return r


def list_wizard_drafts(user_id: int) -> list:
    conn = get_conn()
    rows = conn.execute(
        """SELECT id, name, step, status, created_at, updated_at
           FROM wizard_drafts WHERE user_id=? ORDER BY updated_at DESC""",
        (user_id,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def delete_wizard_draft(draft_id: int, user_id: int):
    conn = get_conn()
    conn.execute("DELETE FROM wizard_drafts WHERE id=? AND user_id=?", (draft_id, user_id))
    conn.commit()
    conn.close()


def rename_wizard_draft(draft_id: int, user_id: int, new_name: str):
    conn = get_conn()
    conn.execute(
        "UPDATE wizard_drafts SET name=? WHERE id=? AND user_id=?",
        (new_name, draft_id, user_id),
    )
    conn.commit()
    conn.close()


def mark_draft_created(draft_id: int, user_id: int):
    conn = get_conn()
    conn.execute(
        "UPDATE wizard_drafts SET status='created', updated_at=datetime('now') WHERE id=? AND user_id=?",
        (draft_id, user_id),
    )
    conn.commit()
    conn.close()


# ── Business profiles ──────────────────────────────────────────────────────────

def save_business_profile(user_id: int, profile: dict, brand_brief: str, chat_history: list):
    conn = get_conn()
    conn.execute(
        """INSERT INTO business_profiles
               (user_id, profile_json, brand_brief, chat_history_json, updated_at)
           VALUES (?,?,?,?,datetime('now'))
           ON CONFLICT(user_id) DO UPDATE SET
               profile_json=excluded.profile_json, brand_brief=excluded.brand_brief,
               chat_history_json=excluded.chat_history_json, updated_at=excluded.updated_at""",
        (user_id, _dumps(profile), brand_brief, _dumps(chat_history)),
    )
    conn.commit()
    conn.close()


def load_business_profile(user_id: int) -> dict | None:
    conn = get_conn()
    row  = conn.execute(
        "SELECT * FROM business_profiles WHERE user_id=?", (user_id,)
    ).fetchone()
    conn.close()
    if not row:
        return None
    r                = dict(row)
    r["profile"]     = _loads(r.get("profile_json"))
    r["chat_history"] = json.loads(r.get("chat_history_json") or "[]")
    return r
