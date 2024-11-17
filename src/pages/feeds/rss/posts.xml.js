import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchAllPosts } from '@utils/data/posts';

export async function GET() {
  const globals = await fetchGlobals();
  const posts = await fetchAllPosts();

  const rss = generateRssFeed({
    permalink: "/feeds/posts.xml",
    title: "Posts / Cory Dransfeldt",
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
