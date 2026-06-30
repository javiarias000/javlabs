import streamlit as st
import base64
from io import BytesIO
from PIL import Image

from gui_config import validate_gui_config, OPENAI_API_KEY, PAGE_ID
from openai_helper import improve_ad_copy, analyze_image_only, analyze_image_and_product, refine_ad_copy_with_chat
from meta.client import init_api
from meta.campaign import upload_image, create_full_campaign
from models.campaign_plan import CampaignPlan, Audience
from facebook_business.adobjects.campaign import Campaign
from facebook_business.adobjects.ad import Ad

# Configurar página
st.set_page_config(page_title="Meta Ads Creator", layout="wide", initial_sidebar_state="expanded")

# Validar configuración
try:
    validate_gui_config()
    init_api()
except Exception as e:
    st.error(f"❌ Error de configuración: {e}")
    st.stop()

# Mapeo de países a códigos ISO2
COUNTRIES_MAP = {
    "Ecuador": "EC",
    "USA": "US",
    "Colombia": "CO",
    "Perú": "PE",
    "Chile": "CL",
    "Argentina": "AR",
    "Brasil": "BR",
    "México": "MX",
    "España": "ES",
    "Latinoamérica (todos)": ["EC", "CO", "PE", "CL", "AR", "BR", "MX", "BO", "PY", "UY", "VE"],
}

# Estado Streamlit
if "image_uploaded" not in st.session_state:
    st.session_state.image_uploaded = None
if "image_hash" not in st.session_state:
    st.session_state.image_hash = None
if "product_description_filled" not in st.session_state:
    st.session_state.product_description_filled = ""
if "headline_filled" not in st.session_state:
    st.session_state.headline_filled = ""
if "body_filled" not in st.session_state:
    st.session_state.body_filled = ""
if "cta_filled" not in st.session_state:
    st.session_state.cta_filled = "LEARN_MORE"
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Título
st.title("🎯 Meta Ads Creator — MI IDEA")
st.markdown("Crea campañas publicitarias en Meta Ads con IA. Mejora tu texto con OpenAI y previsualiza tu anuncio.")

# Layout: 2 columnas
col1, col2 = st.columns([1.2, 1])

