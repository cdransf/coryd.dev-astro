import { fetchGlobals } from "@utils/data/globals.js";
import { fetchNavigation } from "@utils/data/nav.js";
import { fetchArtistByUrl } from "@utils/data/dynamic/artistByUrl.js";
import { fetchBookByUrl } from "@utils/data/dynamic/bookByUrl.js";
import { fetchGenreByUrl } from "@utils/data/dynamic/genreByUrl.js";
import { fetchMovieByUrl } from "@utils/data/dynamic/movieByUrl.js";
import { fetchShowByUrl } from "@utils/data/dynamic/showByUrl.js";
import { isbnRegex } from "@utils/helpers/media.js";
import { isExcludedPath } from "@utils/helpers/general.js";
import { CACHE_DURATION } from "@utils/constants/index.js";

let cachedGlobals = null;
let cachedNav = null;
let lastFetchTimeGlobals = 0;
let lastFetchTimeNav = 0;

export async function fetchGlobalData(Astro, urlPath) {
  const now = Date.now();

  if (Astro?.locals) {
    const data = {
      globals: Astro.locals.globals,
      nav: Astro.locals.nav,
    };

    if (urlPath?.startsWith("/music/artists/"))
      data.artist = Astro.locals.artist;
    if (isbnRegex.test(urlPath)) data.book = Astro.locals.book;
    if (urlPath?.startsWith("/music/genres/")) data.genre = Astro.locals.genre;
    if (
      urlPath?.startsWith("/watching/movies/") &&
      !isExcludedPath(urlPath, ["/favorites", "/recent"])
    )
      data.movie = Astro.locals.movie;
    if (
      urlPath?.startsWith("/watching/shows/") &&
      !isExcludedPath(urlPath, ["/favorites", "/recent"])
    )
      data.show = Astro.locals.show;

    return data;
  }

  const globals =
    cachedGlobals && now - lastFetchTimeGlobals < CACHE_DURATION
      ? cachedGlobals
      : ((cachedGlobals = await fetchGlobals()), (lastFetchTimeGlobals = now));

  const nav =
    cachedNav && now - lastFetchTimeNav < CACHE_DURATION
      ? cachedNav
      : ((cachedNav = await fetchNavigation()), (lastFetchTimeNav = now));

  let artist, book, genre, movie, show;

  try {
    if (urlPath?.startsWith("/music/artists/")) {
      artist = await fetchArtistByUrl(urlPath);
    } else if (isbnRegex.test(urlPath)) {
      book = await fetchBookByUrl(urlPath);
    } else if (urlPath?.startsWith("/music/genres/")) {
      genre = await fetchGenreByUrl(urlPath);
    } else if (
      urlPath?.startsWith("/watching/movies/") &&
      !isExcludedPath(urlPath, ["/favorites", "/recent"])
    ) {
      movie = await fetchMovieByUrl(urlPath);
    } else if (
      urlPath?.startsWith("/watching/shows/") &&
      !isExcludedPath(urlPath, ["/favorites", "/recent"])
    ) {
      show = await fetchShowByUrl(urlPath);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return { globals, nav, artist, book, genre, movie, show };
}
