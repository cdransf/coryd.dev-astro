import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const movieCache = {};

export async function fetchMovieByUrl(url) {
  if (import.meta.env.MODE === "development" && movieCache[url]) return movieCache[url];

  const { data: movie, error } = await supabase
    .from("optimized_movies")
    .select("*")
    .eq("url", removeTrailingSlash(url))
    .limit(1);
  if (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
  if (import.meta.env.MODE === "development") movieCache[url] = movie[0];

  return movie[0];
}
