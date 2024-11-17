import { generateJsonFeed } from "@utils/generateJsonFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchLinks } from "@utils/data/links";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const links = await fetchLinks();

  const feed = generateJsonFeed({
    permalink: "/feeds/links.json",
    title: "Links / Cory Dransfeldt",
    globals,
    data: links,
  });

  const filePath = path.resolve("public/feeds/links.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, feed);

  return [];
}
