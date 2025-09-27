import ShoppingService from "./src/services/ShoppingService.js";

async function testShopping() {
  console.log("🧪 Testing Web Scraping Shopping Service...\n");

  const shoppingService = new ShoppingService();

  try {
    // Test with common ingredient
    console.log('Testing price scraping for "onion"...');
    const results = await shoppingService.getIngredientPrices([
      { name: "onion", quantity: 1, unit: "kg" },
    ]);

    console.log("✅ Results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testShopping();
