import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const PAGE_SIZE = 1000;

export const fetchShows = async () => {
  let shows = [];
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from('optimized_shows')
      .select('*')
      .range(rangeStart, rangeStart + PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching shows:', error);
      break;
    }

    shows = shows.concat(data);
    if (data.length < PAGE_SIZE) break;
    rangeStart += PAGE_SIZE;
  }

  const watchedShows = shows.filter(show => show['last_watched_at'] !== null);
  const episodes = watchedShows.map(show => ({
    title: show['episode']['title'],
    year: show['year'],
    formatted_episode: show['episode']['formatted_episode'],
    url: show['episode']['url'],
    image: show['episode']['image'],
    backdrop: show['episode']['backdrop'],
    last_watched_at: show['episode']['last_watched_at'],
    grid: show['grid'],
    type: 'tv'
  }));

  return {
    shows,
    recentlyWatched: episodes.slice(0, 225),
    favorites: shows.filter(show => show.favorite).sort((a, b) => a.title.localeCompare(b.title)),
  };
};