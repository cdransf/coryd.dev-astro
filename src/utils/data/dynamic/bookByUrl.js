import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const cache = {};
const cacheTimestamps = {};

export async function fetchBookByUrl(env, url) {
  const normalizedUrl = removeTrailingSlash(url);
  const now = Date.now();

  if (
    cache[normalizedUrl] &&
    now - cacheTimestamps[normalizedUrl] < CACHE_DURATION
  )
    return cache[normalizedUrl];

  const SUPABASE_URL = import.meta.env?.SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env?.SUPABASE_KEY || env.SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: book, error } = await supabase
    .from("optimized_books")
    .select("*")
    .eq("url", normalizedUrl)
    .limit(1);

  if (error || !book.length) return null;

  cache[normalizedUrl] = book[0];
  cacheTimestamps[normalizedUrl] = now;

  return book[0];
}
