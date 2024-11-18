import { generateJsonFeed } from '@utils/generateJsonFeed.js';
import { fetchGlobals } from '@utils/data/globals.js';
import { fetchMovies } from '@utils/data/movies';

export async function GET() {
  const globals = await fetchGlobals();
  const movies = await fetchMovies();

  const feed = generateJsonFeed({
    permalink: "/feeds/movies.json",
    title: "Movies / Cory Dransfeldt",
    globals,
    data: movies.feed,
  });
  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
