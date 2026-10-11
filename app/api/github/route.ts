import { site } from "@/lib/site";

// GitHub has no token-free API for the contribution calendar, so this reads the
// public calendar fragment. If its markup changes, the heatmap simply disappears.
async function calendar() {
  const res = await fetch(`https://github.com/users/${site.github}/contributions`, {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const days = [...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)]
    .map((m) => ({ date: m[1], level: Number(m[2]) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length === 0) return null;
  const total = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1] ?? null;
  return { days, total: total ? Number(total.replace(/,/g, "")) : null };
}

export async function GET() {
  return Response.json(
    { calendar: await calendar().catch(() => null) },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
