import { createClient } from "@supabase/supabase-js";
import { parseCountryField } from "@utils/helpers/general.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedArtists = null;
let lastFetchTime = 0;

export async function fetchArtists() {
  const now = Date.now();

  if (cachedArtists && now - lastFetchTime < CACHE_DURATION)
    return cachedArtists;

  const PAGE_SIZE = 1000;
  let artists = [];
  let rangeStart = 0;

  try {
    while (true) {
      const { data, error } = await supabase
        .from("optimized_artists")
        .select("*")
        .range(rangeStart, rangeStart + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching artists:", error);
        break;
      }

      artists = artists.concat(
        data.map((artist) => ({
          ...artist,
          country: parseCountryField(artist["country"]),
        }))
      );

      if (data.length < PAGE_SIZE) break;
      rangeStart += PAGE_SIZE;
    }

    cachedArtists = artists;
    lastFetchTime = now;

    return artists;
  } catch (error) {
    console.error("Error in fetchArtists:", error);
    return cachedArtists || [];
  }
}
