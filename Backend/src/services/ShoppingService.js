import axios from "axios";
import * as cheerio from "cheerio";

class ShoppingService {
  constructor() {
    this.platforms = {
      blinkit: {
        name: "Blinkit",
        baseUrl: "https://blinkit.com",
        searchUrl: "https://blinkit.com/s/?q=",
        color: "#e23744",
        selectors: {
          productCard: ".Product__UpdatedC",
          name: ".Product__UpdatedTitle",
          price: ".Product__UpdatedPrice",
          unit: ".Product__UpdatedQuantity",
        },
      },
      zepto: {
        name: "Zepto",
        baseUrl: "https://www.zeptonow.com",
        searchUrl: "https://www.zeptonow.com/search?query=",
        color: "#4b0082",
        selectors: {
          productCard: '[data-testid="product-card"]',
          name: '[data-testid="product-name"]',
          price: '[data-testid="product-price"]',
          unit: '[data-testid="product-unit"]',
        },
      },
      swiggy: {
        name: "Swiggy Instamart",
        baseUrl: "https://www.swiggy.com/instamart",
        searchUrl:
          "https://www.swiggy.com/instamart/search?custom_back=true&query=",
        color: "#ff6600",
        selectors: {
          productCard: '[data-testid="item-card"]',
          name: '[data-testid="item-name"]',
          price: '[data-testid="item-price"]',
          unit: '[data-testid="item-quantity"]',
        },
      },
    };

    this.requestConfig = {
      timeout: parseInt(process.env.SCRAPING_TIMEOUT) || 10000,
      headers: {
        "User-Agent":
          process.env.USER_AGENT ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    };

    // Mock data for demonstration (since actual APIs require partnerships)
    this.mockPrices = {
      // Vegetables
      onion: [
        {
          platform: "blinkit",
          price: 25,
          unit: "kg",
          availability: true,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 28,
          unit: "kg",
          availability: true,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 30,
          unit: "kg",
          availability: true,
          deliveryTime: "15-20 min",
        },
      ],
      tomato: [
        {
          platform: "blinkit",
          price: 40,
          unit: "kg",
          availability: true,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 38,
          unit: "kg",
          availability: true,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 42,
          unit: "kg",
          availability: true,
          deliveryTime: "15-20 min",
        },
      ],
      potato: [
        {
          platform: "blinkit",
          price: 20,
          unit: "kg",
          availability: true,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 22,
          unit: "kg",
          availability: true,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 25,
          unit: "kg",
          availability: true,
          deliveryTime: "15-20 min",
        },
      ],
      // Spices
      "cumin seeds": [
        {
          platform: "blinkit",
          price: 180,
          unit: "100g",
          availability: true,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 175,
          unit: "100g",
          availability: true,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 185,
          unit: "100g",
          availability: true,
          deliveryTime: "15-20 min",
        },
      ],
      "turmeric powder": [
        {
          platform: "blinkit",
          price: 80,
          unit: "100g",
          availability: true,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 75,
          unit: "100g",
          availability: true,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 85,
          unit: "100g",
          availability: true,
          deliveryTime: "15-20 min",
        },
      ],
      // Dairy
      milk: [
        {
          platform: "blinkit",
          price: 60,
          unit: "1L",
          availability: true,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 58,
          unit: "1L",
          availability: true,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 62,
          unit: "1L",
          availability: true,
          deliveryTime: "15-20 min",
        },
      ],
      paneer: [
        {
          platform: "blinkit",
          price: 120,
          unit: "200g",
          availability: true,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 115,
          unit: "200g",
          availability: true,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 125,
          unit: "200g",
          availability: true,
          deliveryTime: "15-20 min",
        },
      ],
      // Default for unknown ingredients
      default: [
        {
          platform: "blinkit",
          price: 0,
          unit: "item",
          availability: false,
          deliveryTime: "10-15 min",
        },
        {
          platform: "zepto",
          price: 0,
          unit: "item",
          availability: false,
          deliveryTime: "10 min",
        },
        {
          platform: "swiggy",
          price: 0,
          unit: "item",
          availability: false,
          deliveryTime: "15-20 min",
        },
      ],
    };
  }

  /**
   * Get price comparison for a list of ingredients
   */
  async getIngredientPrices(ingredients, location = "Delhi") {
    const results = [];

    for (const ingredient of ingredients) {
      const ingredientName =
        ingredient.ingredient?.name || ingredient.name || ingredient;
      const quantity = ingredient.quantity || 1;
      const unit = ingredient.unit || "item";

      try {
        // In a real implementation, this would call actual APIs
        const prices = await this.fetchPricesForIngredient(
          ingredientName.toLowerCase(),
          location
        );

        results.push({
          ingredient: ingredientName,
          requestedQuantity: quantity,
          requestedUnit: unit,
          prices: prices.map((price) => ({
            ...price,
            platformInfo: this.platforms[price.platform],
            totalCost: this.calculateTotalCost(
              price.price,
              price.unit,
              quantity,
              unit
            ),
            savings: null, // Will be calculated later
          })),
        });
      } catch (error) {
        console.error(`Error fetching prices for ${ingredientName}:`, error);
        results.push({
          ingredient: ingredientName,
          requestedQuantity: quantity,
          requestedUnit: unit,
          prices: [],
          error: "Price data unavailable",
        });
      }
    }

    // Calculate savings opportunities
    results.forEach((item) => {
      if (item.prices.length > 1) {
        const sortedPrices = item.prices.sort(
          (a, b) => a.totalCost - b.totalCost
        );
        const cheapest = sortedPrices[0];
        const mostExpensive = sortedPrices[sortedPrices.length - 1];

        item.prices.forEach((price) => {
          price.savings = mostExpensive.totalCost - price.totalCost;
          price.isLowest = price.totalCost === cheapest.totalCost;
          price.isHighest = price.totalCost === mostExpensive.totalCost;
        });
      }
    });

    return {
      location,
      ingredients: results,
      summary: this.generatePriceSummary(results),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Scrape ingredient price from a specific platform
   */
  async scrapeIngredientPrice(platform, ingredientName) {
    try {
      const config = this.platforms[platform];
      if (!config) {
        throw new Error(`Platform ${platform} not configured`);
      }

      const searchUrl = `${config.searchUrl}${encodeURIComponent(
        ingredientName
      )}`;

      console.log(`🔍 Scraping ${config.name} for: ${ingredientName}`);

      // For now, we'll use a fallback approach since scraping can be unreliable
      // In a real implementation, you'd use puppeteer or similar

      const response = await axios.get(searchUrl, {
        ...this.requestConfig,
        validateStatus: function (status) {
          return status < 500; // Accept 404 and similar as valid responses
        },
      });

      if (response.status !== 200) {
        console.warn(
          `⚠️  ${config.name} returned status ${response.status} for ${ingredientName}`
        );
        return this.generateFallbackPrice(platform, ingredientName);
      }

      // Load HTML and extract data
      const $ = cheerio.load(response.data);
      const products = [];

      // Try to find product cards
      $(config.selectors.productCard).each((index, element) => {
        if (index >= 3) return false; // Limit to first 3 results

        const name = $(element).find(config.selectors.name).text().trim();
        const priceText = $(element).find(config.selectors.price).text().trim();
        const unitText = $(element).find(config.selectors.unit).text().trim();

        // Extract price from text (handle ₹ symbol and various formats)
        const priceMatch = priceText.match(/₹?\s*(\d+(?:\.\d{2})?)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

        if (name && price > 0) {
          products.push({
            name,
            price,
            unit: unitText || "item",
            platform,
            availability: true,
            deliveryTime: this.getDeliveryTime(platform),
            lastUpdated: new Date().toISOString(),
          });
        }
      });

      // If no products found through scraping, return fallback
      if (products.length === 0) {
        console.warn(
          `⚠️  No products found for ${ingredientName} on ${config.name}, using fallback`
        );
        return this.generateFallbackPrice(platform, ingredientName);
      }

      return products[0]; // Return best match
    } catch (error) {
      console.error(
        `❌ Error scraping ${platform} for ${ingredientName}:`,
        error.message
      );
      return this.generateFallbackPrice(platform, ingredientName);
    }
  }

  /**
   * Generate fallback price when scraping fails
   */
  generateFallbackPrice(platform, ingredientName) {
    // Use mock data as fallback
    const mockData =
      this.mockPrices[ingredientName.toLowerCase()] ||
      this.mockPrices["default"];
    const platformData =
      mockData.find((item) => item.platform === platform) || mockData[0];

    return {
      ...platformData,
      isFallback: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get standard delivery time for platform
   */
  getDeliveryTime(platform) {
    const deliveryTimes = {
      blinkit: "10-15 min",
      zepto: "10 min",
      swiggy: "15-20 min",
    };
    return deliveryTimes[platform] || "15-20 min";
  }

  /**
   * Fetch prices for a specific ingredient using web scraping with fallback
   */
  async fetchPricesForIngredient(ingredientName, location) {
    const results = [];
    const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_SCRAPES) || 3;

    // Try scraping all platforms concurrently
    const scrapingPromises = Object.keys(this.platforms).map(
      async (platform) => {
        try {
          const result = await this.scrapeIngredientPrice(
            platform,
            ingredientName
          );
          return result;
        } catch (error) {
          console.error(`Error scraping ${platform}:`, error.message);
          return this.generateFallbackPrice(platform, ingredientName);
        }
      }
    );

    const scrapedResults = await Promise.allSettled(scrapingPromises);

    scrapedResults.forEach((result, index) => {
      const platform = Object.keys(this.platforms)[index];
      if (result.status === "fulfilled" && result.value) {
        results.push(result.value);
      } else {
        // Use fallback data
        results.push(this.generateFallbackPrice(platform, ingredientName));
      }
    });

    return results;
  }

  /**
   * Calculate total cost based on different units
   */
  calculateTotalCost(
    pricePerUnit,
    priceUnit,
    requestedQuantity,
    requestedUnit
  ) {
    // Simplified unit conversion - in real app, need comprehensive unit conversion
    const conversionFactors = {
      "kg-g": 0.001,
      "g-kg": 1000,
      "l-ml": 0.001,
      "ml-l": 1000,
      "1L-ml": 1000,
      "ml-1L": 0.001,
    };

    if (priceUnit === requestedUnit) {
      return Math.round(pricePerUnit * requestedQuantity);
    }

    const conversionKey = `${requestedUnit}-${priceUnit}`;
    const factor = conversionFactors[conversionKey];

    if (factor) {
      return Math.round(pricePerUnit * requestedQuantity * factor);
    }

    // Default calculation if no conversion available
    return Math.round(pricePerUnit * requestedQuantity);
  }

  /**
   * Generate price comparison summary
   */
  generatePriceSummary(results) {
    let totalItems = results.length;
    let itemsWithPrices = results.filter(
      (item) => item.prices.length > 0
    ).length;
    let totalCostsByPlatform = {};
    let availabilityByPlatform = {};

    // Initialize platform summaries
    Object.keys(this.platforms).forEach((platform) => {
      totalCostsByPlatform[platform] = 0;
      availabilityByPlatform[platform] = 0;
    });

    results.forEach((item) => {
      item.prices.forEach((price) => {
        if (price.availability && price.totalCost > 0) {
          totalCostsByPlatform[price.platform] += price.totalCost;
          availabilityByPlatform[price.platform]++;
        }
      });
    });

    // Find best platform
    let bestPlatform = null;
    let lowestTotalCost = Infinity;

    Object.entries(totalCostsByPlatform).forEach(([platform, cost]) => {
      if (cost > 0 && cost < lowestTotalCost) {
        lowestTotalCost = cost;
        bestPlatform = platform;
      }
    });

    return {
      totalItems,
      itemsWithPrices,
      totalCostsByPlatform,
      availabilityByPlatform,
      bestPlatform: bestPlatform
        ? {
            name: bestPlatform,
            totalCost: lowestTotalCost,
            ...this.platforms[bestPlatform],
          }
        : null,
      averageSavings: this.calculateAverageSavings(results),
    };
  }

  /**
   * Calculate average potential savings
   */
  calculateAverageSavings(results) {
    const savingsAmounts = [];

    results.forEach((item) => {
      if (item.prices.length > 1) {
        const costs = item.prices
          .filter((p) => p.availability && p.totalCost > 0)
          .map((p) => p.totalCost);
        if (costs.length > 1) {
          const maxCost = Math.max(...costs);
          const minCost = Math.min(...costs);
          savingsAmounts.push(maxCost - minCost);
        }
      }
    });

    return savingsAmounts.length > 0
      ? Math.round(
          savingsAmounts.reduce((a, b) => a + b, 0) / savingsAmounts.length
        )
      : 0;
  }

  /**
   * Get best deals across all ingredients
   */
  async getBestDeals(ingredients, location = "Delhi") {
    const priceData = await this.getIngredientPrices(ingredients, location);

    const deals = [];

    priceData.ingredients.forEach((item) => {
      if (item.prices.length > 1) {
        const bestPrice = item.prices.find((p) => p.isLowest && p.availability);
        const worstPrice = item.prices.find(
          (p) => p.isHighest && p.availability
        );

        if (bestPrice && worstPrice && bestPrice.savings > 0) {
          deals.push({
            ingredient: item.ingredient,
            savings: bestPrice.savings,
            savingsPercentage: Math.round(
              (bestPrice.savings / worstPrice.totalCost) * 100
            ),
            bestPlatform: bestPrice.platform,
            bestPrice: bestPrice.totalCost,
            worstPrice: worstPrice.totalCost,
            quantity: `${item.requestedQuantity} ${item.requestedUnit}`,
          });
        }
      }
    });

    return deals.sort((a, b) => b.savings - a.savings);
  }

  /**
   * Generate shopping list with optimized platform selection
   */
  async generateOptimizedShoppingList(ingredients, location = "Delhi") {
    const priceData = await this.getIngredientPrices(ingredients, location);

    const shoppingList = [];
    let totalSavings = 0;

    priceData.ingredients.forEach((item) => {
      const availablePrices = item.prices.filter(
        (p) => p.availability && p.totalCost > 0
      );

      if (availablePrices.length > 0) {
        const bestOption = availablePrices.reduce((best, current) =>
          current.totalCost < best.totalCost ? current : best
        );

        shoppingList.push({
          ingredient: item.ingredient,
          quantity: item.requestedQuantity,
          unit: item.requestedUnit,
          selectedPlatform: bestOption.platform,
          price: bestOption.totalCost,
          deliveryTime: bestOption.deliveryTime,
          savings: bestOption.savings || 0,
        });

        totalSavings += bestOption.savings || 0;
      } else {
        shoppingList.push({
          ingredient: item.ingredient,
          quantity: item.requestedQuantity,
          unit: item.requestedUnit,
          selectedPlatform: null,
          price: 0,
          deliveryTime: "N/A",
          savings: 0,
          note: "Not available for delivery",
        });
      }
    });

    return {
      items: shoppingList,
      totalCost: shoppingList.reduce((sum, item) => sum + item.price, 0),
      totalSavings,
      estimatedDelivery: this.calculateEstimatedDelivery(shoppingList),
      platformBreakdown: this.groupByPlatform(shoppingList),
    };
  }

  /**
   * Calculate estimated delivery time
   */
  calculateEstimatedDelivery(shoppingList) {
    const deliveryTimes = shoppingList
      .filter((item) => item.selectedPlatform)
      .map((item) => item.deliveryTime);

    if (deliveryTimes.length === 0) return "N/A";

    // For simplicity, return the longest delivery time
    return deliveryTimes.reduce((longest, current) => {
      const currentMax = parseInt(current.split("-")[1]) || parseInt(current);
      const longestMax = parseInt(longest.split("-")[1]) || parseInt(longest);
      return currentMax > longestMax ? current : longest;
    });
  }

  /**
   * Group shopping list by platform
   */
  groupByPlatform(shoppingList) {
    const grouped = {};

    shoppingList.forEach((item) => {
      if (item.selectedPlatform) {
        if (!grouped[item.selectedPlatform]) {
          grouped[item.selectedPlatform] = {
            platform: item.selectedPlatform,
            items: [],
            totalCost: 0,
            deliveryTime: item.deliveryTime,
          };
        }

        grouped[item.selectedPlatform].items.push(item);
        grouped[item.selectedPlatform].totalCost += item.price;
      }
    });

    return Object.values(grouped);
  }
}

export default ShoppingService;
