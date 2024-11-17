import { generateRssFeed } from "@utils/generateRssFeed";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchActivity } from "@utils/data/activity.js";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const activity = await fetchActivity();

  const rss = generateRssFeed({
    permalink: "/feeds/all.xml",
    title: "All activity feed",
    globals,
    data: activity,
  });

  const filePath = path.resolve("public/feeds/all.xml");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, rss);

  return [];
}
