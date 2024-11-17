import rss from "@astrojs/rss";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchBooks } from "@utils/data/books.js";
import { escapeHtml, md } from "@utils/helpers/general.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const books = await fetchBooks();

  return rss({
    title: "coryd.dev books feed",
    description: "The latest books Cory Dransfeldt has read.",
    site: globals.url,
    stylesheet: `${globals.url}/feeds/style.xsl`,
    items: books.feed.slice(0, 20).map((book) => ({
      title: book.feed.title,
      pubDate: book.feed.date,
      link: book.feed.url,
      description: escapeHtml(md(book.feed.description)),
    })),
  });
}
