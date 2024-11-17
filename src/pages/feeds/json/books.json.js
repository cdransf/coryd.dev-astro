import { generateJsonFeed } from '@utils/generateJsonFeed';
import { fetchGlobals } from '@utils/data/globals';
import { fetchBooks } from '@utils/data/books';

export async function GET() {
  const globals = await fetchGlobals();
  const books = await fetchBooks();

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
