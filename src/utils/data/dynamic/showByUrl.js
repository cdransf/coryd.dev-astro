import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

let cachedShows = {};
let lastFetchTime = {};

export async function fetchShowByUrl(env, url) {
  const normalizedUrl = removeTrailingSlash(url);

  if (
    cachedShows[normalizedUrl] &&
    Date.now() - lastFetchTime[normalizedUrl] < CACHE_DURATION
  )
    return cachedShows[normalizedUrl];

  const SUPABASE_URL = import.meta.env?.SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env?.SUPABASE_KEY || env.SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: tv, error } = await supabase
    .from("optimized_shows")
    .select("*")
    .eq("url", normalizedUrl)
    .limit(1);

  if (error || !tv?.length) return null;

  cachedShows[normalizedUrl] = tv[0];
  lastFetchTime[normalizedUrl] = Date.now();

  return tv[0];
}
