"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number; tint: string };

const TINTS = ["255,255,255", "255,255,255", "200,225,255", "255,236,214"];

// One cruiser hull drawn once and reused at different sizes for depth; Banshees cross in pairs.
function Fleet() {
  return (
    <div className="fleet">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8f7fb8" />
            <stop offset="0.35" stopColor="#4b3d6e" />
            <stop offset="1" stopColor="#120e22" />
          </linearGradient>
          <radialGradient id="drive">
            <stop offset="0" stopColor="#e6f6ff" />
            <stop offset="0.35" stopColor="#7fc8ff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#5a7dff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8fe6ff" stopOpacity="0" />
            <stop offset="1" stopColor="#c9f4ff" stopOpacity="0.85" />
          </linearGradient>
          <symbol id="cruiser" viewBox="-10 0 440 120">
            <ellipse cx="402" cy="58" rx="26" ry="9" fill="url(#drive)" />
            <path
              d="M0,62 C10,40 45,30 75,34 C100,37 108,50 125,50 C150,50 165,24 205,22 C250,20 300,22 340,34 C365,41 390,50 400,58 C392,64 375,70 350,76 C320,84 290,96 240,98 C200,100 160,78 135,72 C115,68 105,90 70,90 C35,90 8,80 0,62 Z"
              fill="url(#hull)"
              stroke="rgba(205,190,255,0.4)"
              strokeWidth="0.8"
            />
            <path d="M18,66 C40,74 70,76 100,66 M150,62 C200,74 290,72 370,58" fill="none" stroke="#0c0918" strokeWidth="2.5" opacity="0.6" />
            <g fill="#bfeaff">
              <circle cx="40" cy="56" r="1.3" />
              <circle cx="52" cy="54" r="1.3" />
              <circle cx="64" cy="53" r="1.3" />
              <circle cx="190" cy="46" r="1.3" />
              <circle cx="206" cy="45" r="1.3" />
              <circle cx="222" cy="45" r="1.3" />
              <circle cx="238" cy="45" r="1.3" />
              <circle cx="254" cy="46" r="1.3" />
              <circle cx="300" cy="50" r="1.3" />
              <circle cx="314" cy="52" r="1.3" />
            </g>
            <g fill="#ff9be0">
              <circle cx="232" cy="88" r="1.8" />
              <circle cx="78" cy="80" r="1.5" />
            </g>
          </symbol>
          <symbol id="banshee" viewBox="-130 0 190 30">
            <rect x="-130" y="13.6" width="140" height="2.8" rx="1.4" fill="url(#trail)" />
            <path d="M40,11 C34,2 22,0 10,1 C17,4 23,8 27,11 Z M40,19 C34,28 22,30 10,29 C17,26 23,22 27,19 Z" fill="#5b4a86" />
            <path d="M60,15 C50,9 30,9 18,12 L8,15 L18,18 C30,21 50,21 60,15 Z" fill="#8a78b8" />
            <circle cx="9" cy="15" r="2.6" fill="#d8f6ff" />
          </symbol>
        </defs>
      </svg>

      {["a", "b", "c", "d", "e"].map((id) => (
        <svg key={id} className={`cruiser cruiser-${id}`} viewBox="0 0 440 120">
          <use href="#cruiser" />
        </svg>
      ))}
      {["a", "b", "c", "d", "e"].map((id) => (
        <div key={id} className={`banshee banshee-${id}`}>
          <svg viewBox="0 0 190 30">
            <use href="#banshee" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// Deterministic so the sky is the same on every visit.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// The view from orbit over Reach: stars, the planet below, and a Covenant fleet holding station.
// Layers shift by different amounts with the pointer so the glass feels like it has depth.
export default function Viewport() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rand = rng(117);
      stars = Array.from({ length: Math.min(900, Math.round((w * h) / 2200)) }, () => {
        const big = rand() > 0.94;
        return {
          x: rand() * w,
          y: rand() * h,
          r: big ? 1 + rand() * 0.7 : 0.35 + rand() * 0.55,
          a: big ? 0.75 + rand() * 0.25 : 0.2 + rand() * 0.55,
          speed: 0.4 + rand() * 1.4,
          phase: rand() * Math.PI * 2,
          tint: TINTS[Math.floor(rand() * TINTS.length)],
        };
      });
      draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = still ? 1 : 0.78 + 0.22 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.fillStyle = `rgba(${s.tint},${s.a * twinkle})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // Scroll drives how far the planet has risen and how much the view dims behind the panels.
    const onScroll = () => {
      el.style.setProperty("--sy", Math.min(window.scrollY / window.innerHeight, 1.5).toFixed(4));
    };

    let frame = 0;
    let last = 0;
    const tick = (t: number) => {
      frame = requestAnimationFrame(tick);
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      el.style.setProperty("--px", px.toFixed(4));
      el.style.setProperty("--py", py.toFixed(4));
      if (t - last > 50) {
        last = t;
        draw(t);
      }
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!still) {
      window.addEventListener("pointermove", onPointer);
      frame = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div className="scene" ref={root} aria-hidden="true">
      <canvas className="stars" ref={canvas} />
      <div className="orbit">
        <div className="planet">
          <div className="land" />
          <div className="clouds" />
        </div>
      </div>
      <Fleet />
      <div className="glass" />
      <div className="dim" />
      <div className="shutter shutter-top" />
      <div className="shutter shutter-bottom" />
    </div>
  );
}
