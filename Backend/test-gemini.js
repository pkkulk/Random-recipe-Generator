import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGeminiConnection() {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash-preview-05-20",
    });
    const prompt = `Generate 2 simple pasta recipes. Respond with valid JSON:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "prepTime": 15,
      "cookTime": 20
    }
  ]
}`;

    console.log("Sending request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw response:", text);

    // Try to parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("Parsed JSON:", parsed);
      console.log("Number of recipes:", parsed.recipes?.length || 0);
    } else {
      console.log("No JSON found in response");
    }
  } catch (error) {
    console.error("Gemini test failed:", error.message);
  }
}

testGeminiConnection();
