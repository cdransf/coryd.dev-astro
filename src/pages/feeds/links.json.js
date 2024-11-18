import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchLinks } from "@utils/data/links.js";

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
