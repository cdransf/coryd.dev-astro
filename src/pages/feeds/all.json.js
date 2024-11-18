import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchActivity } from "@utils/data/activity.js";

export async function GET() {
  const globals = await fetchGlobals();
  const activity = await fetchActivity();

  const feed = generateJsonFeed({
    permalink: "/feeds/all.json",
    title: "All activity / Cory Dransfeldt",
    globals,
    data: activity,
  });

    return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
