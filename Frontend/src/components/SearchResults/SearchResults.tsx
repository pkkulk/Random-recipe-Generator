import React, { useState } from "react";
import { useSearch } from "../../contexts/SearchContext";
import ApiService from "../../services/ApiService";
import RecipeDetailModal from "../RecipeDetailModal/RecipeDetailModal";
import {
  Clock,
  Users,
  Star,
  ChefHat,
  Sparkles,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";

const SearchResults: React.FC = () => {
  const { state: searchState } = useSearch();
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  // Always render container to show loading / error UI

  const {
    isLoading,
    results,
    readyToCook,
    needsIngredients,
    aiSuggestions,
    error,
    lastSearch,
    searchType,
  } = searchState;

  const handleViewRecipe = async (recipe: any) => {
    setLoadingRecipe(true);
    try {
      let detailedRecipe;

      if (recipe._id && recipe._id.startsWith("gemini_")) {
        // Fetch detailed recipe from Gemini
        const response = await ApiService.getRecipeDetails(
          recipe._id,
          recipe.name,
          recipe.ingredients
        );
        detailedRecipe = { ...recipe, ...response.data };
      } else {
        // Use existing recipe data
        detailedRecipe = recipe;
      }

      setSelectedRecipe(detailedRecipe);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch recipe details:", error);
      // Still open modal with basic recipe data
      setSelectedRecipe(recipe);
      setIsModalOpen(true);
    } finally {
      setLoadingRecipe(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  if (isLoading) {
    return (
      <section
        id="search-results"
        className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Searching the Seven Seas...
            </h2>
            <p className="text-gray-600">
              Finding the perfect recipes for your treasure hunt
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="search-results" className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-red-100 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Search Failed
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const totalResults =
    readyToCook.length + needsIngredients.length + results.length;

  if (totalResults === 0) {
    return (
      <section id="search-results" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Treasures Found
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any recipes matching "{lastSearch}"
            </p>
            <p className="text-sm text-gray-500">
              Try different ingredients or recipe names
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="search-results"
      className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Search Results for "{lastSearch}"
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Found {totalResults} treasures in the culinary seas
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {searchType === "ingredients"
                ? "🥕 Ingredient Search"
                : searchType === "recipe"
                ? "🍽️ Recipe Search"
                : "🔍 Smart Search"}
            </span>
          </div>
        </div>

        {/* Ready to Cook Section */}
        {readyToCook.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">
                Ready to Cook ({readyToCook.length})
              </h3>
              <span className="ml-3 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                You have most ingredients!
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyToCook.map((scoredRecipe, index) => (
                <RecipeCard
                  key={index}
                  scoredRecipe={scoredRecipe}
                  type="ready"
                  onViewRecipe={handleViewRecipe}
                  isLoading={loadingRecipe}
                />
              ))}
            </div>
          </div>
        )}

        {/* Needs Ingredients Section */}
        {needsIngredients.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <ShoppingCart className="w-8 h-8 text-amber-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">
                Needs Shopping ({needsIngredients.length})
              </h3>
              <span className="ml-3 text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                Additional ingredients required
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needsIngredients.map((scoredRecipe, index) => (
                <RecipeCard
                  key={index}
                  scoredRecipe={scoredRecipe}
                  type="shopping"
                  onViewRecipe={handleViewRecipe}
                  isLoading={loadingRecipe}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Results (for non-smart search) */}
        {results.length > 0 &&
          readyToCook.length === 0 &&
          needsIngredients.length === 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <ChefHat className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Recipe Results ({results.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((recipe, index) => (
                  <RegularRecipeCard
                    key={index}
                    recipe={recipe}
                    onViewRecipe={handleViewRecipe}
                    isLoading={loadingRecipe}
                  />
                ))}
              </div>
            </div>
          )}

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Sparkles className="w-8 h-8 text-purple-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">
                AI Suggestions ({aiSuggestions.length})
              </h3>
              <span className="ml-3 text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                Generated by AI
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiSuggestions.map((suggestion, index) => (
                <AISuggestionCard
                  key={index}
                  suggestion={suggestion}
                  onViewRecipe={handleViewRecipe}
                  isLoading={loadingRecipe}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

// Recipe card for scored results
const RecipeCard: React.FC<{
  scoredRecipe: any;
  type: "ready" | "shopping";
  onViewRecipe: (recipe: any) => void;
  isLoading: boolean;
}> = ({ scoredRecipe, type, onViewRecipe, isLoading }) => {
  const { recipeName, percentageScore, breakdown } = scoredRecipe;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        {/* Recipe Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
          <ChefHat className="w-16 h-16 text-white opacity-50" />
        </div>

        {/* Score Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white font-bold ${
            type === "ready" ? "bg-green-500" : "bg-amber-500"
          }`}
        >
          {percentageScore}% match
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{recipeName}</h4>

        {/* Recipe Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{breakdown?.time?.totalMinutes || "N/A"} min</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current text-amber-400" />
            <span>{breakdown?.difficulty?.level || "Medium"}</span>
          </div>
        </div>

        {/* Ingredient Match Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Ingredients Match</span>
            <span className="font-semibold">
              {breakdown?.ingredients?.stats?.matchPercentage || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                type === "ready" ? "bg-green-500" : "bg-amber-500"
              }`}
              style={{
                width: `${
                  breakdown?.ingredients?.stats?.matchPercentage || 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Missing Ingredients */}
        {breakdown?.ingredients?.missing?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Missing:</p>
            <div className="flex flex-wrap gap-1">
              {breakdown.ingredients.missing
                .slice(0, 3)
                .map((item: any, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                  >
                    {item.ingredient?.name || item.name}
                  </span>
                ))}
              {breakdown.ingredients.missing.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{breakdown.ingredients.missing.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() =>
            onViewRecipe({
              _id: `scored_${Date.now()}`,
              name: recipeName,
              ...scoredRecipe,
            })
          }
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            type === "ready"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {type === "ready" ? "Cook Now!" : "View Recipe & Shopping"}
        </button>
      </div>
    </div>
  );
};

// Regular recipe card (for non-scored results)
const RegularRecipeCard: React.FC<{
  recipe: any;
  onViewRecipe: (recipe: any) => void;
  isLoading: boolean;
}> = ({ recipe, onViewRecipe, isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <ChefHat className="w-16 h-16 text-white opacity-50" />
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h4>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{recipe.cookingTime?.total || "N/A"} min</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
          {recipe.ratings?.average > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 fill-current text-amber-400" />
              <span>{recipe.ratings.average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onViewRecipe(recipe)}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "View Recipe"}
        </button>
      </div>
    </div>
  );
};

// AI suggestion card
const AISuggestionCard: React.FC<{
  suggestion: any;
  onViewRecipe: (recipe: any) => void;
  isLoading: boolean;
}> = ({ suggestion, onViewRecipe, isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-purple-200">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-white opacity-50" />
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
          AI Generated
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-2">
          {suggestion.name}
        </h4>
        <p className="text-gray-600 mb-4 text-sm">{suggestion.description}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{suggestion.cookingTime?.total || "N/A"} min</span>
          </div>
          <div className="flex items-center">
            <ChefHat className="w-4 h-4 mr-1" />
            <span>{suggestion.difficulty}</span>
          </div>
        </div>

        {/* Used Ingredients */}
        {suggestion.usedIngredients &&
          suggestion.usedIngredients.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Uses your ingredients:
              </p>
              <div className="flex flex-wrap gap-1">
                {suggestion.usedIngredients
                  .slice(0, 3)
                  .map((ingredient: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      {ingredient}
                    </span>
                  ))}
                {suggestion.usedIngredients.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    +{suggestion.usedIngredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

        <button
          onClick={() =>
            onViewRecipe({
              _id: `ai_${Date.now()}`,
              ...suggestion,
            })
          }
          disabled={isLoading}
          className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Generate Full Recipe"}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
