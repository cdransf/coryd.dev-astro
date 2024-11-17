import rss from "@astrojs/rss";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchMovies } from "@utils/data/movies.js";
import { escapeHtml, md } from "@utils/helpers/general.js";

export const prerender = true;

export async function GET() {
  const globals = await fetchGlobals();
  const movies = await fetchMovies();

  return rss({
    title: "coryd.dev movies feed",
    description: "The latest movie Cory Dransfeldt has watched.",
    site: globals.url,
    stylesheet: `${globals.url}/feeds/style.xsl`,
    items: movies.feed.slice(0, 20).map((movie) => ({
      title: movie.feed.title,
      pubDate: movie.feed.date,
      link: movie.feed.url,
      description: escapeHtml(md(movie.feed.description)),
    })),
  });
}
