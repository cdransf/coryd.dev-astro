import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchLinks } from "@utils/data/links";

export async function GET() {
  const [globals, links] = await Promise.all([
    fetchGlobals(),
    fetchLinks(),
  ]);
  const rss = generateRssFeed({
    permalink: "/feeds/links.xml",
    title: "Links feed",
    globals,
    data: links,
  });

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
