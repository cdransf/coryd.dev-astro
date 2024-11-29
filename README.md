# coryd.dev

[![Netlify Status](https://api.netlify.com/api/v1/badges/21438096-e0d0-4f14-846d-addd9d8292db/deploy-status)](https://app.netlify.com/sites/coryd/deploys)

Hi! I'm Cory. 👋🏻

This is the code for my personal website and portfolio. Built using [Astro](https://astro.build) and [other tools](https://coryd.dev/colophon).

- [Follow me on Mastodon](https://follow.coryd.dev/@cory)
- [Buy me a coffee](https://buymeacoffee.com/cory)
- [What I'm listening to](https://coryd.dev/music)
- [What I'm watching](https://coryd.dev/watching)
- [What I'm reading](https://coryd.dev/books)
- [What I'm doing now](https://coryd.dev/now)

---

## Local dev setup

1. `npm install`

## Local dev workflow

1. `npm start`
2. Open `http://localhost:4321`

### Other commands

`npm run build`: builds Astro output.
`npm run prevew`: previews built Astro output (uses wrangler command compatible with Cloudflare adapter under the hood).
`npm run update:deps`: checks for dependency updates and updates Astro.
`netlify dev`: local development with Netlify functions.


## Required environment variables

```plaintext
ACCOUNT_ID_PLEX
API_KEY_PLAUSIBLE
SUPABASE_URL
SUPABASE_KEY
DIRECTUS_URL
DIRECTUS_TOKEN
ARTIST_IMPORT_TOKEN
ARTIST_FLOW_ID
ALBUM_FLOW_ID
MASTODON_ACCESS_TOKEN
FORWARDEMAIL_API_KEY
CDN
```
