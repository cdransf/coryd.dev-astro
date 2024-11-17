import { generateJsonFeed } from "@utils/generateJsonFeed.js";
import { fetchGlobals } from "@utils/data/globals.js";
import { fetchActivity } from "@utils/data/activity.js";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const activity = await fetchActivity();

  const feed = generateJsonFeed({
    permalink: "/feeds/all.json",
    title: "All activity / Cory Dransfeldt",
    globals,
    data: activity,
  });

  const filePath = path.resolve("public/feeds/all.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, feed);

  return [];
}
