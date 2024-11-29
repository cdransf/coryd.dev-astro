import rss from "@astrojs/rss";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchSyndication } from "@utils/data/syndication.js";
import { htmlToText, sanitizeContent, md } from "@utils/helpers/general.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const syndication = await fetchSyndication();

  return rss({
    title: "coryd.dev syndication feed",
    description: "The feed that gets syndicated out to Mastodon",
    site: globals.url,
    items: syndication.map((item) => ({
      title: item.syndication.title,
      pubDate: item.syndication.date,
      link: item.syndication.url,
      description: htmlToText(md(item.syndication.description)),
    })),
  });
}
