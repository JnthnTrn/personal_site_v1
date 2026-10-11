"use client";

import { useEffect, useState } from "react";

const monthName = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

type Calendar = {
  days: { date: string; level: number }[];
  total: number | null;
};

// Contribution heatmap. Renders nothing if GitHub does not answer.
export default function Contributions() {
  const [data, setData] = useState<Calendar | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => setData(d.calendar))
      .catch(() => {});
  }, []);

  if (!data) return null;
  const calendar = data;

  // Week column of each day, so a month label can sit above the week that month starts in.
  const offset = new Date(`${calendar.days[0].date}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((offset + calendar.days.length) / 7);
  const months: { label: string; column: number }[] = [];
  calendar.days.forEach((d, i) => {
    if (!d.date.endsWith("-01")) return;
    const column = Math.floor((offset + i) / 7) + 1;
    // The last column has no room for a label.
    if (column < weeks) months.push({ label: monthName.format(new Date(`${d.date}T00:00:00Z`)), column });
  });

  return (
    <figure className="heat">
      <div className="heat-scroll">
        <div className="heat-months" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }} aria-hidden="true">
          {months.map((m) => (
            <span key={m.column} style={{ gridColumnStart: m.column }}>
              {m.label}
            </span>
          ))}
        </div>
        <div
          className="heat-grid"
          role="img"
          aria-label={
            calendar.total === null
              ? "Contribution calendar for the last year"
              : `${calendar.total} contributions in the last year`
          }
        >
          {calendar.days.map((d, i) => (
            <i
              key={d.date}
              data-level={d.level}
              title={d.date}
              style={
                i === 0
                  ? {
                      gridRowStart:
                        new Date(`${d.date}T00:00:00Z`).getUTCDay() + 1,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
      <figcaption>
        {calendar.total !== null && (
          <span>
            <strong>{calendar.total.toLocaleString("en-US")}</strong>{" "}
            contributions in the last year
          </span>
        )}
        <span className="heat-key" aria-hidden="true">
          Less <i data-level="0" />
          <i data-level="1" />
          <i data-level="2" />
          <i data-level="3" />
          <i data-level="4" /> More
        </span>
      </figcaption>
    </figure>
  );
}
