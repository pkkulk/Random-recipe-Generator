import express from "express";
import ShoppingService from "../services/ShoppingService.js";
import Ingredient from "../models/Ingredient.js";

const router = express.Router();
const shoppingService = new ShoppingService();

// POST /api/shopping/prices - Get price comparison for ingredients
router.post("/prices", async (req, res) => {
  try {
    const { ingredients, location = "Delhi" } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Ingredients list is required",
      });
    }

    const priceComparison = await shoppingService.getIngredientPrices(
      ingredients,
      location
    );

    res.json({
      success: true,
      data: priceComparison,
    });
  } catch (error) {
    console.error("Price comparison error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get price comparison",
    });
  }
});

// POST /api/shopping/deals - Get best deals for ingredients
router.post("/deals", async (req, res) => {
  try {
    const { ingredients, location = "Delhi", minSavings = 0 } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Ingredients list is required",
      });
    }

    const deals = await shoppingService.getBestDeals(ingredients, location);

    // Filter by minimum savings if specified
    const filteredDeals =
      minSavings > 0
        ? deals.filter((deal) => deal.savings >= minSavings)
        : deals;

    res.json({
      success: true,
      data: {
        location,
        totalDeals: filteredDeals.length,
        deals: filteredDeals,
      },
    });
  } catch (error) {
    console.error("Deals error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get deals",
    });
  }
});

// POST /api/shopping/list - Generate optimized shopping list
router.post("/list", async (req, res) => {
  try {
    const {
      ingredients,
      location = "Delhi",
      name = "My Shopping List",
    } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Ingredients list is required",
      });
    }

    const shoppingList = await shoppingService.generateOptimizedShoppingList(
      ingredients,
      location
    );

    res.json({
      success: true,
      data: {
        name,
        location,
        createdAt: new Date().toISOString(),
        ...shoppingList,
      },
    });
  } catch (error) {
    console.error("Shopping list error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate shopping list",
    });
  }
});

// POST /api/shopping/recipe-list - Generate shopping list for a specific recipe
router.post("/recipe-list", async (req, res) => {
  try {
    const {
      recipeId,
      availableIngredients = [],
      location = "Delhi",
      servingAdjustment = 1,
    } = req.body;

    if (!recipeId) {
      return res.status(400).json({
        success: false,
        error: "Recipe ID is required",
      });
    }

    // Get recipe details
    const Recipe = (await import("../models/Recipe.js")).default;
    const recipe = await Recipe.findById(recipeId)
      .populate("ingredients.ingredient", "name category")
      .lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
      });
    }

    // Calculate what ingredients are missing
    const availableMap = new Map(
      availableIngredients.map((item) => [
        item.ingredient?.name || item.name,
        { quantity: item.quantity, unit: item.unit },
      ])
    );

    const missingIngredients = [];

    recipe.ingredients.forEach((recipeIng) => {
      const ingredientName = recipeIng.ingredient.name;
      const required = recipeIng.quantity * servingAdjustment;
      const available = availableMap.get(ingredientName);

      if (!available || available.quantity < required) {
        const neededQuantity = available
          ? Math.max(0, required - available.quantity)
          : required;

        if (neededQuantity > 0) {
          missingIngredients.push({
            ingredient: recipeIng.ingredient,
            name: ingredientName,
            quantity: Math.ceil(neededQuantity), // Round up for shopping
            unit: recipeIng.unit,
            notes: recipeIng.notes,
            isOptional: recipeIng.isOptional,
          });
        }
      }
    });

    if (missingIngredients.length === 0) {
      return res.json({
        success: true,
        data: {
          recipe: {
            name: recipe.name,
            id: recipe._id,
          },
          message: "You have all ingredients needed for this recipe!",
          missingIngredients: [],
          shoppingList: null,
        },
      });
    }

    // Generate shopping list for missing ingredients
    const shoppingList = await shoppingService.generateOptimizedShoppingList(
      missingIngredients,
      location
    );

    res.json({
      success: true,
      data: {
        recipe: {
          name: recipe.name,
          id: recipe._id,
          originalServings: recipe.servings,
          adjustedServings: recipe.servings * servingAdjustment,
        },
        missingIngredients,
        shoppingList: {
          name: `Shopping for ${recipe.name}`,
          location,
          createdAt: new Date().toISOString(),
          ...shoppingList,
        },
      },
    });
  } catch (error) {
    console.error("Recipe shopping list error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate recipe shopping list",
    });
  }
});

