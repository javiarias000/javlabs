import json
import base64
import requests
from gui_config import OPENAI_API_KEY

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

def encode_image_to_base64(image_bytes: bytes) -> str:
    """Codifica bytes de imagen a base64."""
    return base64.b64encode(image_bytes).decode('utf-8')

def call_openai_api(messages: list, model: str = "gpt-4o", max_tokens: int = 500) -> str:
    """
    Llama directamente a la API de OpenAI sin usar el SDK.
    Retorna el texto de la respuesta.
    """
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
    }

    try:
        response = requests.post(OPENAI_API_URL, json=payload, headers=headers, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Error API OpenAI: {str(e)}")
    except (KeyError, IndexError) as e:
        raise ValueError(f"Error parsing respuesta OpenAI: {str(e)}")

def analyze_image_only(image_bytes: bytes) -> dict:
    """
    Analiza SOLO la imagen sin descripción previa.
    La IA genera descripción del servicio, headline, body, CTA basándose solo en la imagen.
    Retorna: {product_name, product_description, headline, body, cta}
    """
    image_b64 = encode_image_to_base64(image_bytes)

    prompt = """Eres un EXPERTO en marketing digital y copywriting de ALTO RENDIMIENTO para anuncios de Facebook/Instagram.
Tu objetivo es GENERAR CONVERSIONES y VENTAS.

Analiza esta imagen y crea un anuncio AGRESIVO, PERSUASIVO y ORIENTADO A CONVERSIÓN para el servicio/producto que ves.

REGLAS:
- Headline: IMPACTANTE, genera curiosidad, crea URGENCIA. Máx 40 caracteres.
- Body: PERSUASIVO, destaca BENEFICIOS no características, crea deseo, incluye palabra clave de acción. Máx 200 caracteres.
- Descripción: profesional pero convincente. Máx 150 caracteres.

IMPORTANTES:
- Responde SOLO con JSON válido, sin explicaciones adicionales.
- El headline debe VENDER, no informar.
- El body debe crear URGENCIA (palabras como: Ahora, Limitado, Exclusivo, Hoy, No esperes)

Retorna exactamente este formato:
{
  "product_name": "Nombre del servicio/producto que ves (máx 50 chars)",
  "product_description": "Descripción profesional del servicio (máx 150 chars)",
  "headline": "Titular que VENDE y genera URGENCIA (máx 40 chars)",
  "body": "Cuerpo persuasivo con beneficios y urgencia (máx 200 chars)",
  "cta": "LEARN_MORE"
}"""

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_b64}",
                    },
                },
                {
                    "type": "text",
                    "text": prompt
                }
            ],
        }
    ]

    try:
        result_text = call_openai_api(messages, max_tokens=500)
        result = json.loads(result_text)
        return result

    except json.JSONDecodeError:
        try:
            start = result_text.find('{')
            end = result_text.rfind('}') + 1
            if start >= 0 and end > start:
                result = json.loads(result_text[start:end])
                return result
        except:
            pass

        return {
            "product_name": "Servicio",
            "product_description": "Servicio basado en imagen",
            "headline": "Descubre nuestro servicio",
            "body": "Contactanos para más información",
            "cta": "LEARN_MORE"
        }

    except Exception as e:
        raise ValueError(f"Error analizando imagen: {str(e)}")

def analyze_image_and_product(image_bytes: bytes, product_description: str) -> dict:
    """
    Analiza imagen + descripción con OpenAI Vision.
    Retorna: {product_name, product_description, headline, body, cta}
    """
    image_b64 = encode_image_to_base64(image_bytes)

    prompt = """Eres un experto en marketing digital y copywriting para anuncios de Facebook/Instagram.

Analiza esta imagen Y la descripción del producto. Luego genera un anuncio altamente efectivo.

IMPORTANTE: Responde SOLO con JSON válido, sin explicaciones adicionales.

Retorna exactamente este formato:
{
  "product_name": "Nombre del producto/servicio (máx 50 chars)",
  "product_description": "Descripción mejorada del producto (máx 150 chars)",
  "headline": "Titular impactante (máx 40 chars) - debe captar atención",
  "body": "Descripción persuasiva (máx 200 chars) - enfoque en beneficios, urgencia",
  "cta": "LEARN_MORE"
}"""

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_b64}",
                    },
                },
                {
                    "type": "text",
                    "text": f"Descripción del producto: {product_description}\n\n{prompt}"
                }
            ],
        }
    ]

    try:
        result_text = call_openai_api(messages, max_tokens=500)
        result = json.loads(result_text)
        return result

    except json.JSONDecodeError:
        try:
            start = result_text.find('{')
            end = result_text.rfind('}') + 1
            if start >= 0 and end > start:
                result = json.loads(result_text[start:end])
                return result
        except:
            pass

        return {
            "product_name": product_description[:50],
            "product_description": product_description[:150],
            "headline": product_description[:40],
            "body": product_description[:200],
            "cta": "LEARN_MORE"
        }

    except Exception as e:
        raise ValueError(f"Error analizando imagen: {str(e)}")

