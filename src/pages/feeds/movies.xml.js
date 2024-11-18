import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchMovies } from "@utils/data/movies.js";

export const prerender = true;

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const movies = await fetchMovies();

  const rss = GET({
    permalink: "/feeds/movies.xml",
    title: "Movies feed",
    globals,
    data: movies.feed,
  });

  const filePath = path.resolve("public/feeds/movies.xml");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, rss);

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
