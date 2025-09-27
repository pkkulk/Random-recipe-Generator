/**
 * Recipe Scoring Service
 * Calculates recipe scores based on:
 * - Ingredient availability (40%)
 * - Cooking time (30%)
 * - Difficulty level (30%)
 */

class RecipeScorer {
  constructor() {
    // Scoring weights (from environment or defaults)
    this.weights = {
      ingredient: parseFloat(process.env.INGREDIENT_MATCH_WEIGHT) || 0.4,
      time: parseFloat(process.env.TIME_WEIGHT) || 0.3,
      difficulty: parseFloat(process.env.DIFFICULTY_WEIGHT) || 0.3,
    };

    // Difficulty multipliers (easier = higher score)
    this.difficultyMultipliers = {
      easy: 1.0,
      medium: 0.7,
      hard: 0.4,
    };

    // Time scoring thresholds (in minutes)
    this.timeThresholds = {
      quick: 30, // <= 30 mins = quick
      medium: 60, // 31-60 mins = medium
      long: 120, // 61-120 mins = long, >120 = very long
    };
  }

  /**
   * Calculate ingredient match score
   * @param {Array} recipeIngredients - Recipe ingredients with quantities
   * @param {Array} availableIngredients - User's pantry ingredients
   * @returns {Object} - { score, matched, missing, partial }
   */
  calculateIngredientScore(recipeIngredients, availableIngredients) {
    if (!recipeIngredients.length)
      return { score: 0, matched: [], missing: [], partial: [] };

    const availableMap = new Map();
    availableIngredients.forEach((item) => {
      availableMap.set(item.ingredient._id.toString(), {
        quantity: item.quantity,
        unit: item.unit,
      });
    });

    let totalRequired = 0;
    let totalMatched = 0;
    let partialMatched = 0;

    const matched = [];
    const missing = [];
    const partial = [];

    recipeIngredients.forEach((reqIngredient) => {
      const ingredientId = reqIngredient.ingredient._id.toString();
      const available = availableMap.get(ingredientId);

      // Count non-optional ingredients for scoring
      if (!reqIngredient.isOptional) {
        totalRequired++;
      }

      if (available) {
        // Check if we have enough quantity
        const hasEnough = this.checkQuantitySufficiency(
          reqIngredient.quantity,
          reqIngredient.unit,
          available.quantity,
          available.unit
        );

        if (hasEnough) {
          matched.push({
            ingredient: reqIngredient.ingredient,
            required: `${reqIngredient.quantity} ${reqIngredient.unit}`,
            available: `${available.quantity} ${available.unit}`,
          });
          if (!reqIngredient.isOptional) totalMatched++;
        } else {
          partial.push({
            ingredient: reqIngredient.ingredient,
            required: `${reqIngredient.quantity} ${reqIngredient.unit}`,
            available: `${available.quantity} ${available.unit}`,
            shortage: true,
          });
          if (!reqIngredient.isOptional) partialMatched += 0.5; // Partial credit
        }
      } else {
        missing.push({
          ingredient: reqIngredient.ingredient,
          required: `${reqIngredient.quantity} ${reqIngredient.unit}`,
          isOptional: reqIngredient.isOptional,
        });
      }
    });

    // Calculate match percentage
    const matchScore =
      totalRequired > 0 ? (totalMatched + partialMatched) / totalRequired : 0;

    return {
      score: Math.min(matchScore, 1.0), // Cap at 1.0
      matched,
      missing,
      partial,
      stats: {
        totalRequired,
        totalMatched,
        matchPercentage: Math.round(matchScore * 100),
      },
    };
  }

  /**
   * Check if available quantity is sufficient for required quantity
   * (Simplified - in real app, would need unit conversion)
   */
  checkQuantitySufficiency(reqQty, reqUnit, availQty, availUnit) {
    // For now, assume same units or do basic conversions
    if (reqUnit === availUnit) {
      return availQty >= reqQty;
    }

    // Basic unit conversions (extend as needed)
    const conversions = {
      "kg-g": 1000,
      "l-ml": 1000,
      "cup-ml": 250,
      "tbsp-ml": 15,
      "tsp-ml": 5,
    };

    const conversionKey = `${availUnit}-${reqUnit}`;
    const reverseKey = `${reqUnit}-${availUnit}`;

    if (conversions[conversionKey]) {
      return availQty * conversions[conversionKey] >= reqQty;
    } else if (conversions[reverseKey]) {
      return availQty >= reqQty * conversions[reverseKey];
    }

    // If no conversion available, assume they're compatible
    return availQty >= reqQty;
  }

