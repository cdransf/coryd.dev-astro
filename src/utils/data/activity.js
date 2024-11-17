import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchActivity() {
  try {
    const { data, error } = await supabase
      .from('optimized_all_activity')
      .select('feed');

    if (error) {
      console.error('Error fetching activity data:', error);
      return [];
    }

    const [{ feed } = {}] = data || [];
    return feed?.filter((item) => item.feed !== null) || [];
  } catch (error) {
    console.error('Unexpected error fetching activity data:', error);
    return [];
  }
}