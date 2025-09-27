import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // match your frontend port
app.use(express.json());

// Simple mock "recipe generator" from ingredients
app.post("/api/search/recipes", (req, res) => {
  const { query, ingredients = [] } = req.body;

  // Pick ingredients from query or frontend array
  const ingList = ingredients.length > 0 ? ingredients : query?.split(",") || [];

  // Basic fake recipe instructions
  const instructions = [
    `Chop ${ingList.join(", ")}.`,
    "Heat oil in a pan.",
    `Add ${ingList[0] || "spices"} and sauté for 2 minutes.`,
    "Add the remaining ingredients and cook until soft.",
    "Season with salt & spices, then serve hot with rice or bread.",
  ];

  res.json({
    success: true,
    data: {
      title: `Recipe with ${ingList.join(", ")}`,
      ingredients: ingList,
      instructions,
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
