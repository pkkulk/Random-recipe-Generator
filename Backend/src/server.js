import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Load recipes from JSON
const recipesFilePath = path.join(__dirname, "recipes.json");
let recipes = [];

try {
  const data = fs.readFileSync(recipesFilePath, "utf-8");
  recipes = JSON.parse(data);
  console.log(`✅ Loaded ${recipes.length} recipes from JSON`);
} catch (err) {
  console.error("Failed to load recipes.json", err);
}app.post("/api/search/recipes", (req, res) => {
  const { ingredients = [] } = req.body;
  const minMatches = 3; // minimum number of ingredients that must match

  if (recipes.length === 0) {
    return res.status(500).json({ success: false, message: "No recipes available" });
  }

  // Filter recipes that have at least `minMatches` of the requested ingredients
  const matchedRecipes = recipes.filter((r) => {
    const matchCount = r.ingredients.filter((ri) =>
      ingredients.some((ing) => ri.toLowerCase() === ing.toLowerCase())
    ).length;
    return matchCount >= minMatches;
  });

  // If no match, return a random recipe
  const result =
    matchedRecipes.length > 0
      ? matchedRecipes[Math.floor(Math.random() * matchedRecipes.length)]
      : recipes[Math.floor(Math.random() * recipes.length)];

  res.json({ success: true, data: result });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
