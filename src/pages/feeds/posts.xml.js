import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchAllPosts } from "@utils/data/posts";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const posts = await fetchAllPosts();

  const rss = generateRssFeed({
    permalink: "/feeds/posts.xml",
    title: "Posts feed",
    globals,
    data: posts,
  });

  const filePath = path.resolve("public/feeds/posts.xml");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, rss);

  return [];
}