# COLUMNA IZQUIERDA: FORMULARIO
with col1:
    st.header("📝 Crear Anuncio")

    # Sección: Imagen
    st.subheader("📷 Imagen del Anuncio")
    uploaded_image = st.file_uploader("Selecciona una imagen (JPG, PNG)", type=["jpg", "jpeg", "png"], key="image_uploader")

    if uploaded_image:
        # Detectar si es una imagen nueva
        new_image_bytes = uploaded_image.getvalue()
        image_changed = (st.session_state.image_uploaded != new_image_bytes)

        if image_changed:
            st.session_state.image_uploaded = new_image_bytes

            # Analizar automáticamente
            with st.spinner("🤖 Analizando imagen con IA Vision..."):
                try:
                    analysis = analyze_image_only(st.session_state.image_uploaded)

                    # Llenar automáticamente todos los campos
                    st.session_state.product_description_filled = analysis.get("product_description", "")
                    st.session_state.headline_filled = analysis.get("headline", "")
                    st.session_state.body_filled = analysis.get("body", "")
                    st.session_state.cta_filled = analysis.get("cta", "LEARN_MORE")

                    # Mostrar análisis
                    st.success("✓ Imagen analizada - Campos llenados automáticamente")
                    with st.expander("📊 Análisis detectado"):
                        st.markdown(f"""
                        - **Servicio:** {analysis.get('product_name', 'N/A')}
                        - **Descripción:** {analysis.get('product_description', 'N/A')}
                        - **Titular:** {analysis.get('headline', 'N/A')}
                        """)
                except Exception as e:
                    st.error(f"❌ Error analizando imagen: {e}")
                    st.info("Puedes editar los campos manualmente")

        # Mostrar imagen
        img = Image.open(BytesIO(st.session_state.image_uploaded))
        st.image(img, caption="Imagen subida")

    # Sección: Descripción del producto (solo lectura/información)
    if st.session_state.product_description_filled:
        st.subheader("📝 Descripción del Servicio")
        st.write(st.session_state.product_description_filled)

    # Sección: Headline (Titular)
    st.subheader("📊 Titular (Headline)")
    headline = st.text_input(
        "Headline",
        value=st.session_state.headline_filled,
        max_chars=40,
        placeholder="Se llenará automáticamente con IA"
    )
    st.caption(f"Caracteres: {len(headline)}/40")

    # Sección: Descripción mejorada (Body)
    st.subheader("📄 Descripción del Anuncio")
    body = st.text_area(
        "Descripción del anuncio",
        value=st.session_state.body_filled,
        height=80,
        max_chars=200,
        placeholder="Se llenará automáticamente con IA"
    )
    st.caption(f"Caracteres: {len(body)}/200")

    # Sección: CTA
    st.subheader("🔗 Llamada a la Acción (CTA)")
    cta_options = {
        "Aprender Más": "LEARN_MORE",
        "Comprar Ahora": "SHOP_NOW",
        "Registrarse": "SIGN_UP",
        "Contactar": "CONTACT_US",
        "Ver Más": "WATCH_MORE",
        "Suscribirse": "SUBSCRIBE",
        "Descargar": "DOWNLOAD",
    }

    default_idx = list(cta_options.values()).index(st.session_state.cta_filled) if st.session_state.cta_filled in cta_options.values() else 0
    cta_display = st.selectbox("Elige CTA", list(cta_options.keys()), index=default_idx)
    cta = cta_options[cta_display]

    # Sección: Chat para refinar
    st.divider()
    st.subheader("💬 Chat: Refinar Anuncio")
    st.markdown("Proporciona feedback para que la IA mejore el anuncio. Ej: *Hazlo más marketero*, *Agrega urgencia*, *Menos formal*")

    # Mostrar historial de chat
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # Input de usuario
    user_feedback = st.chat_input(
        "Proporciona feedback para mejorar el anuncio..."
    )

    if user_feedback:
        if not st.session_state.headline_filled or not st.session_state.body_filled:
            st.warning("⚠️ Primero analiza una imagen o escribe una descripción para generar el anuncio")
        else:
            # Agregar feedback a historial
            st.session_state.chat_history.append({"role": "user", "content": user_feedback})

            # Refinar con IA
            with st.spinner("Refinando anuncio..."):
                try:
                    current_copy = {
                        "headline": st.session_state.headline_filled,
                        "body": st.session_state.body_filled,
                        "cta": st.session_state.cta_filled,
                    }

                    refined = refine_ad_copy_with_chat(current_copy, user_feedback)

                    # Actualizar session_state
                    st.session_state.headline_filled = refined.get("headline", st.session_state.headline_filled)
                    st.session_state.body_filled = refined.get("body", st.session_state.body_filled)
                    st.session_state.cta_filled = refined.get("cta", st.session_state.cta_filled)

                    # Mostrar respuesta IA
                    response_text = f"✅ **Actualizado:**\n\n**Headline:** {refined.get('headline', '')}\n\n**Body:** {refined.get('body', '')}\n\n💡 {refined.get('explanation', '')}"
                    st.session_state.chat_history.append({"role": "assistant", "content": response_text})

                    st.rerun()

                except Exception as e:
                    st.error(f"Error: {e}")
                    st.session_state.chat_history.pop()  # Remover el mensaje del usuario si hubo error

    # Sección: URL de destino
    st.subheader("🌐 URL de Destino")
    landing_url = st.text_input(
        "URL",
        value="https://miidea.site",
        placeholder="https://ejemplo.com"
    )

    # Sección: Targeting geográfico
    st.subheader("🗺️ Targeting Geográfico")
    country_name = st.selectbox("País/Región", list(COUNTRIES_MAP.keys()))
    countries = COUNTRIES_MAP[country_name]
    if isinstance(countries, str):
        countries = [countries]

    # Sección: Targeting por edad
    st.subheader("👥 Rango de Edad")
    age_min, age_max = st.slider(
        "Edad",
        min_value=13,
        max_value=65,
        value=(18, 55),
        step=1
    )

    # Sección: Presupuesto
    st.subheader("💰 Presupuesto")
    col_budget_total, col_budget_daily = st.columns(2)
    with col_budget_total:
        budget_total = st.number_input("Presupuesto Total (USD)", min_value=10.0, value=100.0, step=10.0)
    with col_budget_daily:
        budget_daily = st.number_input("Presupuesto Diario (USD)", min_value=1.0, value=10.0, step=1.0)

    if budget_daily > budget_total:
        st.warning("⚠️ El presupuesto diario no puede ser mayor que el total")

    # Sección: Acciones
    st.divider()
    col_draft, col_publish = st.columns(2)

    with col_draft:
        btn_draft = st.button("💾 Guardar como Borrador", use_container_width=True)

    with col_publish:
        btn_publish = st.button("🚀 Publicar Ahora", use_container_width=True)

    # Procesar creación de campaña
    if btn_draft or btn_publish:
        if not headline or not body or not landing_url:
            st.error("❌ Completa headline, descripción y URL antes de publicar")
        elif budget_daily > budget_total:
            st.error("❌ Presupuesto diario no puede ser mayor que el total")
        else:
            with st.spinner("Creando campaña..."):
                try:
                    # Crear CampaignPlan (sin imagen - se agregará después en Meta Ads Manager)
                    campaign_name = f"MI IDEA - {headline[:30]}"
                    audience = Audience(
                        age_min=age_min,
                        age_max=age_max,
                        interests=[],
                        languages=["es_LA", "es"],
                        countries=countries,
                    )
                    plan = CampaignPlan(
                        campaign_name=campaign_name,
                        objective="OUTCOME_AWARENESS",
                        budget=budget_total,
                        daily_budget=budget_daily,
                        audience=audience,
                        ad_copy=body,
                        headline=headline,
                        description=body,
                        call_to_action=cta,
                        landing_url=landing_url,
                        reasoning="Campaña creada desde GUI",
                    )

                    # Crear campaña con imagen (si la subió)
                    status = Campaign.Status.active if btn_publish else Campaign.Status.paused
                    image_bytes = st.session_state.image_uploaded if st.session_state.image_uploaded else None
                    result = create_full_campaign(plan, image_bytes=image_bytes, status=status)

                    # Mostrar resultado
                    st.success("✓ Campaña creada exitosamente")
                    st.info(f"""
                    **✅ Campaña creada en Meta Ads**

                    **IDs:**
                    - Campaign: `{result['campaign_id']}`
                    - Ad Set: `{result['adset_id']}`
                    - Ad: `{result['ad_id']}`

                    **Estado:** {'🟢 Activo' if btn_publish else '🟡 Borrador (PAUSED)'}

                    **Próximo paso:**
                    1. Ve a [Meta Ads Manager](https://ads.facebook.com)
                    2. Abre tu campaña
                    3. Agrega la imagen en el ad creativo
                    4. ¡Listo para promocionar!
                    """)

                except Exception as e:
                    st.error(f"❌ Error al crear campaña: {e}")
                    st.error(f"Detalle: {str(e)}")

