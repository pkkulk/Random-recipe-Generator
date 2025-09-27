import mongoose from "mongoose";
import dotenv from "dotenv";
import Ingredient from "../models/Ingredient.js";
import Recipe from "../models/Recipe.js";

dotenv.config();

// Sample ingredients data
const ingredients = [
  // Vegetables
  { name: "onion", category: "vegetables", aliases: ["onions", "pyaz"] },
  { name: "tomato", category: "vegetables", aliases: ["tomatoes", "tamatar"] },
  { name: "potato", category: "vegetables", aliases: ["potatoes", "aloo"] },
  { name: "garlic", category: "vegetables", aliases: ["lahsun"] },
  { name: "ginger", category: "vegetables", aliases: ["adrak"] },
  {
    name: "green chili",
    category: "vegetables",
    aliases: ["green chillies", "hari mirch"],
  },
  {
    name: "bell pepper",
    category: "vegetables",
    aliases: ["capsicum", "shimla mirch"],
  },
  { name: "carrot", category: "vegetables", aliases: ["gajar"] },
  { name: "cabbage", category: "vegetables", aliases: ["patta gobi"] },
  { name: "cauliflower", category: "vegetables", aliases: ["phool gobi"] },

  // Spices
  { name: "cumin seeds", category: "spices", aliases: ["jeera"] },
  { name: "turmeric powder", category: "spices", aliases: ["haldi"] },
  {
    name: "red chili powder",
    category: "spices",
    aliases: ["lal mirch powder"],
  },
  { name: "coriander powder", category: "spices", aliases: ["dhania powder"] },
  {
    name: "garam masala",
    category: "spices",
    aliases: ["garam masala powder"],
  },
  { name: "mustard seeds", category: "spices", aliases: ["rai", "sarson"] },
  { name: "cardamom", category: "spices", aliases: ["elaichi"] },
  { name: "cinnamon", category: "spices", aliases: ["dalchini"] },
  { name: "bay leaves", category: "spices", aliases: ["tej patta"] },
  { name: "asafoetida", category: "spices", aliases: ["hing"] },

  // Herbs
  {
    name: "cilantro",
    category: "herbs",
    aliases: ["coriander leaves", "dhania"],
  },
  { name: "mint", category: "herbs", aliases: ["pudina"] },
  { name: "curry leaves", category: "herbs", aliases: ["kadi patta"] },

  // Dairy
  { name: "milk", category: "dairy", aliases: ["doodh"] },
  { name: "yogurt", category: "dairy", aliases: ["curd", "dahi"] },
  { name: "paneer", category: "dairy", aliases: ["cottage cheese"] },
  { name: "butter", category: "dairy", aliases: ["makhan"] },
  { name: "ghee", category: "dairy", aliases: ["clarified butter"] },

  // Grains
  { name: "rice", category: "grains", aliases: ["chawal", "basmati rice"] },
  {
    name: "wheat flour",
    category: "grains",
    aliases: ["atta", "whole wheat flour"],
  },
  {
    name: "chickpea flour",
    category: "grains",
    aliases: ["besan", "gram flour"],
  },
  { name: "semolina", category: "grains", aliases: ["sooji", "rava"] },

  // Proteins
  { name: "chicken", category: "proteins", aliases: ["murgh"] },
  { name: "mutton", category: "proteins", aliases: ["goat meat", "bakra"] },
  { name: "fish", category: "proteins", aliases: ["machli"] },
  { name: "eggs", category: "proteins", aliases: ["ande"] },

  // Legumes
  { name: "lentils", category: "legumes", aliases: ["dal", "masoor dal"] },
  {
    name: "chickpeas",
    category: "legumes",
    aliases: ["chana", "kabuli chana"],
  },
  { name: "kidney beans", category: "legumes", aliases: ["rajma"] },
  { name: "black lentils", category: "legumes", aliases: ["urad dal"] },
  {
    name: "split pigeon peas",
    category: "legumes",
    aliases: ["toor dal", "arhar dal"],
  },

  // Oils
  { name: "vegetable oil", category: "oils", aliases: ["cooking oil"] },
  { name: "mustard oil", category: "oils", aliases: ["sarson ka tel"] },
  { name: "coconut oil", category: "oils", aliases: ["nariyal ka tel"] },
  { name: "olive oil", category: "oils", aliases: [] },

  // Others
  { name: "salt", category: "condiments", aliases: ["namak"] },
  { name: "sugar", category: "condiments", aliases: ["cheeni"] },
  { name: "jaggery", category: "condiments", aliases: ["gur"] },
  { name: "lemon", category: "fruits", aliases: ["nimbu"] },
  { name: "coconut", category: "fruits", aliases: ["nariyal"] },
];

