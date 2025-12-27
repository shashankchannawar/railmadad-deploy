from flask import Flask, request, jsonify
import pandas as pd
import re
from collections import defaultdict
import os
import logging

from transformers import pipeline
from sklearn.preprocessing import LabelEncoder

# ---------------------
# System & Logging Setup
# ---------------------
os.environ["USE_TF"] = "0"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# ---------------------
# Load ML Models (Only Once!)
# ---------------------
try:
    logger.info("Loading Sentiment Model...")
    sentiment_pipeline = pipeline(
        "sentiment-analysis", 
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    logger.info("✅ Sentiment Model loaded.")
except Exception as e:
    logger.error(f"Failed to load sentiment model: {e}")
    sentiment_pipeline = None

try:
    logger.info("Loading Category Classifier...")
    # Using a zero-shot classification model from HuggingFace
    classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli"
    )
    logger.info("✅ Category Classifier loaded.")
except Exception as e:
    logger.warning(f"Category classifier not available: {e}")
    logger.warning("Falling back to keyword-based classification only.")
    classifier = None

# Label encoder for model outputs
label_encoder = LabelEncoder()
category_labels = [
    "Medical Emergency", "Facility Cleaning", "Coach Maintenance", 
    "Food Services", "Emergency Services", "Safety", 
    "Operational Issues", "Seat Issues", "Others"
]
label_encoder.fit(category_labels)

# ---------------------
# Category Keywords
# ---------------------
categories = {
    "Medical Emergency": [
        "medical", "emergency medical", "doctor", "ambulance", "hospital", "injury", "injured",
        "accident", "hurt", "pain", "unconscious", "faint", "collapse", "sick", "illness",
        "heart attack", "stroke", "seizure", "breathing problem", "blood", "bleeding", "wound",
        "fracture", "broken bone", "fever", "vomit", "nausea", "dizzy", "chest pain", "allergic",
        "allergy", "asthma", "diabetic", "blood pressure", "critical condition", "dying", "death", "dead",
        "pregnant", "delivery", "labor", "childbirth", "medicine", "drug", "prescription",
        "first aid", "paramedic", "nurse", "health emergency", "panic attack", "anxiety attack",
        "choking", "suffocating", "burn", "scald", "poison", "overdose", "medical shock",
        "patient", "medical help", "medical attention", "medical treatment", "health issue"
    ],
    
    "Facility Cleaning": [
        "clean", "dirti", "dirty", "garbag", "garbage", "washroom", "toilet", "filth", 
        "sanit", "unhygien", "stain", "overflow", "smell", "odor", "not clean", "sewag",
        "mosquito", "pest", "sweep", "no clean", "hygiene", "unclean", "mess", "litter",
        "stagnant", "clutter", "cleanliness", "uncleanli", "dust", "cleaner", "cleaning"
    ],
    
    "Coach Maintenance": [
        "fan", "fan not working", "light", "light not working", "charg", "charging not working",
        "ac", "ac not working", "ac problem", "bedroll", "blanket", "window", "window broken",
        "door", "door problem", "sheet", "pillow", "rack", "luggage rack", "malfunct", 
        "equipment", "shutter", "flush", "flush not working", "seatbelt", "ventilat", "socket",
        "socket not working", "jam", "jammed", "lock", "door lock", "door jam"
    ],
    
    "Food Services": [
        "food", "food service", "cater", "catering", "meal", "meal service", "packet", 
        "food packet", "drink", "beverage", "vendor", "food vendor", "bottl", "bottle",
        "hygien food", "food hygiene", "stale", "stale food", "expire", "expired food",
        "cold food", "unhygien food", "unhygienic food", "contamin", "contaminated food",
        "dirty plate", "refill", "storag", "food storage", "spoil", "spoiled food"
    ],
    
    "Emergency Services": [
        "emergency", "emergency service", "urgent", "critical emergency", "sos", "help emergency",
        "rescue", "evacuate", "evacuation", "fire", "fire emergency", "smoke", "flame", 
        "burning", "fire extinguisher", "fire alarm", "flood", "water logging",
        "natural disaster", "earthquake", "storm", "cyclone", "derailment", "train derailment",
        "accident", "train accident", "crash", "collision", "train collision"
    ],
    
    "Safety": [
        "secur", "security", "security issue", "police", "railway police", "rpf", "safe",
        "safety issue", "unsafe", "robb", "robbery", "thief", "theft", "stealing", "stolen",
        "threat", "threatening", "unauthor access", "unauthorized access", "unauthorized entry",
        "fight", "fighting", "brawl", "bag miss", "bag missing", "bag stolen", "luggage missing",
        "cctv", "cctv not working", "camera", "surveillance", "suspici", "suspicious"
    ],
    
    "Operational Issues": [
        "delay", "delayed", "late", "running late", "reschedul", "rescheduled", "tim", "time",
        "punctual", "punctuality", "postpon", "postponed", "miss", "missed train", "arriv",
        "arrival", "arrival delay", "depart", "departure", "departure delay", "wait", "waiting",
        "run behind", "behind schedule", "not on time", "held up", "schedul", "schedule"
    ],
    
    "Seat Issues": [
        "seat", "seat problem", "berth", "berth problem", "invad", "invasion", "unauthor seat",
        "unauthorized seat", "allot", "allotment", "allotted", "change seat", "swap seat",
        "seat swap", "occup", "occupied", "seat occupied", "berth occupied", "taken", 
        "seat taken", "berth taken", "adjust", "adjustment", "reserv error", "reservation error"
    ],
    
    "Others": [
        "ticket", "ticket problem", "book", "booking", "booking problem", "reserv", 
        "reservation", "cancel", "cancellation", "refund", "refund pending", "pnr", 
        "payment", "payment issue", "app", "app problem", "feedback", "suggestion",
        "complaint", "grievance", "issue", "problem", "concern", "query", "question"
    ]
}

