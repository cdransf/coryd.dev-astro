import { generateJsonFeed } from '@utils/generateJsonFeed.js';
import { fetchGlobals } from '@utils/data/globals.js';
import { fetchMovies } from '@utils/data/movies';

export const prerender = true;

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const movies = await fetchMovies();

  const feed = generateJsonFeed({
    permalink: "/feeds/movies.json",
    title: "Movies / Cory Dransfeldt",
    globals,
    data: movies.feed,
  });

  const filePath = path.resolve("public/feeds/movies.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, feed);

  return [];
}
