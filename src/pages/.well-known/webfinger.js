import { fetchGlobals } from "@utils/data/globals.js";

export const prerender = true;

export async function GET() {
  try {
    const globals = await fetchGlobals();

    const webfingerResponse = {
      subject: `acct:${globals.webfinger_username}@${globals.webfinger_hostname}`,
      aliases: [
        `https://${globals.webfinger_hostname}/@${globals.webfinger_username}`,
        `https://${globals.webfinger_hostname}/users/${globals.webfinger_username}`,
      ],
      links: [
        {
          rel: "http://webfinger.net/rel/profile-page",
          type: "text/html",
          href: `https://${globals.webfinger_hostname}/@${globals.webfinger_username}`,
        },
        {
          rel: "self",
          type: "application/activity+json",
          href: `https://${globals.webfinger_hostname}/users/${globals.webfinger_username}`,
        },
        {
          rel: "http://ostatus.org/schema/1.0/subscribe",
          template: `https://${globals.webfinger_hostname}/authorize_interaction?uri={uri}`,
        },
        {
          rel: "http://webfinger.net/rel/avatar",
          type: "image/png",
          href: `${globals.cdn_url}${globals.avatar}?class=squarebase`,
        },
      ],
    };

    return new Response(JSON.stringify(webfingerResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/jrd+json",
      },
    });
  } catch (error) {
    console.error("Error generating WebFinger response:", error);
    return new Response("Error generating WebFinger response", { status: 500 });
  }
}
