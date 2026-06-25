"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/lib/motion";
import { useDeviceTier } from "@/lib/device-tier";

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

// Spread words evenly across the horizontal line on convergence
function targetX(i: number): string {
  return `${4 + i * (90 / (N - 1))}%`;
}

/**
 * The cyan→indigo gradient line. Bidirectional: scaleX 0→1 on enter, 1→0 on leave.
 */
function SignalLine({
  inView,
  delay,
}: {
  inView: boolean;
  delay: number;
}) {
  const lineStyle: React.CSSProperties = {
    top: `${SIGNAL_Y}%`,
    left: "4%",
    right: "4%",
    height: "2px",
    background: "linear-gradient(90deg, #38bdf8, #6366f1)",
    transformOrigin: "left center",
  };

  return (
    <>
      <motion.div
        className="absolute"
        style={lineStyle}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{
          opacity: inView ? 0.6 : 0,
          scaleX: inView ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          // delay only applies on the way in (line draws after morph completes)
          delay: inView ? delay : 0,
        }}
      />
      {/* Pulse wave — fires once after line draws */}
      <motion.div
        className="absolute"
        style={{ ...lineStyle, transformOrigin: "left center" }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? {
          opacity: [0, 0, 0.9, 0],
          scaleX: [0, 0, 1, 1],
        } : { opacity: 0, scaleX: 0 }}
        transition={{
          duration: 1.2,
          delay: inView ? delay + 0.1 : 0,
          ease: "easeOut",
          times: [0, 0.3, 0.6, 1],
        }}
      />
    </>
  );
}

// Static resolved-state div: gradient line drawn, no animation.
// Used by both Tier C (reduced-motion) and Tier B (lean devices).
function ResolvedState({ divRef }: { divRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={divRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute"
        style={{
          top: `${SIGNAL_Y}%`,
          left: "4%",
          right: "4%",
          height: "2px",
          background: "linear-gradient(90deg, #38bdf8, #6366f1)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

export function NoiseToSignalHero() {
  const reduce = useReducedMotion();
  const tier = useDeviceTier();
  const mobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "0px 0px -20% 0px" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Tier C (reduced-motion) and Tier B (lean): render the fully-resolved state.
  // Tier B saves ~13 simultaneous Framer Motion animations on first paint.
  // The lime underscore is handled by the Tier B CSS rule (scaleX(1) immediately).
  if (reduce || tier === "b") {
    return <ResolvedState divRef={containerRef} />;
  }

  const duration = mobile ? 0.8 : 1.6;
  // Signal line draws just after words finish converging (only on enter)
  const lineDelay = mobile ? 0.7 : 1.4;

  // Pre-hydration: render words at scattered positions with no animation.
  // Must match the Framer Motion `initial` state exactly to avoid hydration jump.
  if (!mounted) {
    return (
      <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
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
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
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
          animate={
            inView
              ? {
                  // Converged + faded: words "resolve" into the signal line
                  left: targetX(i),
                  top: `${SIGNAL_Y}%`,
                  rotate: 0,
                  opacity: 0,
                }
              : {
                  // Re-scattered: original positions restored
                  left: `${INITIAL_POS[i].x}%`,
                  top: `${INITIAL_POS[i].y}%`,
                  rotate: INITIAL_POS[i].rot,
                  opacity: 0.4,
                }
          }
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}

      <SignalLine inView={inView} delay={lineDelay} />
    </div>
  );
}
