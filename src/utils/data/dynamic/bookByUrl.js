import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const bookCache = {};

export async function fetchBookByUrl(url) {
  if (import.meta.env.MODE === "development" && bookCache[url]) return bookCache[url];

  const { data: book, error } = await supabase
    .from("optimized_books")
    .select("*")
    .eq("url", removeTrailingSlash(url))
    .limit(1);

  if (error || !book || book.length === 0) {
    console.error(`Error fetching book with URL ${url}:`, error);
    return null;
  }
  if (import.meta.env.MODE === "development") bookCache[url] = book[0];

  return book[0];
}
