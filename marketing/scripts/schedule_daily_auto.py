#!/usr/bin/env python3
"""
Daily automatic post publisher
Publishes one post per day from folder images
Runs as background daemon or via cron
"""

import os
import sys
import random
from pathlib import Path
from datetime import datetime
import logging
from dotenv import load_dotenv
from meta.pages import init_pages_api

load_dotenv()

PAGE_ID = os.getenv("PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")
IMAGE_FOLDER = "/home/jav/Facebook/facebook-100063596467837-20_04_2026-OWzQjEYQ/this_profile's_activity_across_facebook/posts/media/Fotos_505523001577578"

# Setup logging
LOG_FILE = "/home/jav/Facebook/meta-ads-automation/daily_posts.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Messages con oferta
MESSAGES = [
    "🎉 ¡OFERTA ESPECIAL! 🎉\n✨ Retratos Personalizados ✨\n15cm x 15cm - ANTES $10 → AHORA $8 (20% OFF)\n⏰ ¡Hasta agotar stock!\nCaptura tus momentos más especiales 💕",
    "🔥 ¡DESCUENTO INCREÍBLE! 20% OFF 🔥\nRetratos personalizados en madera grabada\n15cm x 15cm - Solo $8 (era $10)\nRegala algo único y especial 🎁",
    "💎 PROMOCIÓN EXCLUSIVA 💎\nRetratos personalizados -20% descuento\n$8 en lugar de $10\nPerfectos para mamá, pareja o amigos 💑\n¡Hoy es el día! ¡No te lo pierdas! 💨",
    "🎯 MEGA OFERTA ACTIVADA 🎯\n✨ Retratos en madera grabada\n📏 15cm x 15cm\n💰 $10 → $8 (20% descuento)\n⏳ Tiempo limitado - ¡Corre! 🏃",
    "🌟 ¡FLASH SALE! ¡ESTAMOS LOCOS! 🌟\nRetratos personalizados 20% más baratos\n$8 cada uno (antes $10)\nMadera de calidad + grabado perfecto 🎨\n¡Mientras dure la oferta! 📉",
    "💥 DESCUENTO BRUTAL 💥\nRetratos personalizados: $10 → $8\n¡20% de rebaja! 🎉\nCapturas tus momentos eternamente 📸\nStock: Limitado ⚠️",
    "🎊 ¡OFERTAS QUE EXPLOTAN! 🎊\nRetratos en madera 15x15cm\nANTES $10 - AHORA SOLO $8 💸\nDescuento del 20% en todos ✂️\n¡Hoy, mañana quién sabe! ⏰",
    "⭐ PRECIO ESPECIAL ⭐\nRetratos personalizados en oferta\n15cm x 15cm: $8 (ahorro $2)\nDescuento 20% - Agotar stock\n¡Ideal para regalos! 🎁",
    "🚀 LANZAMIENTO DE OFERTA 🚀\nRetratos personalizados 20% OFF\nCosto: $8 (de $10)\nGrabado de excelencia garantizado ✓\n¡Aprovecha ahora! 🔔",
    "💰 DINERO QUE AHORRAS 💰\nRetratos: $10 → $8 (-20%)\n15x15cm de puro amor y arte 💓\n¡Única chance de este mes!\n¡Corre antes que se acabe! 👟"
]

def get_random_image():
    """Get random image from folder"""
    image_folder = Path(IMAGE_FOLDER)
    images = sorted([
        p for p in image_folder.glob('*')
        if p.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif']
    ])

    if not images:
        return None

    return random.choice(images)

def publish_daily_post():
    """Publish one random image with message"""

    logger.info("=" * 70)
    logger.info("Starting daily post publish...")

    # Get random image
    image_path = get_random_image()
    if not image_path:
        logger.error("No images found in folder")
        return False

    # Get random message
    message = random.choice(MESSAGES)

    # Initialize API
    pages = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)

    try:
        logger.info(f"Publishing: {image_path.name}")
        logger.info(f"Message preview: {message[:60]}...")

        result = pages.create_post_with_photo(
            message=message,
            photo_path=str(image_path)
        )

        if "error" in result:
            logger.error(f"API Error: {result['error']}")
            return False

        post_id = result.get('post_id') or result.get('id')
        logger.info(f"✅ Post published! ID: {post_id}")
        logger.info(f"Link: https://facebook.com/{post_id}")

        return True

    except Exception as e:
        logger.error(f"Exception: {e}")
        return False

if __name__ == '__main__':
    success = publish_daily_post()
    sys.exit(0 if success else 1)
