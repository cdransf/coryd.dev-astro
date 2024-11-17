import { createClient } from '@supabase/supabase-js';
import { parseCountryField } from '@utils/helpers.js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const PAGE_SIZE = 1000;

export async function fetchArtists(){
  let artists = [];
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from('optimized_artists')
      .select('*')
      .range(rangeStart, rangeStart + PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching artists:', error);
      break;
    }

    // Process and concatenate artists data
    artists = artists.concat(
      data.map((artist) => ({
        ...artist,
        country: parseCountryField(artist['country']),
      }))
    );

    // Break if no more data
    if (data.length < PAGE_SIZE) break;
    rangeStart += PAGE_SIZE;
  }

  return artists;
};