import fetch from "node-fetch";

async function testSearch() {
  try {
    const response = await fetch("http://localhost:5000/api/search/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "tomato pasta",
        limit: 5,
      }),
    });

    const data = await response.json();
    console.log("Search Response:");
    console.log(JSON.stringify(data, null, 2));

    console.log(`\nFound ${data.results.length} results`);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSearch();