  /**
   * Calculate time score (quicker recipes get higher scores)
   */
  calculateTimeScore(totalTime) {
    if (!totalTime) return 0.5; // Default for missing time data

    if (totalTime <= this.timeThresholds.quick) {
      return 1.0; // Quick recipes get full score
    } else if (totalTime <= this.timeThresholds.medium) {
      return 0.8; // Medium time gets good score
    } else if (totalTime <= this.timeThresholds.long) {
      return 0.6; // Long recipes get okay score
    } else {
      return 0.3; // Very long recipes get low score
    }
  }

  /**
   * Calculate difficulty score (easier recipes get higher scores)
   */
  calculateDifficultyScore(difficulty) {
    return this.difficultyMultipliers[difficulty] || 0.5;
  }

  /**
   * Calculate overall recipe score
   * @param {Object} recipe - Recipe object
   * @param {Array} availableIngredients - User's pantry ingredients
   * @returns {Object} - Complete scoring breakdown
   */
  scoreRecipe(recipe, availableIngredients = []) {
    // Calculate individual scores
    const ingredientResult = this.calculateIngredientScore(
      recipe.ingredients,
      availableIngredients
    );

    const timeScore = this.calculateTimeScore(recipe.cookingTime.total);
    const difficultyScore = this.calculateDifficultyScore(recipe.difficulty);

    // Calculate weighted final score
    const finalScore =
      ingredientResult.score * this.weights.ingredient +
      timeScore * this.weights.time +
      difficultyScore * this.weights.difficulty;

    // Determine if recipe is "makeable" (has most ingredients)
    const isMakeable = ingredientResult.score >= 0.7; // 70% ingredient match
    const needsShopping =
      ingredientResult.missing.length > 0 ||
      ingredientResult.partial.length > 0;

    return {
      recipeId: recipe._id,
      recipeName: recipe.name,
      finalScore: Math.round(finalScore * 100) / 100, // Round to 2 decimals
      percentageScore: Math.round(finalScore * 100),

      // Breakdown
      breakdown: {
        ingredients: {
          score: ingredientResult.score,
          weightedScore: ingredientResult.score * this.weights.ingredient,
          ...ingredientResult,
        },
        time: {
          score: timeScore,
          weightedScore: timeScore * this.weights.time,
          totalMinutes: recipe.cookingTime.total,
          category: this.getTimeCategory(recipe.cookingTime.total),
        },
        difficulty: {
          score: difficultyScore,
          weightedScore: difficultyScore * this.weights.difficulty,
          level: recipe.difficulty,
        },
      },

      // Classification
      classification: {
        isMakeable,
        needsShopping,
        category: isMakeable ? "ready-to-cook" : "needs-ingredients",
      },

      // Recommendations
      recommendations: this.generateRecommendations(ingredientResult, recipe),
    };
  }

  /**
   * Get time category for display
   */
  getTimeCategory(totalTime) {
    if (!totalTime) return "unknown";
    if (totalTime <= this.timeThresholds.quick) return "quick";
    if (totalTime <= this.timeThresholds.medium) return "medium";
    if (totalTime <= this.timeThresholds.long) return "long";
    return "very-long";
  }

  /**
   * Generate helpful recommendations based on scoring
   */
  generateRecommendations(ingredientResult, recipe) {
    const recommendations = [];

    if (ingredientResult.score >= 0.9) {
      recommendations.push(
        "🎯 Perfect match! You have almost everything needed."
      );
    } else if (ingredientResult.score >= 0.7) {
      recommendations.push("✨ Great choice! You're missing just a few items.");
    } else if (ingredientResult.score >= 0.5) {
      recommendations.push(
        "🛒 Shopping trip needed, but worth it for this recipe!"
      );
    } else {
      recommendations.push(
        "🔍 Consider this for your next big cooking adventure."
      );
    }

    if (ingredientResult.missing.length === 1) {
      recommendations.push(
        `📝 You only need: ${ingredientResult.missing[0].ingredient.name}`
      );
    } else if (ingredientResult.missing.length <= 3) {
      const items = ingredientResult.missing
        .map((m) => m.ingredient.name)
        .join(", ");
      recommendations.push(`📝 Missing ingredients: ${items}`);
    }

    if (recipe.difficulty === "easy" && ingredientResult.score >= 0.8) {
      recommendations.push("👶 Perfect for beginners!");
    }

    if (recipe.cookingTime.total <= 30 && ingredientResult.score >= 0.8) {
      recommendations.push("⚡ Quick meal - ready in 30 minutes!");
    }

    return recommendations;
  }

  /**
   * Batch score multiple recipes
   */
  scoreRecipes(recipes, availableIngredients = []) {
    return recipes
      .map((recipe) => this.scoreRecipe(recipe, availableIngredients))
      .sort((a, b) => b.finalScore - a.finalScore); // Sort by score descending
  }
}

export default RecipeScorer;
