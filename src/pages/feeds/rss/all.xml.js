import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchActivity } from "@utils/data/activity";

export async function GET() {
  const globals = await fetchGlobals();
  const activity = await fetchActivity();

  const rss = generateRssFeed({
    permalink: "/feeds/all.xml",
    title: "All activity / Cory Dransfeldt",
    globals,
    data: activity,
  });

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
