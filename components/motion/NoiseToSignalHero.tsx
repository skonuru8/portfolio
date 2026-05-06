"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/motion";

const NOISE_WORDS = [
  "latency",
  "manual review",
  "risk",
  "handoff",
  "queue",
  "rework",
  "unclear ownership",
  "deployment friction",
  "slow workflow",
  "sensitive data",
] as const;

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}

export function NoiseToSignalHero() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (reduce || mobile) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40" aria-hidden>
        <div className="flex flex-wrap gap-2 p-4">
          {NOISE_WORDS.map((w) => (
            <span
              key={w}
              className="font-mono-label text-[10px] uppercase tracking-wider text-ink-muted/60"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* SSR + first client paint: static markup only (avoids Framer SSR/client style drift). */
  if (!mounted) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {NOISE_WORDS.map((word, i) => {
          const angle = (i / NOISE_WORDS.length) * Math.PI * 2;
          const r = 38 + (i % 3) * 6;
          const x0 = 50 + Math.cos(angle) * r;
          const y0 = 42 + Math.sin(angle) * (r * 0.7);
          return (
            <span
              key={word}
              className="absolute font-mono-label text-[10px] uppercase tracking-widest text-ink-muted/50"
              style={{
                left: fmtPct(x0),
                top: fmtPct(y0),
                opacity: 0.4,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {NOISE_WORDS.map((word, i) => {
        const angle = (i / NOISE_WORDS.length) * Math.PI * 2;
        const r = 38 + (i % 3) * 6;
        const x0 = 50 + Math.cos(angle) * r;
        const y0 = 42 + Math.sin(angle) * (r * 0.7);
        const jitterX = ((i * 7) % 5) * 5 - 10;
        const jitterY = ((i * 11) % 5) * 4 - 8;
        return (
          <motion.span
            key={word}
            className="absolute font-mono-label text-[10px] uppercase tracking-widest text-ink-muted/50"
            style={{ left: fmtPct(x0), top: fmtPct(y0) }}
            initial={{ opacity: 0.3, x: jitterX, y: jitterY }}
            animate={{
              opacity: [0.35, 0.55, 0.4],
              x: 0,
              y: 0,
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
