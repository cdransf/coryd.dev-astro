import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchBooks } from "@utils/data/books.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const books = await fetchBooks();

  const feed = generateJsonFeed({
    permalink: "/feeds/books.json",
    title: "Books / Cory Dransfeldt",
    globals,
    data: books.feed,
  });

  const filePath = path.resolve("public/feeds/books.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, feed);

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
