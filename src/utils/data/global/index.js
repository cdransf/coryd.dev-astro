import { fetchGlobals } from "@utils/data/globals.js";
import { fetchNavigation } from "@utils/data/nav.js";

export async function fetchGlobalData(Astro) {
  if (Astro?.locals) return Astro.locals;

  const globals = await fetchGlobals();
  const nav = await fetchNavigation();

  return { globals, nav };
}
