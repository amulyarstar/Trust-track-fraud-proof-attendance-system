/**
 * src/utils/visionAPI.js
 * Upgraded to Gemini 2.5/3 Flash for Liveness & Fraud Detection
 */
export const detectFace = async (imageData) => {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  // Using the stable v1 endpoint with fallback logic
  const model = "gemini-2.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;

  if (!API_KEY) {
    console.error("Gemini Error: API Key is missing in .env.local");
    return { count: 0, error: "Missing API Key" };
  }

  try {
    const base64Data = imageData.split(',')[1];
    const payload = {
      contents: [{
        parts: [
          { 
            text: `Analyze this image for classroom attendance. 
            Check for:
            1. Face count.
            2. Eyes status (open/closed).
            3. Liveness (Is it a real person or a photo?).
            
            Reply ONLY with a JSON object: 
            { "count": number, "eyes": "open"|"closed", "isReal": boolean, "confidence": number }` 
          },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini System Error:", data.error.message);
      return { count: 0, confidence: 0 };
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      // Clean the response in case Gemini adds markdown formatting
      const cleanJson = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanJson);
      console.log("AI Liveness Result:", result);
      return result;
    } 
    return { count: 0, confidence: 0, eyes: "unknown", isReal: false };
  } catch (error) {
    console.error("VisionAPI Connection Error:", error);
    return { count: 0, confidence: 0 };
  }
};