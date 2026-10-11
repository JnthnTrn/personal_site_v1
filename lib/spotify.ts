const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1/me/player";

export type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  art: string | null;
  url: string;
  playedAt: string | null;
};

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

let cached: { token: string; expires: number } | null = null;

export function spotifyConfigured() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  return Boolean(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET && SPOTIFY_REFRESH_TOKEN);
}

async function accessToken() {
  if (cached && cached.expires > Date.now()) return cached.token;
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN! }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`);
  const data = await res.json();
  cached = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.token;
}

function toTrack(item: SpotifyTrack, isPlaying: boolean, playedAt: string | null): Track {
  return {
    isPlaying,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album.name,
    art: item.album.images[1]?.url ?? item.album.images[0]?.url ?? null,
    url: item.external_urls.spotify,
    playedAt,
  };
}

// The song playing right now, or failing that the last one that finished.
export async function latestTrack(): Promise<Track | null> {
  const headers = { Authorization: `Bearer ${await accessToken()}` };

  const now = await fetch(`${API}/currently-playing`, { headers, cache: "no-store" });
  if (now.status === 200) {
    const data = await now.json();
    if (data.item?.album) return toTrack(data.item, Boolean(data.is_playing), null);
  }

  const recent = await fetch(`${API}/recently-played?limit=1`, { headers, cache: "no-store" });
  if (!recent.ok) throw new Error(`Spotify recently-played failed: ${recent.status}`);
  const last = (await recent.json()).items?.[0];
  return last ? toTrack(last.track, false, last.played_at) : null;
}
