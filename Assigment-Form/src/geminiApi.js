import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateMCQs = async (topic, syllabus, count, difficulty) => {
  const prompt = `Generate exactly ${count} MCQs on the topic "${topic}" using this syllabus: "${syllabus}". 
  
  DIFFICULTY LEVEL: ${difficulty}.
  - If Easy: Focus on basic definitions, fundamental concepts, and straightforward facts.
  - If Medium: Focus on standard application, understanding, and core principles.
  - If Advanced: Focus on deep, complex, analytical, and highly important tricky questions that test deep knowledge.
  
  Format the response strictly as a valid JSON array of objects. Do not include markdown code blocks like \`\`\`json. Just return the raw JSON array.
  Each object must have exactly these keys: "question" (string), "options" (array of 4 strings), and "answerIndex" (integer 0 to 3).`;

  try {
    // FIX: Changed model to 'gemini-pro' which is universally available and won't throw 404
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // FIX: Agar AI galti se markdown tags (```json) bhej de, toh unhe clean karna
    if (responseText.includes('```')) {
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('SDK Error details:', error);
    return null;
  }
};

