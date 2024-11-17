import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchBooks } from '@utils/data/books';

export async function GET() {
  const globals = await fetchGlobals();
  const books = await fetchBooks();

  const rss = generateRssFeed({
    permalink: "/feeds/books.xml",
    title: "Books / Cory Dransfeldt",
    globals,
    data: books.feed,
  });

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
