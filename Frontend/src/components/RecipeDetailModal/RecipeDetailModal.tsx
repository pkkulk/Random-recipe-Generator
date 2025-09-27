import React, { useState } from "react";
import {
  X,
  Clock,
  Users,
  ChefHat,
  Star,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";

interface RecipeDetailModalProps {
  recipe: any;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "instructions" | "ingredients" | "tips"
  >("instructions");

  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center rounded-t-2xl">
            <ChefHat className="w-24 h-24 text-white opacity-50" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Recipe Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
            <p className="text-white/90 text-lg">{recipe.description}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Recipe Stats */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {recipe.cookingTime?.total ||
                  recipe.prepTime + recipe.cookTime ||
                  "N/A"}{" "}
                min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>{recipe.cuisine}</span>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: "instructions", label: "Instructions" },
              { id: "ingredients", label: "Ingredients" },
              { id: "tips", label: "Tips" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "instructions" && (
              <div className="space-y-4">
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  recipe.instructions.map((instruction: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {instruction.step || index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">
                          {instruction.instruction || instruction}
                        </p>
                        {instruction.time && (
                          <p className="text-sm text-gray-500 mt-1">
                            ⏱️ {instruction.time} minutes
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Instructions will be generated when you select this recipe
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="grid md:grid-cols-2 gap-4">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ingredient: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <span className="font-medium">
                          {ingredient.name || ingredient}
                        </span>
                        {ingredient.quantity && ingredient.unit && (
                          <span className="text-gray-600 ml-2">
                            ({ingredient.quantity} {ingredient.unit})
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Ingredient list will be generated with detailed recipe
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tips" && (
              <div className="space-y-4">
                {recipe.cookingTips && recipe.cookingTips.length > 0 ? (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">
                        Cooking Tips
                      </h3>
                      <ul className="space-y-2">
                        {recipe.cookingTips.map(
                          (tip: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <Star className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {recipe.commonMistakes &&
                      recipe.commonMistakes.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            Common Mistakes to Avoid
                          </h3>
                          <ul className="space-y-2">
                            {recipe.commonMistakes.map(
                              (mistake: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span>{mistake}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Pro tips and tricks will be provided with detailed recipe
                      instructions
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Start Cooking
            </button>
            <button className="flex-1 py-3 px-6 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">
              Add to Shopping List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
