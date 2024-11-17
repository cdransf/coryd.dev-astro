import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env['SUPABASE_URL']
const SUPABASE_KEY = import.meta.env['SUPABASE_KEY']
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const PAGE_SIZE = 1000

export async function fetchAllPosts() {
  let posts = []
  let page = 0
  let fetchMore = true

  while (fetchMore) {
    const { data, error } = await supabase
      .from('optimized_posts')
      .select('*')
      .order('date', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (error) {
      console.error('Error fetching posts:', error)
      return posts
    }

    if (data.length < PAGE_SIZE) fetchMore = false

    posts = posts.concat(data)
    page++
  }

  return posts
}