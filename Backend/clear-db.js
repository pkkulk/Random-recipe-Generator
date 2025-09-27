import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "./src/models/Recipe.js";
import Ingredient from "./src/models/Ingredient.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🍖 MongoDB Connected for cleanup");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  await connectDB();

  console.log("🧹 Clearing seeded data...");

  // Clear all recipes and ingredients
  await Recipe.deleteMany({});
  await Ingredient.deleteMany({});

  console.log("✅ Database cleared - now using Gemini API only!");
  process.exit(0);
};

clearDatabase().catch(console.error);
