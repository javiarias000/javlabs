from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Audience:
    age_min: int
    age_max: int
    interests: List[str]
    languages: List[str]
    countries: List[str]
    exclude_audiences: Optional[List[str]] = None

@dataclass
class CampaignPlan:
    campaign_name: str
    objective: str
    budget: float
    daily_budget: float
    audience: Audience
    ad_copy: str
    headline: str
    description: str
    call_to_action: str
    landing_url: str
    reasoning: str
