import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bookCache = {};

export async function fetchBookByUrl(url) {
  if (bookCache[url]) return bookCache[url];

  const { data: book, error } = await supabase
    .from("optimized_books")
    .select("*")
    .eq("url", url)
    .limit(1);

  if (error || !book) {
    console.error(`Error fetching book with URL ${url}:`, error);
    return null;
  }

  bookCache[url] = book[0];

  return book[0];
}
