import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("=== Environment Debug ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
console.log("API Key length:", process.env.GEMINI_API_KEY?.length);
console.log(
  "API Key first 10 chars:",
  process.env.GEMINI_API_KEY?.substring(0, 10)
);
console.log("API Key last 5 chars:", process.env.GEMINI_API_KEY?.substring(-5));
console.log("API Key has quotes:", process.env.GEMINI_API_KEY?.includes('"'));
console.log(
  "API Key has newlines:",
  process.env.GEMINI_API_KEY?.includes("\n")
);
console.log("===========================");

// Test the exact same configuration as the server
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testWithServerConfig() {
  try {
    console.log("Testing with server config...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash-preview-05-20",
    });

    const result = await model.generateContent("What is AI?");
    console.log("✅ Server config works!");
    console.log(
      "Response preview:",
      result.response.text().substring(0, 100) + "..."
    );
  } catch (error) {
    console.error("❌ Server config failed:", error.message);
  }
}

testWithServerConfig();
