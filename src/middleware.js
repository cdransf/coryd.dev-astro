import { fetchGlobals } from "@utils/data/globals.js";
import { fetchNavigation } from "@utils/data/nav.js";

export async function onRequest(context, next) {
  const { locals } = context;

  try {
    const globals = await fetchGlobals();
    const nav = await fetchNavigation();

    locals.globals = globals;
    locals.nav = nav;
  } catch (error) {
    console.error("Error in middleware fetching data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }

  return next();
}
