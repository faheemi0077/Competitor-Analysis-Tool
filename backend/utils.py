import anthropic
import json
from urllib.parse import quote
from apify_client import ApifyClient
import os
from dotenv import load_dotenv



load_dotenv()
client = anthropic.Anthropic()
the_apify_client = apify_client = ApifyClient(os.environ["APIFY_TOKEN"])


def get_context() -> dict[str, str]:
    context = dict()
    questions = [
    "Can you provide a brief overview of your business and its core offerings?\n", 
    "What sets your business apart from competitors (USP)?\n", 
    "Who are your primary competitors?\n", 
    "What are the primary objectives of your Meta Ads campaign?\n",
    "Who is your target audience? (demographics, geographics, psychographics)\n", 
    "What problems does your target audience face that your product/service solves?\n", 
    "What products or services will be promoted?\n", 
    "Are there specific offers, discounts, or promotions you'd like to highlight?\n", 
    "Are there competitors whose ads you admire?\n", 
    "What is your monthly budget for Meta Ads?\n" 
    ]
    keys = [
    "business_overview",
    "usp",
    "competitors",
    "campaign_objective",
    "target_audience",
    "audience_pain_points",
    "products_promoted",
    "offers_promotions",
    "admired_competitor_ads",
    "monthly_budget",
]
    for i in range(len(questions)):
        context[keys[i]] = input(questions[i])
    return context

def get_keywords(context: dict) -> list[str]:
    text = str(context)
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=500,
        tools=[
            {
                "name": "return_keywords",
                "description": "Return a deduplicated list of competitor search keywords extracted from business context.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "keywords": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["keywords"]
                }
            }
        ],
        tool_choice={"type": "tool", "name": "return_keywords"},
        messages=[
            {"role": "user", "content": f"Extract search keywords (competitor names, product terms, industry terms) from this business context:\n\n{text}"}
        ]
    )
    return response.content[0].input["keywords"]

#claude script to get ad formatted
def slim_ad(ad):
    snap = ad.get("snapshot", {})
    body = snap.get("body") or {}
    copy = body.get("text")
    title = snap.get("title")
    cards = snap.get("cards")

    def clean(val):
        return val if val and "{{" not in val else None

    if cards:
        card = cards[0]
        if not clean(copy):
            copy = clean(card.get("body"))
        if not clean(title):
            title = clean(card.get("title"))

    return {
        "advertiser": snap.get("pageName"),
        "title": title,
        "copy": copy,
        "cta": snap.get("ctaText"),
        "format": snap.get("displayFormat"),
        "link": snap.get("linkUrl"),
        "running_since": ad.get("startDateFormatted"),
    }

def get_competitor_data(keyword, country="US", limit=5) -> dict[str, str]:
    url = (
        "https://www.facebook.com/ads/library/"
        f"?active_status=active&ad_type=all&country={country}"
        f"&q={quote(keyword)}&search_type=keyword_unordered"
    )
    run = the_apify_client.actor("apify/facebook-ads-scraper").call(
        run_input={"startUrls": [{"url": url}]},
        max_items=limit,
        #limited to 10 cents per request
        max_total_charge_usd=0.10,
    )
    #method provided by apify
    ads = the_apify_client.dataset(run.default_dataset_id).iterate_items()
    return [slim_ad(ad) for ad in ads]

def get_playbook(ads: list[dict], context: dict) -> str:
    prompt = (
        "Write a Meta Ads playbook using the competitor ad data below. "
        "Ignore any ads unrelated to the business's industry - they're keyword-match noise.\n"
        "Use exactly these sections in this order:\n"
        "1. Executive summary of competitor landscape\n"
        "2. Table of competitor data\n"
        "3. Dominant copy/hook patterns used\n"
        "4. Common offers\n"
        "5. Common media formats\n"
        "6. Gaps/ads that have potential which aren't being used\n"
        "7. Recommended ways to make ads that can be tested out\n\n"
        f"Business context:\n{context}\n\n"
        f"Competitor ad data:\n{ads}"
    )
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )
    for block in response.content:
        if block.type == "text":
            return block.text
    return ""

TEST_CONTEXT = {
    "business_overview": "Private math tutoring in Los Angeles for high school students...",
    "usp": "Friendliness and patience...",
    "competitors": "Mathnasium, Kumon, Sylvan Learning",
    "campaign_objective": "Lead generation — free intro session",
    "target_audience": "Parents of high schoolers in LA, $100k+ household income",
    "audience_pain_points": "Kid falling behind in algebra/geometry, losing confidence",
    "products_promoted": "1:1 high school math tutoring, SAT/ACT math prep",
    "offers_promotions": "First session free",
    "admired_competitor_ads": "Mathnasium's free assessment ads",
    "monthly_budget": "500",
}

def test():
    context = TEST_CONTEXT
    keywords = get_keywords(context)
    data = list()
    for i in range(5):
        data.extend(get_competitor_data(keywords[i]))
    #prints the distinct advertisers shown in results (set comprehension)
    print({ad["advertiser"] for ad in data})
    print(get_playbook(data, context))

if __name__ == "__main__":
    test()