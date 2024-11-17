import { generateJsonFeed } from "@utils/generateJsonFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchAllPosts } from "@utils/data/posts";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const posts = await fetchAllPosts();

  const feed = generateJsonFeed({
    permalink: "/feeds/posts.json",
    title: "Posts / Cory Dransfeldt",
    globals,
    data: posts,
  });

  const filePath = path.resolve("public/feeds/posts.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, feed);

  return [];
}
