from flask import Flask, request, jsonify
import os
import pandas as pd
import torch
import torch.nn as nn
from transformers import pipeline
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from ml_core import process_query  # assume all utility functions moved to ml_core.py

# ------------------ Setup Flask ------------------
app = Flask(__name__)

# ------------------ Setup Transformers ------------------
os.environ["USE_TF"] = "0"
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# ------------------ Setup PyTorch Classifier ------------------
# Load data used for training vectorizer and label_encoder
df = pd.read_excel("Final_Complaints.xlsx")
df = df[df['Complaint_Text'].notna()]
df['Priority_Level'] = df['Severity'].str.capitalize()

label_encoder = LabelEncoder()
df['label'] = label_encoder.fit_transform(df['Priority_Level'])

vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['Complaint_Text']).toarray()
input_dim = X.shape[1]
hidden_dim = 128
output_dim = len(label_encoder.classes_)

# Define and load model
class ComplaintClassifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(ComplaintClassifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)
        return out

model = ComplaintClassifier(input_dim, hidden_dim, output_dim)
model.load_state_dict(torch.load("model.pth", map_location=torch.device("cpu")))
model.eval()

# ------------------ Endpoint ------------------
@app.route("/process", methods=["POST"])
def analyze():
    data = request.get_json()
    query = data.get("query", "")

    # Sentiment
    try:
        sent = sentiment_pipeline(query[:512])[0]
    except:
        sent = {'label': 'Neutral', 'score': 0.0}

    # Heuristic NLP
    result = process_query(query)

    # Predict priority via PyTorch classifier
    query_vec = vectorizer.transform([query]).toarray()
    query_tensor = torch.tensor(query_vec, dtype=torch.float32)
    with torch.no_grad():
        output = model(query_tensor)
        predicted = torch.argmax(output, dim=1).item()
        severity_prediction = label_encoder.inverse_transform([predicted])[0]

    # Combine result
    response = {
        **result,
        "Sentiment_Label": sent['label'],
        "Sentiment_Confidence": round(sent['score'], 2),
        "Predicted_Severity_PyTorch": severity_prediction
    }

    return jsonify(response)

# ------------------ Run ------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