# Priority levels
priority_levels = {
    "High": ["Medical Emergency", "Emergency Services", "Safety", "Seat Issues"],
    "Medium": ["Operational Issues", "Facility Cleaning", "Food Services", "Coach Maintenance"],
    "Low": ["Others"]
}

# Severity keywords
severity_keywords = {
    "Critical": [
        "fire", "fight", "weapon", "dead", "death", "dying", "injury", "injured",
        "threat", "attack", "assault", "emergency", "critical", "unconscious",
        "bleeding", "heart attack", "stroke", "derailment", "accident", "collision"
    ],
    "Moderate": [
        "delay", "seat taken", "unauthorized", "unhygienic", "dirty", "no police",
        "theft", "harassment", "rude", "misbehaviour", "pain", "sick", "fever",
        "broken", "malfunction", "not working", "late", "cancel", "stale food"
    ],
    "Mild": [
        "no fan", "blanket", "ticket error", "refund delay", "slow",
        "minor issue", "inconvenience", "suggestion", "app issue", "login problem"
    ]
}

low_priority_severity_keywords = {
    "Moderate": [
        "payment fail", "cancel", "not working", "error", "refund", "technical issue",
        "app crash", "server down", "booking fail", "transaction fail"
    ],
    "Mild": [
        "app issue", "slow", "login issue", "ticket pending", "update required",
        "loading slow", "minor glitch", "display issue"
    ],
    "Negligible": [
        "feedback", "suggestion", "info", "layout", "typo", "color", "font",
        "interface", "design", "opinion", "recommendation", "general comment"
    ]
}

# ---------------------
# Helper Functions
# ---------------------
def classify_sentiment_safe(text):
    """Safely classify sentiment with error handling."""
    text = str(text).strip()
    if not text or text.lower() == 'nan':
        return "Neutral", 0.0
    
    if sentiment_pipeline is None:
        return "Neutral", 0.0
    
    try:
        result = sentiment_pipeline(text[:512])[0]
        return result['label'], float(result['score'])
    except Exception as e:
        logger.error(f"Sentiment classification error: {e}")
        return "Error", 0.0

def get_matching_categories(text):
    """Get all matching categories for the text."""
    text = text.lower()
    matched = []
    for category, keywords in categories.items():
        for kw in keywords:
            if re.search(rf"\b{kw}", text):
                matched.append(category)
                break
    return matched if matched else ["Others"]

