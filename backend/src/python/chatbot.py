from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
CORS(app)

# Configuration
import os

# Configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/v1/chat/completions"
client = Groq(
    api_key=GROQ_API_KEY,
)

# Load dataset from CSV file
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "RAIL MADAD.csv")
    with open(csv_path, "r") as file:
        csv_content = file.read()
except Exception as e:
    print(f"Error reading CSV file: {e}")
    csv_content = "Error: Unable to load dataset."

system_message = f"""You are an AI assistant for Railways. {csv_content}"""

def generate_response(input_text: str) -> str:
    """Generate response using Groq API."""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": input_text}
            ],
            model="mixtral-8x7b-32768",
            temperature=0.5,
            max_tokens=1000,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error in generate_response: {e}")
        return "I'm sorry, but I encountered an error while processing your request. Please try again later."

@app.route('/')
def home():
    return "Hello, this is the EduBot server powered by Groq!"

@app.route('/api', methods=['POST'])
def chat():
    print("Received a request to /api")
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        input_text = data.get('message', '')
        
        if not input_text:
            return jsonify({'response': 'No input provided'}), 400
        
        response = generate_response(input_text)
        print(f"Sending response: {response}")
        return jsonify({'response': response})
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({'response': 'Internal server error'}), 500

def analyze_complaint(text: str) -> dict:
    """Analyze complaint using Groq to get category, priority, etc."""
    prompt = f"""
    Analyze the following railway complaint and extract the following details in JSON format:
    1. Dominant_Category: (e.g., cleanliness, staff_behaviour, security, delay, ticketing, catering, medical, other)
    2. Categories: [list of relevant sub-categories]
    3. Priority: (High, Medium, Low)
    4. Severity: (Critical, Major, Minor)
    5. Sentiment_Label: (Positive, Negative, Neutral)
    6. Sentiment_Confidence: (float betweeen 0 and 1)

    Complaint: "{text}"
    
    Return ONLY valid JSON. Do not include any explanation.
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a complaint analysis system. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            model="mixtral-8x7b-32768",
            temperature=0.1,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error in analyze_complaint: {e}")
        return "{}"

@app.route('/process_query', methods=['POST'])
def process_query():
    print("Received a request to /process_query")
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'No query provided'}), 400
            
        import json
        analysis_str = analyze_complaint(query)
        analysis_json = json.loads(analysis_str)
        
        return jsonify(analysis_json)
    except Exception as e:
        print(f"Error in process_query: {e}")
        # Return a safe default if AI fails
        return jsonify({
            "Dominant_Category": "Other",
            "Categories": ["uncategorized"],
            "Priority": "Medium",
            "Severity": "Minor",
            "Sentiment_Label": "Neutral",
            "Sentiment_Confidence": 0.0
        })

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
