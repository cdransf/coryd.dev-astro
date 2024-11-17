import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedBooks = null;
let lastFetchTime = 0;

export async function fetchBooks() {
  const now = Date.now();

  if (cachedBooks && now - lastFetchTime < CACHE_DURATION) return cachedBooks;

  const PAGE_SIZE = 1000;
  let books = [];
  let rangeStart = 0;

  try {
    while (true) {
      const { data, error } = await supabase
        .from("optimized_books")
        .select("*")
        .order("date_finished", { ascending: false })
        .range(rangeStart, rangeStart + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching books:", error);
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

    const sortedByYear = Object.values(years).filter(
      (year) => year.value > 2017
    );
    const currentYear = new Date().getFullYear();
    const booksForCurrentYear =
      sortedByYear
        .find((yearGroup) => yearGroup.value === currentYear)
        ?.data.filter((book) => book["status"] === "finished") || [];

    const result = {
      all: books,
      years: sortedByYear,
      currentYear: booksForCurrentYear,
      feed: books.filter((book) => book.feed),
    };

    cachedBooks = result;
    lastFetchTime = now;

    return result;
  } catch (error) {
    console.error("Error in fetchBooks:", error);
    return (
      cachedBooks || {
        all: [],
        years: [],
        currentYear: [],
        feed: [],
      }
    );
  }
}
