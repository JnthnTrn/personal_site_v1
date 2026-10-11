import { connection } from "next/server";
import { latestTrack, spotifyConfigured } from "@/lib/spotify";

export async function GET() {
  // Opt out of build-time prerendering: this must be answered per request.
  await connection();
  if (!spotifyConfigured()) return Response.json({ configured: false, track: null });
  try {
    return Response.json(
      { configured: true, track: await latestTrack() },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" } },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ configured: true, track: null }, { status: 502 });
  }
}
