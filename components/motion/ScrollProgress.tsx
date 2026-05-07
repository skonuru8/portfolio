"use client";

import { useEffect, useRef } from "react";

/**
 * A 2px fixed cyan bar at the top of the viewport that tracks scroll progress.
 * Uses transform: scaleX on a full-width div — GPU-accelerated, no layout thrashing.
 * Intentionally not disabled by prefers-reduced-motion (it's a utility cue, not a decorative effect).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;

    const tick = () => {
      // Pause when tab is not visible
      if (document.visibilityState !== "hidden") {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? scrolled / total : 0;
        bar.style.transform = `scaleX(${progress})`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-accent"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
