import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import utils

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_origin_regex=r"https://competitor-analysis-tool.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Context(BaseModel):
    business_overview: str
    usp: str
    competitors: str
    campaign_objective: str
    target_audience: str
    audience_pain_points: str
    products_promoted: str
    offers_promotions: str
    admired_competitor_ads: str
    monthly_budget: str
 
@app.post("/playbook")
def playbook(context: Context):
    return {"playbook": utils.run(context.model_dump())}