import axios from "axios";

const BASE_URL = "http://localhost:5000";

async function testAPI() {
  try {
    console.log("🧪 Testing Pantry Pirate API...\n");

    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health check:", healthResponse.data);

    // Test ingredients endpoint (list with pagination envelope)
    console.log("\n2. Testing ingredients endpoint...");
    const ingredientsResponse = await axios.get(`${BASE_URL}/api/ingredients`);
    console.log(
      "✅ Ingredients response success:",
      ingredientsResponse.data?.success === true
    );
    console.log(
      "   Count:",
      ingredientsResponse.data?.data?.pagination?.totalIngredients ?? "unknown"
    );

    // Test recipes endpoint (list)
    console.log("\n3. Testing recipes endpoint...");
    const recipesResponse = await axios.get(`${BASE_URL}/api/recipes`);
    console.log(
      "✅ Recipes response success:",
      recipesResponse.data?.success === true
    );
    console.log(
      "   Count:",
      recipesResponse.data?.data?.pagination?.totalRecipes ?? "unknown"
    );

    // Test search recipe-by-name
    console.log("\n4. Testing search recipes (by name)...");
    const searchByName = await axios.post(
      `${BASE_URL}/api/search/recipes`,
      {
        query: "pasta",
        searchType: "recipe",
        page: 1,
        limit: 3,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(
      "✅ Search by name success:",
      searchByName.data?.success === true,
      "recipes:",
      searchByName.data?.data?.recipes?.length ?? 0
    );

    // Test search by ingredients (auto parse)
    console.log("\n5. Testing search by ingredients (auto)...");
    const searchByIngredients = await axios.post(
      `${BASE_URL}/api/search/recipes`,
      {
        query: "tomato, onion, garlic",
        searchType: "auto",
        page: 1,
        limit: 3,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(
      "✅ Search by ingredients success:",
      searchByIngredients.data?.success === true,
      "recipes:",
      searchByIngredients.data?.data?.recipes?.length ?? 0
    );

    // Test smart search
    console.log("\n6. Testing smart search...");
    const smartSearch = await axios.post(
      `${BASE_URL}/api/search/smart`,
      {
        ingredients: ["tomato", "onion", "garlic"],
        availableIngredients: [],
        includeAISuggestions: false,
        limit: 3,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(
      "✅ Smart search success:",
      smartSearch.data?.success === true,
      "readyToCook:",
      smartSearch.data?.data?.results?.readyToCook?.count ?? 0,
      "needsIngredients:",
      smartSearch.data?.data?.results?.needsIngredients?.count ?? 0
    );

    console.log("\n🎉 API tests executed.");
  } catch (error) {
    console.error("❌ API test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received.");
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

testAPI();
