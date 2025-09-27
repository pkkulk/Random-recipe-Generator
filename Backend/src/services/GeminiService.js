import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    console.log("🔑 GeminiService Debug:");
    console.log("  - API Key exists:", !!process.env.GEMINI_API_KEY);
    console.log("  - API Key length:", process.env.GEMINI_API_KEY?.length);
    console.log(
      "  - API Key first 10 chars:",
      process.env.GEMINI_API_KEY?.substring(0, 10)
    );

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash-preview-05-20",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000, // Limit response length for faster generation
      },
    });
  }

  /**
   * Generate recipe suggestions based on available ingredients
   */
  async generateRecipeSuggestions(ingredients, preferences = {}) {
    const recipeType = preferences.recipeType || "";
    const count = preferences.count || 5;

    let prompt;

    if (ingredients.length > 0) {
      // Ingredient-based recipe generation
      prompt = `
Create ${count} quick recipes using: ${ingredients.join(", ")}.

Return JSON only:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description (30-50 words)",
      "cuisine": "Italian",
      "difficulty": "easy",
      "prepTime": 15,
      "cookTime": 20,
      "servings": 4,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}`;
    } else {
      // Recipe type based generation (e.g., "pasta", "chicken recipes")
      prompt = `
Create ${count} popular ${recipeType} recipes.

Return JSON only:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description (30-50 words)",
      "cuisine": "Italian",
      "difficulty": "easy",
      "prepTime": 15,
      "cookTime": 20,
      "servings": 4,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}`;
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed;
        }
      } catch (parseError) {
        console.error("Error parsing Gemini JSON response:", parseError);
        console.log("Raw response:", text);
      }

      // Fallback: return empty recipes with raw response for debugging
      return { recipes: [], rawResponse: text };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate recipe suggestions");
    }
  }

  /**
   * Get detailed recipe instructions and tips
   */
  async getDetailedRecipeInstructions(recipeName, ingredients) {
    const prompt = `
Create cooking steps for "${recipeName}" with: ${ingredients.join(", ")}.

JSON format:
{
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "cookingTips": ["Quick tip 1", "Quick tip 2"],
  "servingSuggestions": ["Serving idea"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing Gemini JSON response:", parseError);
      }

      return { instructions: [], rawResponse: text };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get detailed recipe instructions");
    }
  }

  /**
   * Suggest ingredient substitutions
   */
  async suggestSubstitutions(missingIngredients, availableIngredients) {
    const prompt = `
I'm missing these ingredients: ${missingIngredients.join(", ")}
I have these available: ${availableIngredients.join(", ")}

Suggest creative substitutions from my available ingredients or common pantry items.

Format as JSON:
{
  "substitutions": [
    {
      "missing": "ingredient name",
      "substitute": "substitute ingredient",
      "ratio": "1:1",
      "notes": "How this affects the dish"
    }
  ]
}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing Gemini JSON response:", parseError);
      }

      return { substitutions: [], rawResponse: text };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to suggest substitutions");
    }
  }

  /**
   * Generate meal planning suggestions
   */
  async generateMealPlan(ingredients, duration = 7, preferences = {}) {
    const prompt = `
Create ${duration}-day meal plan with: ${ingredients.join(", ")}.

JSON:
{
  "mealPlan": [
    {
      "day": 1,
      "breakfast": "Recipe name",
      "lunch": "Recipe name", 
      "dinner": "Recipe name"
    }
  ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing Gemini JSON response:", parseError);
      }

      return { mealPlan: [], shoppingList: [], rawResponse: text };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate meal plan");
    }
  }

  /**
   * Analyze nutritional content and suggest improvements
   */
  async analyzeNutrition(recipeName, ingredients) {
    const prompt = `
Analyze the nutritional content of "${recipeName}" made with: ${ingredients.join(
      ", "
    )}.

Provide:
1. Estimated nutritional breakdown per serving
2. Health benefits
3. Suggestions to make it healthier
4. Allergen information

Format as JSON:
{
  "nutrition": {
    "calories": 450,
    "protein": "25g",
    "carbs": "30g",
    "fat": "20g",
    "fiber": "5g"
  },
  "healthBenefits": ["benefit1", "benefit2"],
  "improvementSuggestions": ["suggestion1", "suggestion2"],
  "allergens": ["potential allergen1", "potential allergen2"],
  "healthScore": 8.5
}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing Gemini JSON response:", parseError);
      }

      return { nutrition: {}, rawResponse: text };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to analyze nutrition");
    }
  }

  /**
   * Handle general cooking queries
   */
  async askCookingQuestion(question, context = "") {
    const prompt = `
As a professional chef, answer this cooking question: "${question}"

Context: ${context}

Provide a helpful, practical answer with specific tips and techniques.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to answer cooking question");
    }
  }
}

export default GeminiService;
