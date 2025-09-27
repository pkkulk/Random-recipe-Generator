import express from "express";
import Ingredient from "../models/Ingredient.js";

const router = express.Router();

// GET /api/ingredients - Get all ingredients with optional filtering
router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 50,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    // Build query filters
    const filters = {};

    if (category) filters.category = category;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { aliases: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const ingredients = await Ingredient.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalIngredients = await Ingredient.countDocuments(filters);
    const totalPages = Math.ceil(totalIngredients / parseInt(limit));

    res.json({
      success: true,
      data: {
        ingredients,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalIngredients,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch ingredients",
    });
  }
});

// GET /api/ingredients/categories - Get all ingredient categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Ingredient.distinct("category");

    // Get ingredient counts for each category
    const categoryStats = await Ingredient.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: categoryStats.map((stat) => ({
        category: stat._id,
        count: stat.count,
      })),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
    });
  }
});

// GET /api/ingredients/:id - Get single ingredient
router.get("/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id).lean();

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        error: "Ingredient not found",
      });
    }

    res.json({
      success: true,
      data: ingredient,
    });
  } catch (error) {
    console.error("Error fetching ingredient:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch ingredient",
    });
  }
});

// POST /api/ingredients/search - Advanced ingredient search
router.post("/search", async (req, res) => {
  try {
    const { query, categories, limit = 20 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const filters = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { aliases: { $regex: query, $options: "i" } },
      ],
    };

    if (categories && categories.length > 0) {
      filters.category = { $in: categories };
    }

    const ingredients = await Ingredient.find(filters)
      .limit(parseInt(limit))
      .sort({ name: 1 })
      .lean();

    res.json({
      success: true,
      data: {
        query,
        categories: categories || [],
        results: ingredients,
        count: ingredients.length,
      },
    });
  } catch (error) {
    console.error("Error searching ingredients:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search ingredients",
    });
  }
});

// GET /api/ingredients/popular - Get popular ingredients
router.get("/popular", async (req, res) => {
  try {
    const { limit = 20, category } = req.query;

    // This would typically be based on usage in recipes
    // For now, we'll return ingredients sorted by name as a placeholder
    const Recipe = (await import("../models/Recipe.js")).default;

    const popularIngredients = await Recipe.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$ingredients" },
      ...(category
        ? [
            {
              $lookup: {
                from: "ingredients",
                localField: "ingredients.ingredient",
                foreignField: "_id",
                as: "ingredientInfo",
              },
            },
            { $match: { "ingredientInfo.category": category } },
          ]
        : []),
      {
        $group: {
          _id: "$ingredients.ingredient",
          usageCount: { $sum: 1 },
        },
      },
      { $sort: { usageCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "ingredients",
          localField: "_id",
          foreignField: "_id",
          as: "ingredient",
        },
      },
      { $unwind: "$ingredient" },
      {
        $project: {
          _id: "$ingredient._id",
          name: "$ingredient.name",
          category: "$ingredient.category",
          aliases: "$ingredient.aliases",
          usageCount: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: popularIngredients,
    });
  } catch (error) {
    console.error("Error fetching popular ingredients:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular ingredients",
    });
  }
});

// POST /api/ingredients/match - Match ingredient names to database entries
router.post("/match", async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        error: "Ingredients array is required",
      });
    }

    const matches = [];

    for (const ingredientName of ingredients) {
      const ingredient = await Ingredient.findOne({
        $or: [
          { name: { $regex: `^${ingredientName.trim()}$`, $options: "i" } },
          { aliases: { $regex: `^${ingredientName.trim()}$`, $options: "i" } },
        ],
      }).lean();

      matches.push({
        input: ingredientName,
        match: ingredient,
        found: !!ingredient,
      });
    }

    const stats = {
      total: ingredients.length,
      matched: matches.filter((m) => m.found).length,
      unmatched: matches.filter((m) => !m.found).length,
    };

    res.json({
      success: true,
      data: {
        matches,
        stats,
      },
    });
  } catch (error) {
    console.error("Error matching ingredients:", error);
    res.status(500).json({
      success: false,
      error: "Failed to match ingredients",
    });
  }
});

export default router;
