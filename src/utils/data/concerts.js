import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const PAGE_SIZE = 1000;

export async function fetchConcertsData() {
  let concerts = [];
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from('optimized_concerts')
      .select('*')
      .range(rangeStart, rangeStart + PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching concerts:', error);
      break;
    }

    concerts = concerts.concat(data);
    if (data.length < PAGE_SIZE) break;
    rangeStart += PAGE_SIZE;
  }

  return concerts.map((concert) => ({
    ...concert,
    artist: concert.artist || { name: concert.artist_name_string, url: null },
  }));
};