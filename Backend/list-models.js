import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

async function listModels() {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("Listing available models...");
    const models = await genAI.listModels();

    console.log("Available models:");
    for await (const model of models) {
      console.log(`- ${model.name}`);
    }
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
