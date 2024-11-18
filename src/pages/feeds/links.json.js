import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchLinks } from "@utils/data/links.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const links = await fetchLinks();

  const feed = generateJsonFeed({
    permalink: "/feeds/links.json",
    title: "Links / Cory Dransfeldt",
    globals,
    data: links,
  });

  const filePath = path.resolve("public/feeds/links.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, feed);

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
