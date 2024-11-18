import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchBooks } from "@utils/data/books.js";

export const prerender = true;

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const books = await fetchBooks();

  const rss = generateRssFeed({
    permalink: "/feeds/books.xml",
    title: "Books feed",
    globals,
    data: books.feed,
  });

  const filePath = path.resolve("public/feeds/books.xml");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, rss);

  return [];
}
