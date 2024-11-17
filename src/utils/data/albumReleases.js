import { createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchAlbumReleases() {
  try {
    const today = DateTime.utc().startOf('day').toSeconds();

    const { data, error } = await supabase
      .from('optimized_album_releases')
      .select('*');

    if (error) {
      console.error('Error fetching album releases:', error);
      return { all: [], upcoming: [] };
    }

    const all = data
      .map((album) => {
        const releaseDate = DateTime.fromSeconds(album.release_timestamp)
          .toUTC()
          .startOf('day');

        return {
          ...album,
          description: album.artist.description,
          date: releaseDate.toLocaleString(DateTime.DATE_FULL),
          timestamp: releaseDate.toSeconds(),
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    const upcoming = all.filter((album) => album.release_timestamp > today);

    return { all, upcoming };
  } catch (error) {
    console.error('Unexpected error processing album releases:', error);
    return { all: [], upcoming: [] };
  }
}