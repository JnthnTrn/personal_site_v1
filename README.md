# Personal site

The view from an observation deck over Reach: a starfield, the planet below, and the site's content as panels on the glass.

## Run it

```bash
npm install
npm run dev
```

## Make it yours

All personal text, links and featured projects are in `lib/site.ts`; coursework is in `lib/coursework.ts`; the resume is `public/resume.pdf`. The scene is drawn in CSS and canvas (`components/Viewport.tsx`, top of `app/globals.css`); there are no image assets.

## Spotify "Listening" panel

The panel shows "no signal" until three environment variables are set.

1. Create an app at <https://developer.spotify.com/dashboard> and add `http://127.0.0.1:8888/callback` as a redirect URI.
2. Copy `.env.example` to `.env.local` and fill in the client id and secret.
3. Run `npm run spotify:token`, open the printed URL, approve, and paste the printed `SPOTIFY_REFRESH_TOKEN` line into `.env.local`.
4. Restart the dev server. When deploying, add the same three variables to the host.

## Projects panel

Featured projects are the `projects` list in `lib/site.ts`. The contribution heatmap is read from GitHub's public calendar page, because there is no token-free API for it; if GitHub changes that page the heatmap hides itself.

## Adding a widget

Add a `<section className="panel">` in `app/page.tsx`. Panels sit on a 12-column grid; data that needs a secret goes behind a route in `app/api/`.
