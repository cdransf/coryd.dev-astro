import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const genreCache = {};

export async function fetchGenreByUrl(url) {
  if (import.meta.env.MODE === "development" && genreCache[url]) return genreCache[url];

  const { data: genre, error } = await supabase
    .from("optimized_genres")
    .select("*")
    .eq("url", removeTrailingSlash(url))
    .limit(1);

  if (error) {
    console.error("Error fetching genre:", error);
    return null;
  }
  if (import.meta.env.MODE === "development") genreCache[url] = genre[0];

  return genre[0];
}
