// One-time helper: signs in to Spotify and saves SPOTIFY_REFRESH_TOKEN to .env.local.
// Run with `npm run spotify:token` after setting the client id and secret.
import fs from "node:fs";
import http from "node:http";

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const redirect = "http://127.0.0.1:8888/callback";
const scope = "user-read-currently-playing user-read-recently-played user-top-read";
const authorize = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: id,
  response_type: "code",
  redirect_uri: redirect,
  scope,
})}`;

const server = http.createServer(async (req, res) => {
  const code = new URL(req.url, redirect).searchParams.get("code");
  if (!code) return res.writeHead(400).end("Missing code");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    console.error("Spotify did not return a refresh token:", data);
    res.end("Failed. Check the terminal.");
  } else {
    const line = `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`;
    const env = fs.readFileSync(".env.local", "utf8");
    fs.writeFileSync(
      ".env.local",
      /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(env) ? env.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line) : `${env.trimEnd()}\n${line}\n`,
    );
    console.log("\nSaved the refresh token to .env.local. Restart the dev server to pick it up.\n");
    res.end("Linked. You can close this tab.");
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => console.log(`Open this URL and approve access:\n\n${authorize}\n`));
