import express from "express";
import Recipe from "../models/Recipe.js";
import RecipeScorer from "../services/RecipeScorer.js";
import GeminiService from "../services/GeminiService.js";

const router = express.Router();
const recipeScorer = new RecipeScorer();
const geminiService = new GeminiService();

// GET /api/recipes - Get all recipes with optional filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      cuisine,
      difficulty,
      maxTime,
      dietaryRestrictions,
      sortBy = "popularity.views",
      sortOrder = "desc",
    } = req.query;

    // Build query filters
    const filters = { status: "published" };

    if (cuisine) filters.cuisine = cuisine;
    if (difficulty) filters.difficulty = difficulty;
    if (maxTime) filters["cookingTime.total"] = { $lte: parseInt(maxTime) };
    if (dietaryRestrictions) {
      const restrictions = dietaryRestrictions.split(",");
      filters.dietaryRestrictions = { $in: restrictions };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const recipes = await Recipe.find(filters)
      .populate("ingredients.ingredient", "name category")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalRecipes = await Recipe.countDocuments(filters);
    const totalPages = Math.ceil(totalRecipes / parseInt(limit));

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecipes,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipes",
    });
  }
});

// GET /api/recipes/:id - Get single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("ingredients.ingredient", "name category aliases")
      .lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
      });
    }

    // Increment view count
    await Recipe.findByIdAndUpdate(req.params.id, {
      $inc: { "popularity.views": 1 },
    });

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipe",
    });
  }
});

// GET /api/recipes/slug/:slug - Get recipe by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      slug: req.params.slug,
      status: "published",
    })
      .populate("ingredients.ingredient", "name category aliases")
      .lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
      });
    }

    // Increment view count
    await Recipe.findByIdAndUpdate(recipe._id, {
      $inc: { "popularity.views": 1 },
    });

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe by slug:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipe",
    });
  }
});

// POST /api/recipes/:id/score - Score a recipe against user's pantry
router.post("/:id/score", async (req, res) => {
  try {
    const { availableIngredients = [] } = req.body;

    const recipe = await Recipe.findById(req.params.id)
      .populate("ingredients.ingredient", "name category")
      .lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
      });
    }

    const scoreResult = recipeScorer.scoreRecipe(recipe, availableIngredients);

    res.json({
      success: true,
      data: scoreResult,
    });
  } catch (error) {
    console.error("Error scoring recipe:", error);
    res.status(500).json({
      success: false,
      error: "Failed to score recipe",
    });
  }
});

// POST /api/recipes/:id/ai-instructions - Get AI-enhanced instructions
router.post("/:id/ai-instructions", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("ingredients.ingredient", "name")
      .lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
      });
    }

    const ingredients = recipe.ingredients.map((ing) => ing.ingredient.name);
    const aiInstructions = await geminiService.getDetailedRecipeInstructions(
      recipe.name,
      ingredients
    );

    res.json({
      success: true,
      data: {
        recipe: recipe.name,
        aiInstructions,
      },
    });
  } catch (error) {
    console.error("Error getting AI instructions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get AI instructions",
    });
  }
});

// GET /api/recipes/:id/similar - Get similar recipes
router.get("/:id/similar", async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
      });
    }

    // Find similar recipes based on cuisine, tags, and dietary restrictions
    const similarRecipes = await Recipe.find({
      _id: { $ne: recipe._id },
      status: "published",
      $or: [
        { cuisine: recipe.cuisine },
        { tags: { $in: recipe.tags } },
        { dietaryRestrictions: { $in: recipe.dietaryRestrictions } },
      ],
    })
      .populate("ingredients.ingredient", "name category")
      .sort({ "popularity.views": -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: similarRecipes,
    });
  } catch (error) {
    console.error("Error fetching similar recipes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch similar recipes",
    });
  }
});

// POST /api/recipes/:id/rate - Rate a recipe
router.post("/:id/rate", async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
      });
    }

    // Update average rating
    const newCount = recipe.ratings.count + 1;
    const newAverage =
      (recipe.ratings.average * recipe.ratings.count + rating) / newCount;

    await Recipe.findByIdAndUpdate(req.params.id, {
      "ratings.average": Math.round(newAverage * 10) / 10, // Round to 1 decimal
      "ratings.count": newCount,
    });

    res.json({
      success: true,
      data: {
        message: "Rating submitted successfully",
        newAverage: Math.round(newAverage * 10) / 10,
        totalRatings: newCount,
      },
    });
  } catch (error) {
    console.error("Error rating recipe:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit rating",
    });
  }
});

// GET /api/recipes/categories/cuisines - Get all available cuisines
router.get("/categories/cuisines", async (req, res) => {
  try {
    const cuisines = await Recipe.distinct("cuisine", { status: "published" });

    // Get recipe counts for each cuisine
    const cuisineStats = await Recipe.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$cuisine", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: cuisineStats.map((stat) => ({
        cuisine: stat._id,
        count: stat.count,
      })),
    });
  } catch (error) {
    console.error("Error fetching cuisines:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cuisines",
    });
  }
});

// GET /api/recipes/popular - Get popular recipes
router.get("/popular", async (req, res) => {
  try {
    const { limit = 12 } = req.query;

    const popularRecipes = await Recipe.find({ status: "published" })
      .populate("ingredients.ingredient", "name category")
      .sort({
        "popularity.views": -1,
        "ratings.average": -1,
        "ratings.count": -1,
      })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: popularRecipes,
    });
  } catch (error) {
    console.error("Error fetching popular recipes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular recipes",
    });
  }
});

export default router;
