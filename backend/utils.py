


def get_context():
    context = dict()
    questions = [
    "Can you provide a brief overview of your business and its core offerings?", 
    "What sets your business apart from competitors (USP)?", 
    "Who are your primary competitors?", 
    "What are the primary objectives of your Meta Ads campaign?",
    "Who is your target audience? (demographics, geographics, psychographics)", 
    "What problems does your target audience face that your product/service solves?", 
    "What products or services will be promoted?", 
    "Are there specific offers, discounts, or promotions you'd like to highlight?", 
    "Are there competitors whose ads you admire?", 
    "What is your monthly budget for Meta Ads?" 
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