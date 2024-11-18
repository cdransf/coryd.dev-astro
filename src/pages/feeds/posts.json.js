import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchAllPosts } from "@utils/data/posts.js";

export async function GET() {
  const globals = await fetchGlobals();
  const posts = await fetchAllPosts();

  const feed = generateJsonFeed({
    permalink: "/feeds/posts.json",
    title: "Posts / Cory Dransfeldt",
    globals,
    data: posts,
  });

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
