import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchLinks } from '@utils/data/links';

export async function GET() {
  const globals = await fetchGlobals();
  const links = await fetchLinks();

  const rss = generateRssFeed({
    permalink: "/feeds/links.xml",
    title: "Links / Cory Dransfeldt",
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
