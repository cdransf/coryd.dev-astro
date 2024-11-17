import rss from "@astrojs/rss";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchAllPosts } from "@utils/data/posts.js";
import { escapeHtml, md } from "@utils/helpers/general.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const posts = await fetchAllPosts();

  return rss({
    title: "coryd.dev posts feed",
    description: "The latest posts from Cory Dransfeldt.",
    site: globals.url,
    stylesheet: `${globals.url}/feeds/style.xsl`,
    items: posts.slice(0, 20).map((post) => ({
      title: post.feed.title,
      pubDate: post.feed.date,
      link: post.feed.url,
      description: escapeHtml(md(post.feed.description)),
    })),
  });
}
