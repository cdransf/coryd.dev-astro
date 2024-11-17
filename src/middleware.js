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
let cachedByType = {};
let lastFetchTimeGlobalsNav = 0;
let lastFetchTimeByType = {};

export async function onRequest(context, next) {
  const now = Date.now();
  const { request, locals } = context;

  try {
    const runtimeEnv = locals.runtime?.env;

    if (!runtimeEnv)
      return new Response("Internal Server Error", { status: 500 });

    const urlPath = new URL(request.url).pathname;

    if (
      !cachedGlobals ||
      !cachedNav ||
      now - lastFetchTimeGlobalsNav > CACHE_DURATION
    ) {
      const [globals, nav] = await Promise.all([
        fetchGlobals(runtimeEnv),
        fetchNavigation(runtimeEnv),
      ]);
      cachedGlobals = globals;
      cachedNav = nav;
      lastFetchTimeGlobalsNav = now;
    }

    let resourceType = null;

    if (urlPath.startsWith("/music/artists/")) resourceType = "artist";
    else if (isbnRegex.test(urlPath)) resourceType = "book";
    else if (urlPath.startsWith("/music/genres/")) resourceType = "genre";
    else if (
      urlPath.startsWith("/watching/movies/") &&
      !isExcludedPath(urlPath, ["/favorites", "/recent"])
    )
      resourceType = "movie";
    else if (
      urlPath.startsWith("/watching/shows/") &&
      !isExcludedPath(urlPath, ["/favorites", "/recent"])
    )
      resourceType = "show";

    if (resourceType) {
      if (
        !cachedByType[urlPath] ||
        now - (lastFetchTimeByType[urlPath] || 0) > CACHE_DURATION
      ) {
        let fetchFunction = null;

        switch (resourceType) {
          case "artist":
            fetchFunction = fetchArtistByUrl;
            break;
          case "book":
            fetchFunction = fetchBookByUrl;
            break;
          case "genre":
            fetchFunction = fetchGenreByUrl;
            break;
          case "movie":
            fetchFunction = fetchMovieByUrl;
            break;
          case "show":
            fetchFunction = fetchShowByUrl;
            break;
        }

        const data = await fetchFunction(runtimeEnv, urlPath);

        if (!data)
          return new Response(
            `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Not Found`,
            { status: 404 }
          );

        cachedByType[urlPath] = data;
        lastFetchTimeByType[urlPath] = now;
      }

      locals[resourceType] = cachedByType[urlPath];
    }

    locals.globals = cachedGlobals;
    locals.nav = cachedNav;
  } catch (error) {
    console.error("Error in middleware:", error);
    return new Response("Internal Server Error", { status: 500 });
  }

  return next();
}
