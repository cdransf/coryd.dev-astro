import { createClient } from "@supabase/supabase-js";
import { fetchDataFromView, calculateTotalPlays } from "@utils/data/music/utils.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedMonthData = null;
let lastFetchTimeMonth = 0;

export async function fetchMusicMonth() {
  const now = Date.now();

  if (cachedMonthData && now - lastFetchTimeMonth < CACHE_DURATION)
    return cachedMonthData;

  try {
    const [
      monthTracks,
      monthArtists,
      monthAlbums,
      monthGenres,
    ] = await Promise.all([
      fetchDataFromView("month_tracks", supabase),
      fetchDataFromView("month_artists", supabase),
      fetchDataFromView("month_albums", supabase),
      fetchDataFromView("month_genres", supabase),
    ]);

    const result = {
      month: {
        tracks: monthTracks,
        artists: monthArtists,
        albums: monthAlbums,
        genres: monthGenres,
        totalTracks: calculateTotalPlays(monthTracks),
      },
    };

    cachedMonthData = result;
    lastFetchTimeMonth = now;

    return result;
  } catch (error) {
    console.error("Error in fetchMonthData:", error);
    return (
      cachedMonthData || {
        month: {
          tracks: [],
          artists: [],
          albums: [],
          genres: [],
          totalTracks: "0",
        },
      }
    );
  }
}
