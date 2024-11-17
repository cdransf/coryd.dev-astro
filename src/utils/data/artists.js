import { createClient } from "@supabase/supabase-js";
import { parseCountryField } from "@utils/helpers/general.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedArtists = null;

export async function fetchArtists() {
  if (import.meta.env.MODE === "development" && cachedArtists)
    return cachedArtists;

  const PAGE_SIZE = 1000;
  let artists = [];
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from("optimized_artists")
      .select("*")
      .range(rangeStart, rangeStart + PAGE_SIZE - 1);

    if (error) break;

    artists = artists.concat(
      data.map((artist) => ({
        ...artist,
        country: parseCountryField(artist["country"]),
      }))
    );

    if (data.length < PAGE_SIZE) break;
    rangeStart += PAGE_SIZE;
  }

  if (import.meta.env.MODE === "development") cachedArtists = artists;

  return artists;
};
