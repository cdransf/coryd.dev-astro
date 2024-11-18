import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchLinks } from "@utils/data/links";

export const prerender = true;

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const links = await fetchLinks();

  const rss = generateRssFeed({
    permalink: "/feeds/links.xml",
    title: "Links feed",
    globals,
    data: links,
  });

  const filePath = path.resolve("public/feeds/links.xml");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, rss);

  return [];
}
