import { fetchBlogroll } from "@utils/data/blogroll.js";
import { fetchGlobals } from "@utils/data/global/index.js";

export async function GET() {
  try {
    const blogroll = await fetchBlogroll();
    const globals = await fetchGlobals();
    const dateCreated = new Date().toUTCString();

    const opmlContent = `
<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
  <head>
    <title>OPML for all feeds in ${globals.site_name}'s blogroll</title>
    <dateCreated>${dateCreated}</dateCreated>
  </head>
  <body>
    ${blogroll
      .map(
        (blog) => `
      <outline
        text="${blog.name}"
        title="${blog.name}"
        type="rss"
        xmlUrl="${blog.rss_feed}"
        htmlUrl="${blog.url}"
      />`
      )
      .join("\n")}
  </body>
</opml>
`.trim();

    return new Response(opmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating blogroll OPML:", error);
    return new Response("Error generating blogroll OPML", { status: 500 });
  }
}
