import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;
let model;

// Initialize Gemini (call this once)
export const initGemini = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API key not found. Using mock responses.');
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    return true;
  } catch (error) {
    console.error('Gemini init error:', error);
    return false;
  }
};

// Generate explanation for attendance
export const generateExplanation = async (attendanceData) => {
  if (!model) {
    // Return mock if Gemini not available
    return `Student marked present at ${new Date().toLocaleTimeString()} with high confidence. No suspicious activity detected.`;
  }

  try {
    const prompt = `
      You are an AI explaining attendance patterns to a teacher.
      Based on this data, provide a simple 2-3 sentence explanation:
      
      - Timestamp: ${attendanceData.timestamp}
      - Confidence: ${attendanceData.confidence}
      - Face Movement: ${attendanceData.movement || 'Normal'}
      - Fraud Alert: ${attendanceData.fraudAlert ? 'Yes' : 'No'}
      
      Explain in simple terms whether this seems legitimate or potentially fraudulent.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini generation error:', error);
    return "AI explanation temporarily unavailable.";
  }
};

// Mock response for testing
export const mockGeminiResponse = () => {
  const explanations = [
    "✅ Student appears legitimate. Good face detection confidence with natural movement patterns.",
    "⚠️ Low movement detected. Could be a photo. Please verify manually.",
    "✅ Multiple face verifications confirm genuine attendance. No fraud indicators.",
    "⚠️ Unusual detection pattern. Recommend checking attendance manually.",
  ];
  return explanations[Math.floor(Math.random() * explanations.length)];
};