// Sample recipes
const sampleRecipes = [
  {
    name: "Aloo Gobi",
    description:
      "A classic North Indian dry curry made with potatoes and cauliflower, perfectly spiced and flavorful.",
    cuisine: "indian",
    dietaryRestrictions: ["vegetarian", "vegan", "gluten-free"],
    cookingTime: { prep: 15, cook: 25, total: 40 },
    difficulty: "medium",
    servings: 4,
    instructions: [
      {
        step: 1,
        instruction:
          "Heat oil in a large pan. Add cumin seeds and let them splutter.",
      },
      { step: 2, instruction: "Add onions and cook until golden brown." },
      {
        step: 3,
        instruction:
          "Add ginger-garlic paste and green chilies. Cook for 2 minutes.",
      },
      { step: 4, instruction: "Add tomatoes and cook until they break down." },
      { step: 5, instruction: "Add all the spices and cook for 1 minute." },
      { step: 6, instruction: "Add potatoes and cauliflower. Mix well." },
      {
        step: 7,
        instruction:
          "Cover and cook for 15-20 minutes until vegetables are tender.",
      },
      { step: 8, instruction: "Garnish with cilantro and serve hot." },
    ],
    tags: ["indian", "vegetarian", "spicy", "comfort food"],
    images: [
      {
        url: "https://example.com/aloo-gobi.jpg",
        alt: "Delicious Aloo Gobi curry",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Dal Tadka",
    description:
      "Comfort food at its best - yellow lentils cooked with aromatic spices and finished with a flavorful tempering.",
    cuisine: "indian",
    dietaryRestrictions: ["vegetarian", "vegan", "gluten-free"],
    cookingTime: { prep: 10, cook: 30, total: 40 },
    difficulty: "easy",
    servings: 4,
    instructions: [
      {
        step: 1,
        instruction:
          "Wash and cook lentils with turmeric in a pressure cooker.",
      },
      {
        step: 2,
        instruction: "In a separate pan, heat ghee. Add cumin seeds.",
      },
      { step: 3, instruction: "Add onions and cook until golden." },
      { step: 4, instruction: "Add ginger-garlic paste and tomatoes." },
      {
        step: 5,
        instruction: "Add spices and cooked dal. Simmer for 10 minutes.",
      },
      {
        step: 6,
        instruction: "For tadka: heat ghee, add cumin, and pour over dal.",
      },
      { step: 7, instruction: "Garnish with cilantro and serve with rice." },
    ],
    tags: ["indian", "vegetarian", "protein-rich", "comfort food"],
    images: [
      {
        url: "https://example.com/dal-tadka.jpg",
        alt: "Creamy Dal Tadka with rice",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Paneer Butter Masala",
    description:
      "Rich and creamy tomato-based curry with soft paneer cubes, perfect with naan or rice.",
    cuisine: "indian",
    dietaryRestrictions: ["vegetarian", "gluten-free"],
    cookingTime: { prep: 20, cook: 25, total: 45 },
    difficulty: "medium",
    servings: 4,
    instructions: [
      { step: 1, instruction: "Cut paneer into cubes and lightly fry them." },
      {
        step: 2,
        instruction: "Make a paste of tomatoes, onions, and cashews.",
      },
      {
        step: 3,
        instruction: "Cook the paste with spices until oil separates.",
      },
      { step: 4, instruction: "Add cream and simmer the gravy." },
      { step: 5, instruction: "Add fried paneer and simmer for 5 minutes." },
      { step: 6, instruction: "Finish with butter and fresh cilantro." },
    ],
    tags: ["indian", "vegetarian", "creamy", "restaurant-style"],
    images: [
      {
        url: "https://example.com/paneer-butter-masala.jpg",
        alt: "Creamy Paneer Butter Masala",
        isPrimary: true,
      },
    ],
  },
];

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/pantry-pirate"
    );
    console.log("🍖 Connected to MongoDB");

    // Clear existing data
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Insert ingredients
    const insertedIngredients = await Ingredient.insertMany(ingredients);
    console.log(`🥕 Inserted ${insertedIngredients.length} ingredients`);

    // Create ingredient name to ID mapping
    const ingredientMap = {};
    insertedIngredients.forEach((ingredient) => {
      ingredientMap[ingredient.name] = ingredient._id;
    });

    // Add ingredients to recipes
    const recipesWithIngredients = sampleRecipes.map((recipe) => {
      let recipeIngredients = [];

      if (recipe.name === "Aloo Gobi") {
        recipeIngredients = [
          { ingredient: ingredientMap["potato"], quantity: 500, unit: "g" },
          {
            ingredient: ingredientMap["cauliflower"],
            quantity: 500,
            unit: "g",
          },
          { ingredient: ingredientMap["onion"], quantity: 1, unit: "medium" },
          { ingredient: ingredientMap["tomato"], quantity: 2, unit: "medium" },
          {
            ingredient: ingredientMap["ginger"],
            quantity: 1,
            unit: "inch piece",
          },
          { ingredient: ingredientMap["garlic"], quantity: 4, unit: "cloves" },
          {
            ingredient: ingredientMap["green chili"],
            quantity: 2,
            unit: "pieces",
          },
          {
            ingredient: ingredientMap["cumin seeds"],
            quantity: 1,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["turmeric powder"],
            quantity: 0.5,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["red chili powder"],
            quantity: 1,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["coriander powder"],
            quantity: 1,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["garam masala"],
            quantity: 0.5,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["vegetable oil"],
            quantity: 3,
            unit: "tbsp",
          },
          { ingredient: ingredientMap["salt"], quantity: 1, unit: "tsp" },
          {
            ingredient: ingredientMap["cilantro"],
            quantity: 2,
            unit: "tbsp",
            isOptional: true,
          },
        ];
      } else if (recipe.name === "Dal Tadka") {
        recipeIngredients = [
          { ingredient: ingredientMap["lentils"], quantity: 200, unit: "g" },
          { ingredient: ingredientMap["onion"], quantity: 1, unit: "medium" },
          { ingredient: ingredientMap["tomato"], quantity: 2, unit: "medium" },
          {
            ingredient: ingredientMap["ginger"],
            quantity: 1,
            unit: "inch piece",
          },
          { ingredient: ingredientMap["garlic"], quantity: 3, unit: "cloves" },
          {
            ingredient: ingredientMap["green chili"],
            quantity: 2,
            unit: "pieces",
          },
          {
            ingredient: ingredientMap["cumin seeds"],
            quantity: 1,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["turmeric powder"],
            quantity: 0.5,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["red chili powder"],
            quantity: 0.5,
            unit: "tsp",
          },
          { ingredient: ingredientMap["ghee"], quantity: 2, unit: "tbsp" },
          { ingredient: ingredientMap["salt"], quantity: 1, unit: "tsp" },
          {
            ingredient: ingredientMap["cilantro"],
            quantity: 2,
            unit: "tbsp",
            isOptional: true,
          },
        ];
      } else if (recipe.name === "Paneer Butter Masala") {
        recipeIngredients = [
          { ingredient: ingredientMap["paneer"], quantity: 400, unit: "g" },
          { ingredient: ingredientMap["onion"], quantity: 2, unit: "medium" },
          { ingredient: ingredientMap["tomato"], quantity: 4, unit: "medium" },
          {
            ingredient: ingredientMap["ginger"],
            quantity: 1,
            unit: "inch piece",
          },
          { ingredient: ingredientMap["garlic"], quantity: 4, unit: "cloves" },
          {
            ingredient: ingredientMap["green chili"],
            quantity: 2,
            unit: "pieces",
          },
          {
            ingredient: ingredientMap["red chili powder"],
            quantity: 1,
            unit: "tsp",
          },
          {
            ingredient: ingredientMap["garam masala"],
            quantity: 1,
            unit: "tsp",
          },
          { ingredient: ingredientMap["butter"], quantity: 2, unit: "tbsp" },
          { ingredient: ingredientMap["milk"], quantity: 100, unit: "ml" },
          { ingredient: ingredientMap["salt"], quantity: 1, unit: "tsp" },
          {
            ingredient: ingredientMap["cilantro"],
            quantity: 2,
            unit: "tbsp",
            isOptional: true,
          },
        ];
      }

      return {
        ...recipe,
        ingredients: recipeIngredients,
        ratings: {
          average: Math.random() * 2 + 3,
          count: Math.floor(Math.random() * 50) + 10,
        }, // Random ratings 3-5
        popularity: {
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 200) + 10,
        },
      };
    });

    // Insert recipes
    const insertedRecipes = await Recipe.insertMany(recipesWithIngredients);
    console.log(`🍽️ Inserted ${insertedRecipes.length} recipes`);

    console.log("🎉 Database seeded successfully!");
    console.log("✨ You can now start the server and test the APIs");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
}

// Run the seeder
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
