import pandas as pd
import re
import json
from transformers import pipeline
from collections import defaultdict

# Load transformer model (once)
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Sentiment classification
def classify_sentiment_safe(text):
    text = str(text)
    if text.strip() == '' or text.lower() == 'nan':
        return pd.Series(['Neutral', 0.0])
    try:
        result = sentiment_pipeline(text[:512])[0]
        return pd.Series([result['label'], result['score']])
    except Exception:
        return pd.Series(['Error', 0.0])

# Category keywords
categories = {
    "Food": ["food", "meal", "stale", "hygien", "drink", "cater", "vendor"],
    "Delay": ["delay", "late", "reschedul", "postpon", "miss"],
    "Seat Issues": ["seat", "berth", "unauthor", "taken", "occupy", "encroach"],
    "Misbehaviour": ["rude", "fight", "abuse", "threat", "harass"],
    "Cleanliness": ["clean", "dirty", "toilet", "garbage", "unhygien"],
    "Facilities": ["ac", "fan", "light", "flush", "window", "water"],
    "Ticketing": ["ticket", "pnr", "booking", "refund", "payment"],
    "Safety": ["thief", "police", "fire", "weapon", "chain pull", "danger"]
}

# Match all categories
def get_matching_categories(text):
    text = text.lower()
    matched = []
    for category, keywords in categories.items():
        if any(re.search(rf"\b{kw}", text) for kw in keywords):
            matched.append(category)
    return ", ".join(sorted(set(matched))) if matched else "Other"

# Dominant category (most matched keywords)
def find_dominant_category(text):
    text = text.lower()
    counts = defaultdict(int)
    for category, keywords in categories.items():
        for kw in keywords:
            if re.search(rf"\b{kw}", text):
                counts[category] += 1
    return max(counts, key=counts.get) if counts else "Other"

# Priority logic
high_priority = ["Safety", "Misbehaviour", "Seat Issues"]
medium_priority = ["Delay", "Cleanliness", "Food", "Facilities"]
low_priority = ["Ticketing", "Other"]

def assign_priority(category):
    if category in high_priority:
        return "High"
    elif category in medium_priority:
        return "Medium"
    return "Low"

# Severity keywords
severity_keywords = {
    "Critical": ["fight", "fire", "harass", "threat", "weapon", "emergency", "explosion"],
    "Moderate": ["delay", "stolen", "unhygienic", "broken", "dirty", "seat taken"],
    "Mild": ["late", "refund", "no fan", "app issue", "wrong seat", "slow"]
}
low_priority_severity_keywords = {
    "Moderate": ["fail", "cancel", "no response", "wrong ticket"],
    "Mild": ["problem in app", "site down", "wait list"],
    "Negligible": ["feedback", "query", "suggestion"]
}

def assign_severity(text, priority):
    text = text.lower()
    if priority not in ["High", "Medium"]:
        return None
    for level in ["Critical", "Moderate", "Mild"]:
        if any(kw in text for kw in severity_keywords[level]):
            return level
    return "Mild"

def assign_low_priority_severity(text, priority):
    text = text.lower()
    if priority != "Low":
        return None
    for level in ["Moderate", "Mild", "Negligible"]:
        if any(kw in text for kw in low_priority_severity_keywords[level]):
            return level
    return "Mild"

# Main function
def process_query(query):
    sentiment, score = classify_sentiment_safe(query)
    matched = get_matching_categories(query)
    dominant = find_dominant_category(query)
    priority = assign_priority(dominant)
    severity = assign_severity(query, priority) or assign_low_priority_severity(query, priority)
    
    return {
        "Query": query,
        "Sentiment_Label": sentiment,
        "Sentiment_Confidence": round(score, 3),
        "Categories": matched,
        "Dominant_Category": dominant,
        "Priority": priority,
        "Severity": severity
    }
