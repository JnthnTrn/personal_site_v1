"use client";

import { useEffect, useState } from "react";

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

  return (
    <figure className="heat">
      <div className="heat-scroll">
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
