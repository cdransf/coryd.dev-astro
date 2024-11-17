import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

let cachedGenres = {};
let lastFetchTime = {};

export async function fetchGenreByUrl(env, url) {
  const normalizedUrl = removeTrailingSlash(url);

  if (
    cachedGenres[normalizedUrl] &&
    Date.now() - lastFetchTime[normalizedUrl] < CACHE_DURATION
  )
    return cachedGenres[normalizedUrl];

  const SUPABASE_URL = import.meta.env?.SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env?.SUPABASE_KEY || env.SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: genre, error } = await supabase
    .from("optimized_genres")
    .select("*")
    .eq("url", normalizedUrl)
    .limit(1);

  if (error || !genre?.length) return null;

  cachedGenres[normalizedUrl] = genre[0];
  lastFetchTime[normalizedUrl] = Date.now();

  return genre[0];
}
