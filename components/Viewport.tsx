"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number; tint: string };

const TINTS = ["255,255,255", "255,255,255", "200,225,255", "255,236,214"];

// Deterministic so the sky is the same on every visit.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// The view out of the window: stars and the planet below.
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
          <div className="clouds" />
        </div>
      </div>
      <div className="glass" />
      <div className="dim" />
      <div className="shutter shutter-top" />
      <div className="shutter shutter-bottom" />
    </div>
  );
}
