import rss from "@astrojs/rss";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchActivity } from "@utils/data/activity.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const activity = await fetchActivity();

  return rss({
    title: "coryd.dev activity feed",
    description: "The latest activity from Cory Dransfeldt.",
    site: globals.url,
    stylesheet: `${globals.url}/feeds/style.xsl`,
    items: activity.map((item) => ({
      title: item.feed.title,
      pubDate: item.feed.date,
      link: item.feed.url,
      description: item.feed.description,
    })),
  });
}
