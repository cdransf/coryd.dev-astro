import { generateJsonFeed } from '@utils/generateJsonFeed';
import { fetchGlobals } from '@utils/data/globals';
import { fetchLinks } from '@utils/data/links';

export async function GET() {
  const globals = await fetchGlobals();
  const links = await fetchLinks();

  const feed = generateJsonFeed({
    permalink: "/feeds/links.json",
    title: "Links / Cory Dransfeldt",
    globals,
    data: links,
  });

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
