import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const artistCache = {};

export async function fetchArtistByUrl(url) {
  if (import.meta.env.MODE === "development" && artistCache[url]) return artistCache[url];

  const { data: artist, error } = await supabase
    .from("optimized_artists")
    .select("*")
    .eq("url", url)
    .limit(1);

  if (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
  if (import.meta.env.MODE === "development") artistCache[url] = artist[0];

  return artist[0];
}
