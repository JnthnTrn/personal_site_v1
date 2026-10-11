import { connection } from "next/server";
import { latestTrack, spotifyConfigured, topFavorites } from "@/lib/spotify";

export async function GET() {
  // Opt out of build-time prerendering: this must be answered per request.
  await connection();
  if (!spotifyConfigured()) return Response.json({ configured: false, track: null, favorites: null });
  try {
    const [track, favorites] = await Promise.all([latestTrack(), topFavorites().catch(() => null)]);
    return Response.json(
      { configured: true, track, favorites },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" } },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ configured: true, track: null, favorites: null }, { status: 502 });
  }
}
