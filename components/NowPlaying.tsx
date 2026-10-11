"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/lib/spotify";

type State = { configured: boolean; track: Track | null } | null;

function ago(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export default function NowPlaying() {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.hidden) return;
      fetch("/api/now-playing")
        .then((r) => r.json())
        .then((data) => alive && setState(data))
        .catch(() => alive && setState({ configured: true, track: null }));
    };
    load();
    const id = setInterval(load, 30000);
    document.addEventListener("visibilitychange", load);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  const track = state?.track;

  if (!track) {
    const message = !state
      ? "Scanning for signal…"
      : state.configured
        ? "Nothing on the air right now."
        : "Spotify isn't linked yet.";
    return (
      <div className="track track-empty">
        <div className="track-art" />
        <div className="track-meta">
          <span className="status">No signal</span>
          <p className="track-title">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <a className="track" href={track.url} target="_blank" rel="noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {track.art ? <img className="track-art" src={track.art} alt="" /> : <div className="track-art" />}
      <div className="track-meta">
        <span className={track.isPlaying ? "status status-live" : "status"}>
          {track.isPlaying ? (
            <>
              <span className="bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              Playing now
            </>
          ) : (
            `Last played${track.playedAt ? ` · ${ago(track.playedAt)}` : ""}`
          )}
        </span>
        <p className="track-title">{track.title}</p>
        <p className="track-artist">{track.artist}</p>
      </div>
    </a>
  );
}
