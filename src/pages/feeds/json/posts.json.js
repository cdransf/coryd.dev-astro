import { generateJsonFeed } from '@utils/generateJsonFeed';
import { fetchGlobals } from '@utils/data/globals';
import { fetchAllPosts } from '@utils/data/posts';

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
