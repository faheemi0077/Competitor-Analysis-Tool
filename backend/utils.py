


def get_context():
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