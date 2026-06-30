STRATEGY_PROMPT = """
Eres experto en publicidad digital. Analiza el contexto de la empresa y los datos de rendimiento,
luego genera una estrategia de campaña detallada para Meta Ads.

DATOS DE LA CUENTA:
- Gasto actual (últimos 30 días): ${spend}
- CTR promedio: {ctr}%
- CPC promedio: ${cpc}
- ROAS promedio: {roas}x
- CPA promedio: ${cpa}
- Conversiones: {conversions}

SOBRE LA EMPRESA:
{company_description}

OBJETIVO DE CAMPAÑA:
- Tipo: {objective}
- Presupuesto total: ${budget}
- Presupuesto diario: ${daily_budget}

Genera una estrategia JSON con este formato (sin markdown, JSON puro):
{{
  "campaign_name": "Nombre descriptivo de campaña",
  "audience": {{
    "age_min": 18,
    "age_max": 65,
    "interests": ["interés1", "interés2", "interés3"],
    "languages": ["es"],
    "countries": ["AR"],
    "exclude_audiences": ["competidores"]
  }},
  "ad_copy": {{
    "headline": "Titular principal",
    "description": "Descripción del anuncio",
    "call_to_action": "LEARN_MORE",
    "landing_url": "https://ejemplo.com/promo"
  }},
  "reasoning": "Explicación breve de por qué esta estrategia funcionará"
}}

Basa tu estrategia en los datos de rendimiento. Si ROAS es alto, aumenta presupuesto en audiencias similares.
Si CPA es alto, refina audiencia. Si CTR es bajo, mejora copy.
"""
