#!/usr/bin/env python3
"""Test Meta Ads API connection and list ad accounts"""

import requests
import json
import os

ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN") or os.getenv("ACCESS_TOKEN")
GRAPH_API_VERSION = "v19.0"

if not ACCESS_TOKEN:
    print("❌ Error: ACCESS_TOKEN not found in .env")
    exit(1)

def get_ad_accounts():
    """Obtiene cuentas publicitarias del usuario actual"""
    try:
        print("🔗 Conectando a Meta Graph API...")

        # Obtener usuario actual
        url = f"https://graph.instagram.com/{GRAPH_API_VERSION}/me"
        params = {"access_token": ACCESS_TOKEN, "fields": "id,name"}

        response = requests.get(url, params=params)

        if response.status_code != 200:
            print(f"❌ Error al obtener usuario: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False

        user_data = response.json()
        print(f"✅ Usuario conectado: {user_data.get('name', 'N/A')} (ID: {user_data.get('id', 'N/A')})")

        # Obtener cuentas publicitarias
        print("\n📊 Obteniendo cuentas publicitarias...")
        url = f"https://graph.instagram.com/{GRAPH_API_VERSION}/me/adaccounts"
        params = {
            "access_token": ACCESS_TOKEN,
            "fields": "id,name,account_status,currency,business_name"
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            print(f"❌ Error: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False

        data = response.json()
        accounts = data.get('data', [])

        if not accounts:
            print("❌ No se encontraron cuentas publicitarias")
            return False

        print("\n📊 CUENTAS PUBLICITARIAS DISPONIBLES:")
        print("=" * 80)

        for i, account in enumerate(accounts, 1):
            account_id = account.get('id', 'N/A')
            account_name = account.get('name', 'N/A')
            status = account.get('account_status', 'N/A')
            currency = account.get('currency', 'N/A')
            business_name = account.get('business_name', 'N/A')

            print(f"\n{i}. {account_name}")
            print(f"   ID Cuenta: {account_id}")
            print(f"   Estado: {status}")
            print(f"   Moneda: {currency}")
            print(f"   Negocio: {business_name}")

            # Obtener insights de la cuenta
            insights_url = f"https://graph.instagram.com/{GRAPH_API_VERSION}/{account_id}/insights"
            insights_params = {
                "access_token": ACCESS_TOKEN,
                "metric": "spend",
                "date_preset": "last_30d"
            }

            try:
                insights_response = requests.get(insights_url, params=insights_params)
                if insights_response.status_code == 200:
                    insights_data = insights_response.json()
                    if insights_data.get('data'):
                        spend = insights_data['data'][0].get('values', [{}])[0].get('value', 'N/A')
                        print(f"   Gasto (últimos 30d): ${spend}")
            except Exception as e:
                print(f"   ⚠️  No se pudieron obtener métricas")

        print("\n" + "=" * 80)
        print("✅ Conexión exitosa! Token válido.")
        return True

    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

if __name__ == '__main__':
    get_ad_accounts()
