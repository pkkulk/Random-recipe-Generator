import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    cuisine: {
      type: String,
      enum: [
        "indian",
        "chinese",
        "italian",
        "mexican",
        "thai",
        "japanese",
        "mediterranean",
        "american",
        "french",
        "middle-eastern",
        "other",
      ],
    },
    dietaryRestrictions: [
      {
        type: String,
        enum: [
          "vegetarian",
          "vegan",
          "gluten-free",
          "dairy-free",
          "keto",
          "low-carb",
          "paleo",
        ],
      },
    ],
    cookingTime: {
      prep: Number, // minutes
      cook: Number, // minutes
      total: Number, // minutes
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
    },
    ingredients: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        notes: String, // e.g., "finely chopped", "room temperature"
        isOptional: {
          type: Boolean,
          default: false,
        },
      },
    ],
    instructions: [
      {
        step: {
          type: Number,
          required: true,
        },
        instruction: {
          type: String,
          required: true,
        },
        image: String,
        tips: [String],
      },
    ],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      servings: Number,
    },
    tags: [String],

    // Recipe scoring and popularity metrics
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    popularity: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      saves: {
        type: Number,
        default: 0,
      },
    },

    // SEO and content
    seoTitle: String,
    seoDescription: String,

    // Author info
    author: {
      name: String,
      avatar: String,
      bio: String,
    },

    // Recipe status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better search and query performance
recipeSchema.index({ name: "text", description: "text", tags: "text" });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ "cookingTime.total": 1 });
recipeSchema.index({ dietaryRestrictions: 1 });
recipeSchema.index({ "ratings.average": -1 });
recipeSchema.index({ "popularity.views": -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ slug: 1 });

// Virtual for getting recipe URL
recipeSchema.virtual("url").get(function () {
  return `/recipe/${this.slug}`;
});

// Pre-save middleware to generate slug
recipeSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .trim();
  }

  // Calculate total cooking time
  if (this.cookingTime.prep && this.cookingTime.cook) {
    this.cookingTime.total = this.cookingTime.prep + this.cookingTime.cook;
  }

  next();
});

export default mongoose.model("Recipe", recipeSchema);