def refine_ad_copy_with_chat(current_copy: dict, user_feedback: str) -> dict:
    """
    Refina el texto del anuncio basándose en feedback del usuario.
    Especialista en marketing de conversión de alto rendimiento.
    """
    prompt = f"""Eres un EXPERT en marketing digital y copywriting de ALTO RENDIMIENTO para Facebook/Instagram.
Tu objetivo: GENERAR CONVERSIONES, VENTAS y MAXIMIZAR CTR.

Texto ACTUAL:
- Headline: {current_copy.get('headline', '')}
- Body: {current_copy.get('body', '')}
- CTA: {current_copy.get('cta', '')}

Feedback del usuario: {user_feedback}

MEJORA el anuncio según el feedback. MANTÉN los límites de caracteres exactamente.
Aplica PSICOLOGÍA de marketing: urgencia, beneficios, escasez, curiosidad, confianza.

Responde SOLO con JSON válido, sin explicaciones:
{{
  "headline": "nuevo headline IMPACTANTE (máx 40 chars) - VENDE y crea curiosidad",
  "body": "nuevo body PERSUASIVO con beneficios y urgencia (máx 200 chars)",
  "cta": "CTA apropiado (LEARN_MORE, SHOP_NOW, CONTACT_US, SIGN_UP, etc)",
  "explanation": "Cambios realizados y por qué (máx 80 chars)"
}}"""

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    try:
        result_text = call_openai_api(messages, max_tokens=400)
        result = json.loads(result_text)
        return result

    except json.JSONDecodeError:
        try:
            start = result_text.find('{')
            end = result_text.rfind('}') + 1
            if start >= 0 and end > start:
                result = json.loads(result_text[start:end])
                return result
        except:
            pass

        return {
            "headline": current_copy.get('headline', ''),
            "body": current_copy.get('body', ''),
            "cta": current_copy.get('cta', 'LEARN_MORE'),
            "explanation": "No se pudo procesar el feedback"
        }

    except Exception as e:
        return {
            "headline": current_copy.get('headline', ''),
            "body": current_copy.get('body', ''),
            "cta": current_copy.get('cta', 'LEARN_MORE'),
            "explanation": f"Error: {str(e)}"
        }

def improve_ad_copy(product_description: str) -> dict:
    """
    Mejora descripción simple sin imagen.
    Retorna headline, body y CTA sugeridos.
    """
    prompt = f"""Eres un experto en marketing digital y copywriting para anuncios de Facebook/Instagram.

Descripción: "{product_description}"

Genera un anuncio altamente efectivo. Responde SOLO en formato JSON, sin explicaciones:
{{
  "headline": "tu headline aquí (máx 40 chars)",
  "body": "tu descripción aquí (máx 200 chars)",
  "cta": "LEARN_MORE"
}}"""

    messages = [{"role": "user", "content": prompt}]

    try:
        result_text = call_openai_api(messages, max_tokens=256)
        result = json.loads(result_text)
        return result

    except json.JSONDecodeError:
        try:
            start = result_text.find('{')
            end = result_text.rfind('}') + 1
            if start >= 0 and end > start:
                result = json.loads(result_text[start:end])
                return result
        except:
            pass

        return {
            "headline": product_description[:40],
            "body": product_description[:200],
            "cta": "LEARN_MORE"
        }

    except Exception as e:
        raise ValueError(f"Error mejorando texto: {str(e)}")
