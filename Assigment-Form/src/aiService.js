import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a professional assessment creator. Your task is to generate high-quality Multiple Choice Questions (MCQs).
The output MUST be a raw JSON array of objects.
Each object must have exactly these keys: "question" (string), "options" (array of 4 strings), and "answerIndex" (integer 0 to 3).
Do not include any explanation or markdown tags.`;

export const generateMCQs = async (topic, syllabus, count, difficulty) => {
  const prompt = `Generate exactly ${count} MCQs on the topic "${topic}" using this syllabus: "${syllabus}". 
  
  DIFFICULTY LEVEL: ${difficulty}.
  - If Easy: Focus on basic definitions, fundamental concepts, and straightforward facts.
  - If Medium: Focus on standard application, understanding, and core principles.
  - If Advanced: Focus on deep, complex, analytical, and highly important tricky questions that test deep knowledge.
  
  Format the response strictly as a valid JSON array of objects.`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let content = response.data.choices[0].message.content;
    let parsed = JSON.parse(content);
    
    // Unified extraction logic for robustness
    if (Array.isArray(parsed)) return parsed;
    if (parsed.questions) return parsed.questions;
    if (Object.values(parsed).find(v => Array.isArray(v))) {
        return Object.values(parsed).find(v => Array.isArray(v));
    }
    return parsed;
  } catch (error) {
    console.error('Groq Generation Error:', error);
    return null;
  }
};
