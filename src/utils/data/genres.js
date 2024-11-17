import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchGenres() {
  const { data, error } = await supabase
    .from('optimized_genres')
    .select('*');

  if (error) {
    console.error('Error fetching genres with artists:', error);
    return [];
  }

  return data;
};