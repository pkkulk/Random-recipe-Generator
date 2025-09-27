import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "./src/models/Recipe.js";
import Ingredient from "./src/models/Ingredient.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🍖 MongoDB Connected for seeding");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

const sampleIngredients = [
  { name: "tomato", category: "vegetables", aliases: ["tomatoes"] },
  { name: "onion", category: "vegetables", aliases: ["onions"] },
  { name: "garlic", category: "vegetables", aliases: ["garlic clove"] },
  { name: "pasta", category: "grains", aliases: ["spaghetti", "noodles"] },
  {
    name: "chicken",
    category: "proteins",
    aliases: ["chicken breast", "chicken thigh"],
  },
  { name: "rice", category: "grains", aliases: ["basmati rice", "white rice"] },
  { name: "olive oil", category: "oils", aliases: ["extra virgin olive oil"] },
  { name: "salt", category: "condiments", aliases: ["sea salt"] },
  { name: "pepper", category: "spices", aliases: ["black pepper"] },
  { name: "cheese", category: "dairy", aliases: ["parmesan", "mozzarella"] },
];

const seedIngredients = async () => {
  try {
    // Clear existing ingredients
    await Ingredient.deleteMany({});
    console.log("🧹 Cleared existing ingredients");

    // Insert sample ingredients
    const ingredients = await Ingredient.insertMany(sampleIngredients);
    console.log(`✅ Added ${ingredients.length} ingredients`);
    return ingredients;
  } catch (error) {
    console.error("❌ Error seeding ingredients:", error);
  }
};

const seedRecipes = async (ingredients) => {
  try {
    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log("🧹 Cleared existing recipes");

    // Create ingredient ID mapping
    const ingredientMap = {};
    ingredients.forEach((ing) => {
      ingredientMap[ing.name] = ing._id;
    });

    const sampleRecipes = [
      {
        name: "Spaghetti Carbonara",
        slug: "spaghetti-carbonara",
        description:
          "Classic Italian pasta dish with eggs, cheese, and pancetta",
        cuisine: "italian",
        difficulty: "medium",
        cookingTime: { prep: 10, cook: 20, total: 30 },
        servings: 4,
        ingredients: [
          { ingredient: ingredientMap["pasta"], quantity: 400, unit: "g" },
          { ingredient: ingredientMap["cheese"], quantity: 100, unit: "g" },
          { ingredient: ingredientMap["garlic"], quantity: 2, unit: "cloves" },
          { ingredient: ingredientMap["olive oil"], quantity: 2, unit: "tbsp" },
          { ingredient: ingredientMap["salt"], quantity: 1, unit: "tsp" },
          { ingredient: ingredientMap["pepper"], quantity: 1, unit: "tsp" },
        ],
        instructions: [
          {
            step: 1,
            instruction: "Boil pasta according to package instructions",
          },
          { step: 2, instruction: "Mix eggs and cheese in a bowl" },
          { step: 3, instruction: "Cook pancetta until crispy" },
          { step: 4, instruction: "Combine pasta with egg mixture off heat" },
        ],
        tags: ["pasta", "italian", "comfort food"],
        ratings: { average: 4.5, count: 127 },
        popularity: { views: 1250, likes: 89, saves: 34 },
      },
      {
        name: "Chicken Fried Rice",
        slug: "chicken-fried-rice",
        description:
          "Quick and easy fried rice with tender chicken and vegetables",
        cuisine: "chinese",
        difficulty: "easy",
        cookingTime: { prep: 15, cook: 15, total: 30 },
        servings: 3,
        ingredients: [
          { ingredient: ingredientMap["rice"], quantity: 2, unit: "cups" },
          { ingredient: ingredientMap["chicken"], quantity: 300, unit: "g" },
          { ingredient: ingredientMap["onion"], quantity: 1, unit: "medium" },
          { ingredient: ingredientMap["garlic"], quantity: 3, unit: "cloves" },
          { ingredient: ingredientMap["olive oil"], quantity: 3, unit: "tbsp" },
          { ingredient: ingredientMap["salt"], quantity: 1, unit: "tsp" },
          { ingredient: ingredientMap["pepper"], quantity: 0.5, unit: "tsp" },
        ],
        instructions: [
          { step: 1, instruction: "Cook rice and let cool" },
          { step: 2, instruction: "Cut chicken into small pieces" },
          { step: 3, instruction: "Heat oil in wok, cook chicken" },
          { step: 4, instruction: "Add vegetables and rice, stir fry" },
        ],
        tags: ["chicken", "rice", "asian", "quick meal"],
        ratings: { average: 4.2, count: 95 },
        popularity: { views: 890, likes: 67, saves: 28 },
      },
      {
        name: "Tomato Pasta",
        slug: "tomato-pasta",
        description: "Simple and delicious pasta with fresh tomato sauce",
        cuisine: "italian",
        difficulty: "easy",
        cookingTime: { prep: 10, cook: 25, total: 35 },
        servings: 4,
        ingredients: [
          { ingredient: ingredientMap["pasta"], quantity: 400, unit: "g" },
          { ingredient: ingredientMap["tomato"], quantity: 6, unit: "large" },
          { ingredient: ingredientMap["onion"], quantity: 1, unit: "medium" },
          { ingredient: ingredientMap["garlic"], quantity: 4, unit: "cloves" },
          { ingredient: ingredientMap["olive oil"], quantity: 3, unit: "tbsp" },
          { ingredient: ingredientMap["salt"], quantity: 1, unit: "tsp" },
          { ingredient: ingredientMap["pepper"], quantity: 0.5, unit: "tsp" },
        ],
        instructions: [
          { step: 1, instruction: "Chop tomatoes, onion, and garlic" },
          { step: 2, instruction: "Heat olive oil in large pan" },
          { step: 3, instruction: "Sauté onion and garlic until fragrant" },
          { step: 4, instruction: "Add tomatoes and simmer 15 minutes" },
          { step: 5, instruction: "Cook pasta and toss with sauce" },
        ],
        tags: ["pasta", "tomato", "vegetarian", "simple"],
        ratings: { average: 4.0, count: 78 },
        popularity: { views: 654, likes: 45, saves: 22 },
      },
    ];

    const recipes = await Recipe.insertMany(sampleRecipes);
    console.log(`✅ Added ${recipes.length} recipes`);
    return recipes;
  } catch (error) {
    console.error("❌ Error seeding recipes:", error);
  }
};

const seedDatabase = async () => {
  await connectDB();

  console.log("🌱 Starting database seeding...");

  const ingredients = await seedIngredients();
  if (ingredients) {
    await seedRecipes(ingredients);
  }

  console.log("🎉 Database seeding completed!");
  process.exit(0);
};

seedDatabase().catch(console.error);
