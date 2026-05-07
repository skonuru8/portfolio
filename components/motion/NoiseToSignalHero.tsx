"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/motion";

const NOISE_WORDS = [
  "delay",
  "risk",
  "rework",
  "manual review",
  "handoff",
  "latency",
  "ambiguity",
  "queue",
  "bottleneck",
  "unstructured",
  "bug",
  "friction",
  "noise",
] as const;

// Deterministic scattered initial positions (% of container).
// Fixed values avoid SSR / client hydration mismatch.
const INITIAL_POS = [
  { x: 8,  y: 15, rot: -6 },
  { x: 72, y: 8,  rot:  4 },
  { x: 18, y: 75, rot: -3 },
  { x: 85, y: 30, rot:  7 },
  { x: 55, y: 85, rot: -5 },
  { x: 35, y: 20, rot:  2 },
  { x: 62, y: 60, rot: -8 },
  { x: 12, y: 55, rot:  5 },
  { x: 88, y: 70, rot: -4 },
  { x: 42, y: 90, rot:  6 },
  { x: 25, y: 40, rot: -7 },
  { x: 78, y: 50, rot:  3 },
  { x: 50, y: 12, rot: -2 },
] as const;

const N = NOISE_WORDS.length;
// Vertical position of the converged signal line (% from top of container)
const SIGNAL_Y = 46;

// Spread words evenly across the horizontal line
function targetX(i: number): string {
  return `${4 + i * (90 / (N - 1))}%`;
}

// The resolved gradient line — shared between static fallback and animated state
function SignalLine({ animated = false, lineDelay = 0 }: { animated?: boolean; lineDelay?: number }) {
  const lineStyle: React.CSSProperties = {
    top: `${SIGNAL_Y}%`,
    left: "4%",
    right: "4%",
    height: "2px",
    background: "linear-gradient(90deg, #38bdf8, #6366f1)",
    transformOrigin: "left center",
  };

  if (!animated) {
    return <div className="absolute" style={{ ...lineStyle, opacity: 0.6 }} />;
  }

  return (
    <motion.div
      className="absolute"
      style={lineStyle}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 0.6, scaleX: 1 }}
      transition={{ delay: lineDelay, duration: 0.5, ease: "easeOut" }}
    />
  );
}

export function NoiseToSignalHero() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Reduced motion: render the fully-resolved state immediately — no morph.
  if (reduce) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <SignalLine animated={false} />
      </div>
    );
  }

  const duration = mobile ? 0.8 : 1.6;
  // Signal line appears just before words finish converging
  const lineDelay = mobile ? 0.7 : 1.4;

  // Pre-hydration: render words at scattered positions with no animation.
  // Matches the Framer Motion initial state so there is no visual jump on mount.
  if (!mounted) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {NOISE_WORDS.map((word, i) => (
          <span
            key={word}
            className="absolute font-mono-label text-[10px] uppercase tracking-widest text-ink-muted/50"
            style={{
              left: `${INITIAL_POS[i].x}%`,
              top: `${INITIAL_POS[i].y}%`,
              rotate: `${INITIAL_POS[i].rot}deg`,
              opacity: 0.4,
            }}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Noise words converge to a horizontal line then fade out */}
      {NOISE_WORDS.map((word, i) => (
        <motion.span
          key={word}
          className="absolute font-mono-label text-[10px] uppercase tracking-widest text-ink-muted/50"
          initial={{
            left: `${INITIAL_POS[i].x}%`,
            top: `${INITIAL_POS[i].y}%`,
            rotate: INITIAL_POS[i].rot,
            opacity: 0.4,
          }}
          animate={{
            left: targetX(i),
            top: `${SIGNAL_Y}%`,
            rotate: 0,
            opacity: 0,
          }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}

      {/* Cyan → indigo gradient line draws itself in as words finish converging */}
      <SignalLine animated lineDelay={lineDelay} />
    </div>
  );
}
