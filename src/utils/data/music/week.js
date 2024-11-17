import { createClient } from "@supabase/supabase-js";
import { fetchDataFromView, calculateTotalPlays } from "@utils/data/music/utils.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedWeekData = null;
let lastFetchTimeWeek = 0;

export async function fetchMusicWeek() {
  const now = Date.now();

  if (cachedWeekData && now - lastFetchTimeWeek < CACHE_DURATION)
    return cachedWeekData;

  try {
    const [recentTracks, weekTracks, weekArtists, weekAlbums, weekGenres] =
      await Promise.all([
        fetchDataFromView("recent_tracks", supabase),
        fetchDataFromView("week_tracks", supabase),
        fetchDataFromView("week_artists", supabase),
        fetchDataFromView("week_albums", supabase),
        fetchDataFromView("week_genres", supabase),
      ]);

    const result = {
      recent: recentTracks,
      week: {
        tracks: weekTracks,
        artists: weekArtists,
        albums: weekAlbums,
        genres: weekGenres,
        totalTracks: calculateTotalPlays(weekTracks),
      },
    };

    cachedWeekData = result;
    lastFetchTimeWeek = now;

    return result;
  } catch (error) {
    console.error("Error in fetchWeekData:", error);
    return (
      cachedWeekData || {
        recent: [],
        week: {
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
