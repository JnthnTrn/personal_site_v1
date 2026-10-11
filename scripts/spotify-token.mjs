// One-time helper: prints the SPOTIFY_REFRESH_TOKEN for .env.local.
// Run with `npm run spotify:token` after setting the client id and secret.
import http from "node:http";

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const redirect = "http://127.0.0.1:8888/callback";
const scope = "user-read-currently-playing user-read-recently-played";
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
    console.log(`\nAdd this line to .env.local:\n\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    res.end("Done. You can close this tab and go back to the terminal.");
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => console.log(`Open this URL and approve access:\n\n${authorize}\n`));
