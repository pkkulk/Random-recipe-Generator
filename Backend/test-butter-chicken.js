import fetch from "node-fetch";

async function testButterChickenSearch() {
  try {
    console.log("Testing butter chicken search...");

    const response = await fetch("http://localhost:5000/api/search/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "butter chicken",
        limit: 3,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return;
    }

    const data = await response.json();
    console.log("Search Response:");
    console.log(JSON.stringify(data, null, 2));

    if (data.results && data.results.length > 0) {
      console.log(
        `\n✅ Success! Found ${data.results.length} butter chicken recipes`
      );
      console.log("First recipe:", data.results[0].name);
    } else {
      console.log("\n❌ No recipes found");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testButterChickenSearch();