# COLUMNA DERECHA: PREVIEW
with col2:
    st.header("👁️ Vista Previa")
    st.markdown("Cómo se verá tu anuncio en Facebook")

    # Codificar imagen en base64
    image_html = '<div style="width:100%; aspect-ratio:1.2; background:#e9ecef; display:flex; align-items:center; justify-content:center; color:#999;">Sin imagen</div>'
    if st.session_state.image_uploaded:
        image_base64 = base64.b64encode(st.session_state.image_uploaded).decode()
        image_html = f'<img class="fb-ad-image" src="data:image/jpeg;base64,{image_base64}" alt="Anuncio" />'

    # Mapear CTA a texto
    cta_text_map = {
        "LEARN_MORE": "Aprender Más",
        "SHOP_NOW": "Comprar Ahora",
        "SIGN_UP": "Registrarse",
        "CONTACT_US": "Contactar",
        "WATCH_MORE": "Ver Más",
        "SUBSCRIBE": "Suscribirse",
        "DOWNLOAD": "Descargar",
    }
    cta_button_text = cta_text_map.get(cta, cta)

    # CSS para card de anuncio
    preview_html = f"""
    <style>
        .fb-ad-card {{
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            max-width: 100%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .fb-ad-header {{
            padding: 8px 12px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e5e5e5;
            background: white;
        }}
        .fb-ad-avatar {{
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #ccc;
            margin-right: 8px;
        }}
        .fb-ad-meta {{
            flex: 1;
            font-size: 12px;
        }}
        .fb-ad-meta-name {{
            font-weight: 500;
            font-size: 13px;
        }}
        .fb-ad-meta-time {{
            color: #65676b;
        }}
        .fb-ad-options {{
            color: #65676b;
            font-size: 16px;
            cursor: pointer;
        }}
        .fb-ad-content {{
            padding: 0;
            background: white;
        }}
        .fb-ad-image {{
            width: 100%;
            aspect-ratio: 1.2;
            object-fit: cover;
            background: #f0f0f0;
        }}
        .fb-ad-text {{
            padding: 12px;
            font-size: 13px;
            color: #050505;
        }}
        .fb-ad-headline {{
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 14px;
        }}
        .fb-ad-body {{
            color: #65676b;
            line-height: 1.4;
            margin-bottom: 8px;
        }}
        .fb-ad-cta {{
            background: #0a66c2;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            text-align: center;
        }}
        .fb-ad-sponsored {{
            font-size: 11px;
            color: #65676b;
            margin-top: 8px;
        }}
    </style>

    <div class="fb-ad-card">
        <div class="fb-ad-header">
            <div class="fb-ad-avatar"></div>
            <div class="fb-ad-meta">
                <div class="fb-ad-meta-name">MI IDEA</div>
                <div class="fb-ad-meta-time">Anuncio patrocinado</div>
            </div>
            <div class="fb-ad-options">⋯</div>
        </div>

        <div class="fb-ad-content">
            {image_html}
        </div>

        <div class="fb-ad-text">
            <div class="fb-ad-headline">{headline or "Tu titular aquí"}</div>
            <div class="fb-ad-body">{body or "Tu descripción aparecerá aquí..."}</div>
            <button class="fb-ad-cta">{cta_button_text}</button>
            <div class="fb-ad-sponsored">Anuncio • Privacidad • ⋯</div>
        </div>
    </div>
    """

    st.markdown(preview_html, unsafe_allow_html=True)

    # Mostrar imagen en preview si está cargada
    if st.session_state.image_uploaded:
        img = Image.open(BytesIO(st.session_state.image_uploaded))
        st.image(img, caption="Previsualización de imagen")

    # Mostrar detalles de targeting
    st.divider()
    st.subheader("🎯 Detalles de Targeting")
    st.markdown(f"""
    - **Ubicación:** {country_name}
    - **Edad:** {age_min} - {age_max} años
    - **Idioma:** Español
    - **Presupuesto Diario:** ${budget_daily}
    - **Presupuesto Total:** ${budget_total}
    """)
