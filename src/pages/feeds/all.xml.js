import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchActivity } from "@utils/data/activity.js";

export async function GET() {
  const globals = await fetchGlobals();
  const activity = await fetchActivity();

  const rss = generateRssFeed({
    permalink: "/feeds/all.xml",
    title: "All activity feed",
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
