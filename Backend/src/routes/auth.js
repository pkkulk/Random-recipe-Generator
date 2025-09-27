import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register - Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, profile = {} } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Username, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profile,
      lastLogin: new Date(),
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    // Return user data (without password)
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      preferences: user.preferences,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      data: {
        user: userData,
        token,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
});

// POST /api/auth/login - User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    // Return user data (without password)
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      preferences: user.preferences,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      lastLogin: user.lastLogin,
    };

    res.json({
      success: true,
      data: {
        user: userData,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

// GET /api/auth/profile - Get user profile (protected route)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("pantryItems.ingredient", "name category")
      .populate("savedRecipes.recipe", "name images cookingTime difficulty")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove sensitive information
    delete user.password;

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { profile, preferences } = req.body;

    const updateData = {};
    if (profile) updateData.profile = { ...profile };
    if (preferences) updateData.preferences = { ...preferences };

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    res.json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    });
  }
});

// POST /api/auth/pantry - Add ingredients to pantry
router.post("/pantry", authenticateToken, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        error: "Ingredients array is required",
      });
    }

    const user = await User.findById(req.userId);

    // Add new ingredients to pantry
    ingredients.forEach((ingredient) => {
      const existingIndex = user.pantryItems.findIndex(
        (item) => item.ingredient.toString() === ingredient.ingredient
      );

      if (existingIndex >= 0) {
        // Update existing ingredient
        user.pantryItems[existingIndex] = {
          ...user.pantryItems[existingIndex],
          ...ingredient,
          addedAt: new Date(),
        };
      } else {
        // Add new ingredient
        user.pantryItems.push({
          ...ingredient,
          addedAt: new Date(),
        });
      }
    });

    await user.save();

    // Populate and return updated pantry
    const updatedUser = await User.findById(req.userId)
      .populate("pantryItems.ingredient", "name category")
      .lean();

    res.json({
      success: true,
      data: updatedUser.pantryItems,
      message: "Pantry updated successfully",
    });
  } catch (error) {
    console.error("Pantry update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update pantry",
    });
  }
});

// DELETE /api/auth/pantry/:ingredientId - Remove ingredient from pantry
router.delete("/pantry/:ingredientId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.pantryItems = user.pantryItems.filter(
      (item) => item.ingredient.toString() !== req.params.ingredientId
    );

    await user.save();

    res.json({
      success: true,
      message: "Ingredient removed from pantry",
    });
  } catch (error) {
    console.error("Pantry remove error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove ingredient from pantry",
    });
  }
});

// POST /api/auth/saved-recipes - Save a recipe
router.post("/saved-recipes", authenticateToken, async (req, res) => {
  try {
    const { recipeId, notes } = req.body;

    const user = await User.findById(req.userId);

    // Check if already saved
    const existingIndex = user.savedRecipes.findIndex(
      (item) => item.recipe.toString() === recipeId
    );

    if (existingIndex >= 0) {
      return res.status(400).json({
        success: false,
        error: "Recipe already saved",
      });
    }

    user.savedRecipes.push({
      recipe: recipeId,
      notes: notes || "",
      savedAt: new Date(),
    });

    await user.save();

    res.json({
      success: true,
      message: "Recipe saved successfully",
    });
  } catch (error) {
    console.error("Save recipe error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save recipe",
    });
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: "Invalid or expired token",
        });
      }

      req.userId = user.userId;
      req.username = user.username;
      next();
    }
  );
}

export default router;
