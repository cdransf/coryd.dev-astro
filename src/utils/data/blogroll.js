import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchBlogroll() {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('blogroll', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching authors for the blogroll:', error);
    return [];
  }

  return data.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
};