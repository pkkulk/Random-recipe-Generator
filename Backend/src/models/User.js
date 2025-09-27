import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String,
      location: String,
    },
    preferences: {
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
      favoritesCuisines: [
        {
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
      ],
      cookingLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
      maxCookingTime: {
        type: Number,
        default: 60, // minutes
      },
    },
    pantryItems: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: Number,
        unit: String,
        expiryDate: Date,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    savedRecipes: [
      {
        recipe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
    cookedRecipes: [
      {
        recipe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
        },
        cookedAt: {
          type: Date,
          default: Date.now,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        images: [String],
      },
    ],
    shoppingLists: [
      {
        name: {
          type: String,
          required: true,
        },
        items: [
          {
            ingredient: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Ingredient",
            },
            quantity: Number,
            unit: String,
            purchased: {
              type: Boolean,
              default: false,
            },
            estimatedPrice: Number,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ "pantryItems.ingredient": 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return (
    `${this.profile.firstName || ""} ${this.profile.lastName || ""}`.trim() ||
    this.username
  );
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Get user's pantry ingredients
userSchema.methods.getPantryIngredients = function () {
  return this.pantryItems.map((item) => ({
    ingredient: item.ingredient,
    quantity: item.quantity,
    unit: item.unit,
  }));
};

export default mongoose.model("User", userSchema);
