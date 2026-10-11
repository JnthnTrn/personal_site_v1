const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1/me";

export type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  art: string | null;
  url: string;
  playedAt: string | null;
};

export type TopArtist = { name: string; image: string | null; url: string };
export type TopTrack = { title: string; artist: string; url: string };
export type Favorites = { artist: TopArtist | null; tracks: TopTrack[] };

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

  const now = await fetch(`${API}/player/currently-playing`, { headers, cache: "no-store" });
  if (now.status === 200) {
    const data = await now.json();
    if (data.item?.album) return toTrack(data.item, Boolean(data.is_playing), null);
  }

  const recent = await fetch(`${API}/player/recently-played?limit=1`, { headers, cache: "no-store" });
  if (!recent.ok) throw new Error(`Spotify recently-played failed: ${recent.status}`);
  const last = (await recent.json()).items?.[0];
  return last ? toTrack(last.track, false, last.played_at) : null;
}

let favorites: { data: Favorites; expires: number } | null = null;

// Most played artist over Spotify's longest window, and the tracks on repeat this month.
// These move slowly, so they are fetched at most once an hour.
export async function topFavorites(): Promise<Favorites> {
  if (favorites && favorites.expires > Date.now()) return favorites.data;
  const headers = { Authorization: `Bearer ${await accessToken()}` };

  const [artistRes, tracksRes] = await Promise.all([
    fetch(`${API}/top/artists?time_range=long_term&limit=1`, { headers, cache: "no-store" }),
    fetch(`${API}/top/tracks?time_range=short_term&limit=3`, { headers, cache: "no-store" }),
  ]);
  // A refresh token issued without the user-top-read scope gets a 403 here.
  if (!artistRes.ok || !tracksRes.ok) return { artist: null, tracks: [] };

  const artist = (await artistRes.json()).items?.[0];
  const tracks: SpotifyTrack[] = (await tracksRes.json()).items ?? [];
  const data: Favorites = {
    artist: artist
      ? {
          name: artist.name,
          image: artist.images?.at(-1)?.url ?? null,
          url: artist.external_urls.spotify,
        }
      : null,
    tracks: tracks.map((t) => ({
      title: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      url: t.external_urls.spotify,
    })),
  };
  favorites = { data, expires: Date.now() + 3600 * 1000 };
  return data;
}
