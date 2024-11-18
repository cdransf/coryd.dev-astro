import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchAllPosts } from "@utils/data/posts.js";

export async function GET() {
  const [globals, posts] = await Promise.all([
    fetchGlobals(),
    fetchAllPosts(),
  ]);
  const rss = generateRssFeed({
    permalink: "/feeds/posts.xml",
    title: "Posts feed",
    globals,
    data: posts,
  });

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