// GET /api/shopping/platforms - Get available shopping platforms
router.get("/platforms", async (req, res) => {
  try {
    const platforms = Object.entries(shoppingService.platforms).map(
      ([key, platform]) => ({
        id: key,
        name: platform.name,
        color: platform.color,
        isActive: !!platform.apiKey, // Check if API key is configured
      })
    );

    res.json({
      success: true,
      data: platforms,
    });
  } catch (error) {
    console.error("Platforms error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get platforms",
    });
  }
});

// POST /api/shopping/ingredient-availability - Check ingredient availability
router.post("/ingredient-availability", async (req, res) => {
  try {
    const { ingredients, location = "Delhi" } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Ingredients list is required",
      });
    }

    const availability = [];

    for (const ingredient of ingredients) {
      const ingredientName = ingredient.name || ingredient;

      try {
        const prices = await shoppingService.fetchPricesForIngredient(
          ingredientName.toLowerCase(),
          location
        );

        const isAvailable = prices.some(
          (price) => price.availability && price.price > 0
        );
        const averagePrice =
          prices.length > 0
            ? prices.reduce((sum, price) => sum + price.price, 0) /
              prices.length
            : 0;

        availability.push({
          ingredient: ingredientName,
          isAvailable,
          averagePrice: Math.round(averagePrice),
          platforms: prices.filter((p) => p.availability).length,
          lastUpdated: new Date().toISOString(),
        });
      } catch (error) {
        availability.push({
          ingredient: ingredientName,
          isAvailable: false,
          averagePrice: 0,
          platforms: 0,
          error: "Failed to check availability",
        });
      }
    }

    const summary = {
      totalIngredients: ingredients.length,
      availableIngredients: availability.filter((item) => item.isAvailable)
        .length,
      averageAvailability: Math.round(
        (availability.filter((item) => item.isAvailable).length /
          ingredients.length) *
          100
      ),
    };

    res.json({
      success: true,
      data: {
        location,
        summary,
        availability,
      },
    });
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check ingredient availability",
    });
  }
});

// GET /api/shopping/trending - Get trending ingredients and their prices
router.get("/trending", async (req, res) => {
  try {
    const { location = "Delhi", limit = 10 } = req.query;

    // Get popular ingredients from recent recipes
    const Recipe = (await import("../models/Recipe.js")).default;

    const trendingIngredients = await Recipe.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$ingredients" },
      {
        $group: {
          _id: "$ingredients.ingredient",
          count: { $sum: 1 },
          avgQuantity: { $avg: "$ingredients.quantity" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "ingredients",
          localField: "_id",
          foreignField: "_id",
          as: "ingredientInfo",
        },
      },
      { $unwind: "$ingredientInfo" },
    ]);

    // Get prices for trending ingredients
    const ingredientsWithPrices = [];

    for (const item of trendingIngredients) {
      try {
        const prices = await shoppingService.fetchPricesForIngredient(
          item.ingredientInfo.name.toLowerCase(),
          location
        );

        const bestPrice = prices
          .filter((p) => p.availability && p.price > 0)
          .sort((a, b) => a.price - b.price)[0];

        ingredientsWithPrices.push({
          ingredient: {
            name: item.ingredientInfo.name,
            category: item.ingredientInfo.category,
          },
          popularity: item.count,
          averageQuantityUsed: Math.round(item.avgQuantity * 10) / 10,
          bestPrice: bestPrice
            ? {
                price: bestPrice.price,
                unit: bestPrice.unit,
                platform: bestPrice.platform,
                deliveryTime: bestPrice.deliveryTime,
              }
            : null,
        });
      } catch (error) {
        ingredientsWithPrices.push({
          ingredient: {
            name: item.ingredientInfo.name,
            category: item.ingredientInfo.category,
          },
          popularity: item.count,
          averageQuantityUsed: Math.round(item.avgQuantity * 10) / 10,
          bestPrice: null,
        });
      }
    }

    res.json({
      success: true,
      data: {
        location,
        trending: ingredientsWithPrices,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Trending ingredients error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get trending ingredients",
    });
  }
});

export default router;
