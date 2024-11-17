# coryd.dev

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
`npm run build:worker -- WORKER_NAME`: builds the `wrangler.toml` file for the named worker.
`npm run deploy:worker --worker=WORKER_NAME`: deploys the named worker.

## Required environment variables

```plaintext
ACCOUNT_ID_PLEX
API_KEY_PLAUSIBLE
SUPABASE_URL
SUPABASE_KEY
CF_ACCOUNT_ID
CF_ZONE_ID
RSS_TO_MASTODON_KV_NAMESPACE_ID
```
