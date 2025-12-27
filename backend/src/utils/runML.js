import axios from 'axios';

export const processQuery = async (text) => {
  try {
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:5000';
    const response = await axios.post(`${pythonApiUrl}/process_query`, {
      query: text,
    });
    return response.data;
  } catch (error) {
    console.error("Error calling Flask ML API:", error.message);
    // Return default structure so app doesn't crash
    return {
      Dominant_Category: "Uncategorized",
      Categories: [],
      Priority: "Medium",
      Severity: "Minor",
      Sentiment_Label: "Neutral",
      Sentiment_Confidence: 0
    };
  }
};