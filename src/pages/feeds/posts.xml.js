import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchAllPosts } from "@utils/data/posts.js";

export const prerender = true;

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const posts = await fetchAllPosts();

  const rss = GET({
    permalink: "/feeds/posts.xml",
    title: "Posts feed",
    globals,
    data: posts,
  });

  const filePath = path.resolve("public/feeds/posts.xml");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, rss);

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
