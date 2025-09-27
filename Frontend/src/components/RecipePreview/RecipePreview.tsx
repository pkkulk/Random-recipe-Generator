import React from "react";
import { Clock, Users, Star, ChefHat } from "lucide-react";
import { sampleRecipes } from "../../data/sampleData";

const RecipePreview: React.FC = () => {
  return (
    <section
      id="recipes"
      className="py-20 bg-gradient-to-b from-slate-50/50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Captain's Recommendations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover treasure-worthy recipes that have earned their place in our
            hall of fame. Each one is a culinary adventure waiting to be
            claimed!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleRecipes.map((recipe, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)`,
              }}
            >
              {/* Treasure Map Style Border */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ padding: "2px" }}
              >
                <div className="rounded-2xl bg-white h-full w-full"></div>
              </div>

              {/* Recipe Image Placeholder */}
              <div
                className={`h-48 bg-gradient-to-br ${recipe.gradient} flex items-center justify-center relative overflow-hidden`}
              >
                <ChefHat className="w-16 h-16 text-white/80" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>

                {/* Torn Paper Effect */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-4 bg-white"
                  style={{
                    clipPath:
                      "polygon(0 20%, 10% 0%, 20% 15%, 30% 5%, 40% 20%, 50% 0%, 60% 10%, 70% 0%, 80% 15%, 90% 5%, 100% 20%, 100% 100%, 0% 100%)",
                  }}
                ></div>
              </div>

              <div className="p-6">
                {/* Recipe Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-slate-700 transition-colors">
                  {recipe.name}
                </h3>

                {/* Recipe Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Recipe Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span>{recipe.rating}</span>
                  </div>
                </div>

                {/* Ingredients Preview */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Key Treasures:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{recipe.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-3 bg-gradient-to-r from-slate-700 to-blue-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-blue-900 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Claim This Treasure
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg rounded-2xl hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-xl">
            Explore All Treasures
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecipePreview;
