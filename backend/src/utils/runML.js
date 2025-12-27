import axios from 'axios';

export const processQuery = async (text) => {
  try {
    const response = await axios.post('http://localhost:5000/process_query', {
      query: text,
    });
    return response.data;
  } catch (error) {
    console.error("Error calling Flask ML API:", error.message);
    throw new Error('ML service unavailable');
  }
};