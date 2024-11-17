import { generateJsonFeed } from "@utils/generateJsonFeed";
import { fetchGlobals } from "@utils/data/globals";
import { fetchBooks } from "@utils/data/books";
import fs from "fs/promises";
import path from "path";

export async function getStaticPaths() {
  const globals = await fetchGlobals();
  const books = await fetchBooks();

  const feed = generateJsonFeed({
    permalink: "/feeds/books.json",
    title: "Books / Cory Dransfeldt",
    globals,
    data: books.feed,
  });

  const filePath = path.resolve("public/feeds/books.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, feed);

  return [];
}
