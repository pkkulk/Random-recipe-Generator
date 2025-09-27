import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        "vegetables",
        "fruits",
        "grains",
        "proteins",
        "dairy",
        "spices",
        "herbs",
        "oils",
        "nuts",
        "legumes",
        "condiments",
        "baking",
        "beverages",
        "other",
      ],
      required: true,
    },
    aliases: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    nutritionalInfo: {
      calories: Number, // per 100g
      protein: Number, // grams per 100g
      carbs: Number, // grams per 100g
      fat: Number, // grams per 100g
      fiber: Number, // grams per 100g
    },
    commonPrices: [
      {
        platform: {
          type: String,
          enum: ["blinkit", "zepto", "swiggy", "bigbasket"],
        },
        price: Number, // price per unit
        unit: String, // kg, liters, pieces, etc.
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    seasonality: [
      {
        month: {
          type: Number,
          min: 1,
          max: 12,
        },
        availability: {
          type: String,
          enum: ["high", "medium", "low"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
ingredientSchema.index({ name: "text", aliases: "text" });
ingredientSchema.index({ category: 1 });

export default mongoose.model("Ingredient", ingredientSchema);
