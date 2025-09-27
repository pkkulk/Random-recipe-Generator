import React, { useState, useEffect } from "react";
import { Search, Sparkles, Plus, X } from "lucide-react";

const placeholders = [
  "Add ingredients... 'chicken', 'rice', 'tomatoes'...",
  "Type ingredient and press Enter or click +",
  "Discover recipes with your ingredients...",
];

const ingredientSuggestions = Array.from(
  new Set([
    "chicken", "beef", "pork", "fish", "shrimp",
    "rice", "pasta", "bread", "potatoes",
    "tomatoes", "onions", "garlic", "peppers",
    "cheese", "milk", "eggs", "butter",
    "olive oil", "salt", "pepper", "herbs",
    "turmeric", "red chili powder", "ghee", "cumin seeds", "basmati rice", "coriander",
    "paneer", "tomato", "cream", "garam masala", "naan",
    "chickpeas", "ginger", "chole masala", "bhature",
    "toor dal", "dal", "spinach", "cauliflower", "spices",
    "eggplant", "okra", "oil", "kidney beans", "masoor dal",
    "mixed vegetables", "gram flour", "yogurt", "lemon juice", "mustard seeds", "curry leaves",
    "flour", "baking powder", "sugar", "ground beef", "tomato sauce",
    "taco shells", "lettuce", "cheddar cheese", "salsa",
    "basil", "vegetable broth", "peas", "carrots", "soy sauce",
    "romaine lettuce", "croutons", "parmesan cheese", "Caesar dressing",
    "salmon fillets", "lemon", "dill",
    "arborio rice", "mushrooms", "feta cheese", "olives", "red onion",
    "broccoli", "bell peppers"
  ])
);

const SearchBar: React.FC = () => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recipe, setRecipe] = useState<any>(null); // store recipe from backend

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addIngredient = () => {
    const ingredient = searchValue.trim().toLowerCase();
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      setSearchValue("");
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToRemove));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      console.log("No ingredients to search with");
      return;
    }

    setIsAnimating(true);
    setShowSuggestions(false);

    try {
      const res = await fetch("http://localhost:5000/api/search/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();
      if (data.success) {
        setRecipe(data.data); // store returned recipe
        console.log("Recipe received:", data.data);
        const resultsSection = document.getElementById("search-results");
        if (resultsSection) resultsSection.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error("Backend returned failure:", data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const filteredSuggestions = ingredientSuggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(searchValue.toLowerCase()) &&
      !ingredients.includes(suggestion)
  );

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
          <div className="flex items-start gap-4">
            <Search className="w-6 h-6 text-amber-300/80 mt-2 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              {/* Ingredient Chips */}
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-amber-500/90 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md hover:bg-amber-400/90 transition-colors"
                    >
                      <span>{ingredient}</span>
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input & Buttons */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchValue.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (searchValue.trim()) addIngredient();
                      else handleSearch();
                    }
                  }}
                  placeholder={placeholders[currentPlaceholder]}
                  className="flex-1 bg-transparent text-white text-lg placeholder-white/60 outline-none"
                />

                {searchValue.trim() && (
                  <button
                    onClick={addIngredient}
                    className="p-2 bg-amber-500/80 text-white rounded-lg hover:bg-amber-400/80 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={handleSearch}
                  disabled={ingredients.length === 0}
                  className={`px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAnimating ? "animate-bounce" : ""
                  }`}
                >
                  <span>{isAnimating ? "Searching..." : "Set Sail!"}</span>
                  <Sparkles className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-2xl overflow-hidden z-20">
            {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!ingredients.includes(suggestion))
                    setIngredients([...ingredients, suggestion]);
                  setSearchValue("");
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span className="text-gray-800">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Display Recipe */}
      {recipe && (
        <div
          id="search-results"
          className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-md text-white"
        >
          <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
          <h3 className="font-semibold mb-1">Ingredients:</h3>
          <ul className="list-disc ml-5 mb-2">
            {recipe.ingredients.map((ing: string, i: number) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <h3 className="font-semibold mb-1">Instructions:</h3>
          <ol className="list-decimal ml-5">
            {recipe.instructions.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
