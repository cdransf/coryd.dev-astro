import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

let cachedMovies = {};
let lastFetchTime = {};

export async function fetchMovieByUrl(env, url) {
  const normalizedUrl = removeTrailingSlash(url);

  if (
    cachedMovies[normalizedUrl] &&
    Date.now() - lastFetchTime[normalizedUrl] < CACHE_DURATION
  )
    return cachedMovies[normalizedUrl];

  const SUPABASE_URL = import.meta.env?.SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env?.SUPABASE_KEY || env.SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: movie, error } = await supabase
    .from("optimized_movies")
    .select("*")
    .eq("url", normalizedUrl)
    .limit(1);

  if (error || !movie?.length) return null;

  cachedMovies[normalizedUrl] = movie[0];
  lastFetchTime[normalizedUrl] = Date.now();

  return movie[0];
}
