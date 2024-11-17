import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const PAGE_SIZE = 1000;

export async function fetchBooks() {
  let books = [];
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from('optimized_books')
      .select('*')
      .order('date_finished', { ascending: false })
      .range(rangeStart, rangeStart + PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching books:', error);
      break;
    }

    books = books.concat(data);
    if (data.length < PAGE_SIZE) break;
    rangeStart += PAGE_SIZE;
  }

  const years = {};
  books.forEach((book) => {
    const year = book.year;
    if (!years[year]) {
      years[year] = { value: year, data: [book] };
    } else {
      years[year].data.push(book);
    }
  });

  const sortedByYear = Object.values(years).filter((year) => year.value > 2017);
  const currentYear = new Date().getFullYear();
  const booksForCurrentYear =
    sortedByYear.find((yearGroup) => yearGroup.value === currentYear)?.data || [];

  return {
    all: books,
    years: sortedByYear,
    currentYear: booksForCurrentYear,
    feed: books.filter((book) => book.feed),
  };
};