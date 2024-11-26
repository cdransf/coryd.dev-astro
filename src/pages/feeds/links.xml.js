import rss from "@astrojs/rss";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchLinks } from "@utils/data/links.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const links = await fetchLinks();

  return rss({
    title: "coryd.dev links feed",
    description:
      "These are links I've liked or otherwise found interesting. They're all added manually, after having been read and, I suppose, properly considered.",
    site: globals.url,
    stylesheet: `${globals.url}/feeds/style.xsl`,
    items: links.slice(0, 20).map((link) => ({
      title: link.feed.title,
      pubDate: link.feed.date,
      link: link.feed.url,
      content: link.feed.description,
    })),
  });
}
