import json
import json5
from anthropic import Anthropic
from models.campaign_plan import CampaignPlan, Audience
from ai.prompts import STRATEGY_PROMPT

client = Anthropic()

def generate_campaign_strategy(
    company_description: str,
    objective: str,
    budget: float,
    daily_budget: float,
    account_insights: dict
):
    prompt = STRATEGY_PROMPT.format(
        spend=account_insights.get('spend', 0),
        ctr=account_insights.get('ctr', 0),
        cpc=account_insights.get('cpc', 0),
        roas=account_insights.get('roas', 0),
        cpa=account_insights.get('cpa', 0),
        conversions=account_insights.get('conversions', 0),
        company_description=company_description,
        objective=objective,
        budget=budget,
        daily_budget=daily_budget,
    )

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    response_text = message.content[0].text

    try:
        strategy = json5.loads(response_text)
    except:
        try:
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            strategy = json.loads(response_text[start:end])
        except Exception as e:
            print(f"Error parsing Claude response: {e}")
            print(f"Raw response: {response_text}")
            raise

    audience = Audience(
        age_min=strategy['audience'].get('age_min', 18),
        age_max=strategy['audience'].get('age_max', 65),
        interests=strategy['audience'].get('interests', []),
        languages=strategy['audience'].get('languages', ['es']),
        countries=strategy['audience'].get('countries', ['AR']),
        exclude_audiences=strategy['audience'].get('exclude_audiences', []),
    )

    plan = CampaignPlan(
        campaign_name=strategy['campaign_name'],
        objective=objective.upper(),
        budget=budget,
        daily_budget=daily_budget,
        audience=audience,
        ad_copy=strategy['ad_copy'].get('description', ''),
        headline=strategy['ad_copy'].get('headline', ''),
        description=strategy['ad_copy'].get('description', ''),
        call_to_action=strategy['ad_copy'].get('call_to_action', 'LEARN_MORE'),
        landing_url=strategy['ad_copy'].get('landing_url', ''),
        reasoning=strategy.get('reasoning', ''),
    )

    return plan
