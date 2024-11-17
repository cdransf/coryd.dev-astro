import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchGlobals() {
  const { data, error } = await supabase
    .from('optimized_globals')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching globals:', error);
    return {};
  }

  return data;
}
