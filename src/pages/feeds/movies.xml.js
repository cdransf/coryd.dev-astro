import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchMovies } from "@utils/data/movies";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const movies = await fetchMovies();

  const rss = generateRssFeed({
    permalink: "/feeds/movies.xml",
    title: "Movies feed",
    globals,
    data: movies.feed,
  });

  const filePath = path.resolve("public/feeds/movies.xml");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, rss);

  return [];
}
