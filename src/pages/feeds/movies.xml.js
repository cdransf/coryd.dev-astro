import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchMovies } from "@utils/data/movies.js";

export async function GET() {
  const [globals, movies] = await Promise.all([
    fetchGlobals(),
    fetchMovies(),
  ]);
  const rss = generateRssFeed({
    permalink: "/feeds/movies.xml",
    title: "Movies feed",
    globals,
    data: movies.feed,
  });

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
