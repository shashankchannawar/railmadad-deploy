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

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
