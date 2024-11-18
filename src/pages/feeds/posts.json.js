import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchAllPosts } from "@utils/data/posts.js";

export const prerender = true;

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
