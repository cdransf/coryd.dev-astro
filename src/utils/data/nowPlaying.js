import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.SUPABASE_URL
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function fetchNowPlaying() {
  const { data, error } = await supabase
    .from('optimized_latest_listen')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching the latest track:', error)
    return {}
  }

  const genreEmoji = data.genre_emoji
  const emoji = data.artist_emoji || genreEmoji

  return {
    content: `${emoji || '🎧'} ${data.track_name} by <a href="https://coryd.dev${data.url}">${data.artist_name}</a>`,
  }
}