import { createClient } from "@supabase/supabase-js";
import { format, startOfDay, isAfter, getTime } from "date-fns";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedAlbumReleases = null;
let lastFetchTime = 0;

export async function fetchAlbumReleases() {
  const now = Date.now();

  if (cachedAlbumReleases && now - lastFetchTime < CACHE_DURATION)
    return cachedAlbumReleases;

  const today = getTime(startOfDay(new Date()));

  try {
    const { data, error } = await supabase
      .from("optimized_album_releases")
      .select("*");

    if (error) {
      console.error("Error fetching album releases:", error);
      return { all: [], upcoming: [] };
    }

    const all = data
      .map((album) => {
        const releaseDate = startOfDay(
          new Date(album.release_timestamp * 1000)
        );
        return {
          ...album,
          description: album.artist.description,
          date: format(releaseDate, "PPPP"),
          timestamp: getTime(releaseDate) / 1000,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    const upcoming = all.filter((album) =>
      isAfter(new Date(album.release_timestamp * 1000), new Date(today)) && album.total_plays === 0
    );

    cachedAlbumReleases = { all, upcoming };
    lastFetchTime = now;

    return { all, upcoming };
  } catch (error) {
    console.error("Error in fetchAlbumReleases:", error);
    return cachedAlbumReleases || { all: [], upcoming: [] };
  }
}
