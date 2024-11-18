import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchBooks } from "@utils/data/books.js";

export async function GET() {
  const [globals, books] = await Promise.all([
    fetchGlobals(),
    fetchBooks(),
  ]);
  const feed = generateJsonFeed({
    permalink: "/feeds/books.json",
    title: "Books / Cory Dransfeldt",
    globals,
    data: books.feed,
  });

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
