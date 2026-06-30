# 🎯 Meta Ads Creator GUI — Instrucciones

## Instalación

### 1. Activar entorno virtual
```bash
cd /home/jav/Facebook/meta-ads-automation
source venv/bin/activate
```

### 2. Instalar nuevas dependencias
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Esto instala:
- `streamlit` — Framework GUI
- `openai` — OpenAI API SDK
- `Pillow` — Procesamiento de imágenes

### 3. Verificar .env
Asegúrate que `/home/jav/Facebook/.env` contiene:
```
META_APP_ID=...
META_APP_SECRET=...
META_ACCESS_TOKEN=...
META_AD_ACCOUNT_ID=...
META_PAGE_ID=...
OPENIA_API_KEY=...
```

## Lanzar la App

```bash
cd /home/jav/Facebook/meta-ads-automation
streamlit run gui_app.py
```

Streamlit abrirá automáticamente `http://localhost:8501` en tu navegador.

Si no abre, ve a `http://localhost:8501` manualmente.

## Uso

### Flujo básico:

1. **📷 Sube una imagen** — JPG o PNG (hasta 30MB)
2. **📝 Describe tu producto** — Qué vende o qué servicios ofrece
3. **✨ Mejora el texto con IA** — OpenAI genera headline, descripción y CTA
4. **🎯 Configura targeting** — País, rango de edad
5. **💰 Define presupuesto** — Total y diario
6. **🌐 URL de destino** — Donde lleva el anuncio (ej: https://miidea.site)
7. **👁️ Ve el preview** — Simula cómo se vería en Facebook
8. **💾 o 🚀 Publica** — Guardar como borrador (PAUSED) o publicar activo (ACTIVE)

### Vista previa

- **Columna izquierda:** Formulario
- **Columna derecha:** Preview del anuncio simulando una tarjeta de Facebook

### Resultados

Después de crear una campaña, la GUI muestra:
- IDs de Campaign, Ad Set, Ad
- Estado (🟡 Borrador o 🟢 Activo)

Puedes ver la campaña en [Meta Ads Manager](https://ads.facebook.com)

## Funcionalidades

✅ Subir imagen  
✅ Mejorar texto con OpenAI GPT-4o-mini  
✅ Preview en tiempo real  
✅ Targeting por país y edad  
✅ Presupuesto configurable  
✅ Crear como borrador o publicar directamente  
✅ Integración con Meta Ads API

## Solución de problemas

### Error: "Missing env vars"
- Verifica que `/home/jav/Facebook/.env` existe
- Revisa que tiene todas las variables requeridas

### Error: "OpenAI API error"
- Verifica que `OPENIA_API_KEY` es válida
- Comprueba que tienes saldo en OpenAI

### Error: "Facebook API error"
- Verifica que `META_ACCESS_TOKEN` es válido
- Revisa que `META_AD_ACCOUNT_ID` es correcto
- Comprueba permisos en tu cuenta de Meta Ads

### La imagen no se muestra en preview
- Prueba con un tamaño más pequeño
- Usa JPG en lugar de PNG

### El presupuesto no se guarda
- Presupuesto diario no puede ser > presupuesto total

## Parar la app

Presiona `Ctrl+C` en la terminal donde corre Streamlit.

## Archivos

- `gui_app.py` — App principal (Streamlit)
- `gui_config.py` — Config que carga .env
- `openai_helper.py` — Integración OpenAI
- `meta/campaign.py` — Funciones Meta Ads (modificado)
- `requirements.txt` — Dependencias (modificado)

---

**Status:** ✅ Listo para usar

Para actualizar código, edita estos archivos y recarga la página (la app se reinicia automáticamente).
