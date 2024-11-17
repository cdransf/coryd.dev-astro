import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchMovies } from '@utils/data/movies';

export async function GET() {
  const globals = await fetchGlobals();
  const movies = await fetchMovies();

  const rss = generateRssFeed({
    permalink: "/feeds/movies.xml",
    title: "Movies / Cory Dransfeldt",
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
