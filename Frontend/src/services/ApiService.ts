// API utility functions for the frontend
// Use Vite env var (VITE_API_URL). Fallback to localhost during dev.
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:5000/api";

class ApiService {
  static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Search methods
  static async searchRecipes(params: {
    query?: string;
    searchType?: "auto" | "ingredients" | "recipe";
    ingredients?: string[];
    availableIngredients?: any[];
    filters?: any;
    page?: number;
    limit?: number;
  }) {
    return this.request("/search/recipes", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  static async smartSearch(params: {
    ingredients?: string[];
    availableIngredients?: any[];
    preferences?: any;
    includeAISuggestions?: boolean;
    limit?: number;
  }) {
    return this.request("/search/smart", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  static async searchIngredients(
    query: string,
    options: {
      category?: string;
      limit?: number;
    } = {}
  ) {
    return this.request("/search/ingredients", {
      method: "POST",
      body: JSON.stringify({ query, ...options }),
    });
  }

  // Recipe methods
  static async getRecipe(id: string) {
    return this.request(`/recipes/${id}`);
  }

  static async getRecipeDetails(
    id: string,
    name?: string,
    ingredients?: any[]
  ) {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (ingredients) params.append("ingredients", JSON.stringify(ingredients));

    const queryString = params.toString();
    const url = `/search/recipe/${id}${queryString ? `?${queryString}` : ""}`;

    return this.request(url);
  }

  static async getRecipeBySlug(slug: string) {
    return this.request(`/recipes/slug/${slug}`);
  }

  static async getPopularRecipes(limit = 12) {
    return this.request(`/recipes/popular?limit=${limit}`);
  }

  static async scoreRecipe(id: string, availableIngredients: any[] = []) {
    return this.request(`/recipes/${id}/score`, {
      method: "POST",
      body: JSON.stringify({ availableIngredients }),
    });
  }

  // Shopping methods
  static async getIngredientPrices(ingredients: any[], location = "Delhi") {
    return this.request("/shopping/prices", {
      method: "POST",
      body: JSON.stringify({ ingredients, location }),
    });
  }

  static async generateShoppingList(
    ingredients: any[],
    location = "Delhi",
    name?: string
  ) {
    return this.request("/shopping/list", {
      method: "POST",
      body: JSON.stringify({ ingredients, location, name }),
    });
  }

  static async getRecipeShoppingList(
    recipeId: string,
    availableIngredients: any[] = [],
    options: {
      location?: string;
      servingAdjustment?: number;
    } = {}
  ) {
    return this.request("/shopping/recipe-list", {
      method: "POST",
      body: JSON.stringify({
        recipeId,
        availableIngredients,
        location: options.location || "Delhi",
        servingAdjustment: options.servingAdjustment || 1,
      }),
    });
  }

  // Ingredient methods
  static async getIngredients(
    params: {
      category?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    return this.request(`/ingredients?${queryParams.toString()}`);
  }

  static async getPopularIngredients(limit = 20, category?: string) {
    const params = category
      ? `?limit=${limit}&category=${category}`
      : `?limit=${limit}`;
    return this.request(`/ingredients/popular${params}`);
  }
}

export default ApiService;