def find_dominant_category(text):
    """
    Improved dominant category selection with weighted scoring.
    Considers: keyword frequency, category priority, and severity.
    """
    text = text.lower()
    category_scores = defaultdict(float)
    
    # Calculate keyword match scores
    for category, keywords in categories.items():
        for kw in keywords:
            matches = len(re.findall(rf"\b{kw}", text))
            if matches > 0:
                category_scores[category] += matches
    
    if not category_scores:
        return "Others"
    
    # Apply priority multiplier
    for category in category_scores:
        for priority, cats in priority_levels.items():
            if category in cats:
                priority_multiplier = {"High": 3.0, "Medium": 2.0, "Low": 1.0}
                category_scores[category] *= priority_multiplier[priority]
                break
    
    # Apply severity boost for critical issues
    for severity_level, keywords in severity_keywords.items():
        if severity_level == "Critical":
            for kw in keywords:
                if kw in text:
                    for category in category_scores:
                        if category in priority_levels["High"]:
                            category_scores[category] *= 1.5
    
    # Return the category with highest score
    return max(category_scores, key=category_scores.get)

def assign_priority(category):
    """Assign priority based on category."""
    for priority, cats in priority_levels.items():
        if category in cats:
            return priority
    return "Low"

def assign_severity(text, priority):
    """Assign severity level based on text content and priority."""
    if priority not in ["High", "Medium"]:
        return None
    
    text = text.lower()
    for level, keywords in severity_keywords.items():
        if any(kw in text for kw in keywords):
            return level
    
    return "Mild"

def assign_low_priority_severity(text, priority):
    """Assign severity for low priority complaints."""
    if priority != "Low":
        return None
    
    text = text.lower()
    for level, keywords in low_priority_severity_keywords.items():
        if any(kw in text for kw in keywords):
            return level
    
    return "Mild"

def get_predicted_category(text):
    """Get category prediction from ML model if available."""
    if classifier is None:
        return "Not Available"
    
    try:
        # Zero-shot classification
        candidate_labels = category_labels
        result = classifier(text[:512], candidate_labels)
        predicted_category = result['labels'][0]
        confidence = round(result['scores'][0], 4)
        return f"{predicted_category} (confidence: {confidence})"
    except Exception as e:
        logger.error(f"Model prediction error: {e}")
        return "Error"

# ---------------------
# Core ML Processing
# ---------------------
def process_query(query):
    """Process complaint query and extract all relevant information."""
    if not query or not isinstance(query, str):
        raise ValueError("Invalid query input")
    
    sentiment, score = classify_sentiment_safe(query)
    categories_found = get_matching_categories(query)
    dominant = find_dominant_category(query)
    priority = assign_priority(dominant)
    severity = assign_severity(query, priority)
    
    if severity is None:
        severity = assign_low_priority_severity(query, priority)
    
    predicted_category = get_predicted_category(query)
    
    return {
        "Query": query,
        "Sentiment": sentiment,
        "Sentiment_Score": round(score, 4),
        "All_Categories": categories_found,
        "Dominant_Category": dominant,
        "Priority": priority,
        "Severity": severity,
        "Predicted_Category_From_Model": predicted_category
    }

# ---------------------
# Flask Routes
# ---------------------
@app.route("/process_query", methods=["POST"])
def process_query_api():
    """API endpoint to process complaint queries."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        query = data.get("query", "").strip()
        if not query:
            return jsonify({"error": "Empty query"}), 400
        
        result = process_query(query)
        return jsonify(result), 200
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"API Error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "running",
        "sentiment_model": "loaded" if sentiment_pipeline else "not loaded",
        "classifier_model": "loaded" if classifier else "not loaded"
    }), 200

@app.route("/", methods=["GET"])
def index():
    """Root endpoint with API documentation."""
    return jsonify({
        "message": "Railway Complaint Classification API",
        "endpoints": {
            "POST /process_query": "Classify complaint query",
            "GET /health": "Health check",
            "GET /": "API documentation"
        },
        "example": {
            "url": "/process_query",
            "method": "POST",
            "body": {"query": "The seat is already occupied by someone else"}
        }
    }), 200

# ---------------------
# Start Flask Server
# ---------------------
if __name__ == "__main__":
    logger.info("Initializing models and server...")
    try:
        app.run(
            host="0.0.0.0",
            port=5000,
            debug=False,
            use_reloader=False,
            threaded=True
        )
    except Exception as e:
        logger.error(f"Server crashed: {e}")